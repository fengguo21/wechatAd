let version = "1.0.5";
var CryptoJS = require("./crypto-js");
let addata = "";
let systemInfo = "";
let btnArea = "";
let btnAreaClose = "";
let closeBtn = "";
let adMain = "";
let adIcon = "";
let isMuted = false;

//class
export default class Advertise {
  constructor({
    adType,
    ctx,
    // canvas,
    appid,
    slotid,
    uuid,
    wxopt,
    userinfo,
    hasUUid
  }) {
    this.ctx = ctx;
    this.unClick = true;
    this.appid = appid;
    this.loaded = false;
    this.canvas = ctx.canvas;
    this.adType = adType;
    if (this.adType == "fullScreen") {

    }
    if (this.adType == "bottomBanner") {
      this.clickad = this.click.bind(this);
      this.canvas.addEventListener("touchstart", this.clickad);

    }

    this.advertise({
      adType: adType,
      canvas: canvas,
      ctx: ctx,
      appid: appid,
      slotid,
      uuid,
      wxopt,
      hasUUid
    });
  }
  //用户未设置uuid,则设置临时uuid
  setTempUuid() {
    let self = this;
    let uuid = "";
    for (let i = 0; i < 8; i++) {
      let str = Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
      uuid += str;
    }
    if (wx.getStorageSync("aduuid")) {
      // self.properties.adInfo.uuid = wx.getStorageSync("aduuid");
    } else {
      wx.setStorageSync("aduuid", uuid);
      // self.properties.adInfo.uuid = uuid;
    }
  }
  // 获取网络类型
  getNetworkType() {
    return new Promise(function (resolve, reject) {
      wx.getNetworkType({
        success(res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = 0;
          switch (res.networkType) {
            case "unknown":
              networkType = 0;
              break;
            case "wifi":
              networkType = 1;
              break;
            case "2g":
              networkType = 2;
              break;
            case "3g":
              networkType = 3;
              break;
            case "4g":
              networkType = 4;
              break;
          }
          resolve(networkType);
        }
      });
    });
  }

  //获取设备类型
  getCellphoneSystemInfo() {
    return new Promise(function (resolve, reject) {
      wx.getSystemInfo({
        success: function (res) {
          systemInfo = res;
          console.log(res);
          resolve(res);
        }
      });
    });
  }

  // 获取随机字符串
  randomString(len) {
    len = len || 32;
    var $chars =
      "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = "";
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
  // 加密
  encode(str) {
    let key = CryptoJS.enc.Utf8.parse("Zyz#Wx1820&&2468");

    var ciphertext = CryptoJS.AES.encrypt(str, key, {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return ciphertext.ciphertext.toString(CryptoJS.enc.Hex);
  }

  // 平台曝光
  im(params) {
    var self = this;
    let t = parseInt(Date.parse(new Date()) / 1000);
    console.log(t);
    let replaceStr = params.sign + "|" + t;
    console.log(typeof replaceStr);
    let encodeStr = self.encode(replaceStr);
    let url = params.ims[0].replace("__EXT__", params.ext); //接口地址
    url = url.replace("__SIGN__", encodeStr); //接口地址
    wx.request({
      url: url, //接口地址
      header: {
        "content-type": "application/json", // 默认值
        "x-api-version": "1.0.0"
      },
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res);
        }
      },
      fail: function (err) {
        console.log("im接口加载失败", err);
      }
    });
  }
  // 平台点击
  ck(params) {
    var self = this;

    // 获取广告图片
    let t = parseInt(Date.parse(new Date()) / 1000);
    let replaceStr = params.sign + "|" + t;
    let encodeStr = self.encode(replaceStr);
    let url = params.cks[0].replace("__EXT__", params.ext); //接口地址
    url = url.replace("__SIGN__", encodeStr); //接口地址
    wx.request({
      url: url, //接口地址
      header: {
        "content-type": "application/json" // 默认值
      },
      success: function (res) {
        if (res.statusCode === 200) {
          // console.log(res);
        }
      },
      fail: function (err) {
        console.log("ck接口加载失败", err);
      }
    });
  }
  //点击

  click(e) {
    var self = this;

    e.preventDefault();

    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    console.log(x, y);
    if (x > btnArea.left && y >= btnArea.top) {
      console.log(addata, "--------------------=============");
      wx.navigateToMiniProgram({
        appId: this.addata.link,
        // path: "pages/nav/nav?slotid=slotid&adid=2",
        complete: function (res) {}
      });
      self.ck(self.addata);
      return;
    }
    if (
      x < btnAreaClose.right &&
      x > btnAreaClose.left &&
      y < btnAreaClose.bottom &&
      y >= btnAreaClose.top
    ) {
      isMuted = true;
      console.log("clole  nute");
      self.advideo.pause();
      wx.showModal({
        title: "提示",
        content: "观看完整视频可获得奖励",
        confirmText: '关闭广告',
        cancelText: '继续观看',


        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            self.advideo.destroy();
            window.cancelAnimationFrame(self.bannerAniId);
            self.videoPlaying = false;
          } else if (res.cancel) {
            console.log("用户点击取消");
            self.advideo.play();
          }
        }
      });
    }
  }

  advertise({
    adType,
    canvas,
    ctx,
    appid,
    slotid,
    uuid,
    wxopt,
    userinfo,
    hasUUid
  }) {
    var self = this;
    var appid = appid;
    // 判断openid是否必填,不必填随机32位字符串存入缓存作为uuid的值
    if (hasUUid === false) {
      this.setTempUuid();
    }
    // 获取网络类型,获取设备类型
    Promise.all([this.getNetworkType(), this.getCellphoneSystemInfo()])
      .then(results => {
        this.results = results;
        this.getContent({
          canvas: canvas,
          ctx: ctx,
          results: results,
          appid: appid,
          slotid,
          uuid,
          wxopt,
          hasUUid
        }).then(res => {
          console.log(adType, "ren-------------");
        });
      })
      .then(function (res) {
        console.log("test==========");
      });
  }
  getContent({
    adType,
    ctx,
    results,
    appid,
    slotid,
    uuid,
    wxopt,
    userinfo
  }) {
    let self = this;
    return new Promise(function (resolve, reject) {
      // 请求参数
      var requestParams = {
        plugv: version,
        appid: appid,
        slotid: slotid,
        uuid: uuid,
        wxopt: wxopt,
        userinfo: userinfo, //   // 请求ID
        reqid: new Date().getTime() + self.randomString(17), //   // 设备型号
        model: results[1].model, //   // 操作系统
        os: results[1].system.indexOf("iOS") != -1 ?
          1 : results[1].system.indexOf("Android") != -1 ?
          2 : 0, //   // 操作系统版本
        osv: results[1].system, //   // 微信版本
        wxv: results[1].version, //   // 小程序接口版本
        wxpv: results[1].SDKVersion, //   // 网络类型
        net: results[0].networkType
      };
      console.log(requestParams);

      // // 获取广告图片
      wx.request({
        url: "https://api-sailfish.optaim.com/link", //接口地址
        data: requestParams,
        header: {
          "content-type": "application/json", // 默认值
          "x-api-version": "1.0.0"
        },
        method: "POST",
        success: function (res) {
          self.addata = res.data;
          wx.downloadFile({
            url: self.addata.icon.url,
            success: function (e) {
              console.log(e.tempFilePath);
              adIcon = e.tempFilePath;
            }
          });
          wx.downloadFile({
            url: self.addata.main.url,
            success: function (e) {
              console.log(e.tempFilePath);
              adMain = e.tempFilePath;
              self.loaded = true;
            }
          });

          if (res.data) {
            self.im(self.addata);
          }
        },
        fail: function (err) {
          console.log("广告接口加载失败", err);
        }
      });
    });
  }

  drawBottomBanner() {
    console.log('banner-----------')
    let self = this;
    const screenWidth = this.results[1].windowWidth;
    const screenHeight = this.results[1].windowHeight;
    const imgWidth = screenWidth * 0.7;
    const imgHeight = screenWidth * .35;
    btnArea = {
      top: screenHeight - screenWidth * .35,
      left: imgWidth,
      right: screenWidth,
      bottom: screenHeight
    };
    var image = wx.createImage();
    image.src = adMain;
    self.ctx.drawImage(image, 0, screenHeight - imgHeight, imgWidth, imgHeight);
    self.ctx.fillStyle = "#FFFFFF";

    self.ctx.fillRect(
      screenWidth * 0.7,
      screenHeight - imgHeight,
      screenWidth * 0.3,
      imgHeight
    );
    var logo = wx.createImage();
    logo.src = adIcon;
    self.ctx.drawImage(
      logo,
      screenWidth * 0.85 - 20,
      screenHeight - imgHeight + 10,
      40,
      40
    );
    self.ctx.fillStyle = "#000";
    self.ctx.font = "12px Arial";
    self.ctx.fillText(
      this.addata.title,
      screenWidth * 0.85 - 30,
      screenHeight - imgHeight * 0.4
    );
    self.ctx.beginPath();
    self.ctx.strokeStyle = "#51c332";
    self.ctx.fillStyle = "#51c332";
    self.ctx.font = "20px Arial";
    self.roundRect(
      self.ctx,
      screenWidth * 0.85 - 25,
      screenHeight - imgHeight * 0.3,
      60,
      30,
      5,
      true
    );
    self.ctx.fillText(
      "查看",
      screenWidth * 0.85 - 17,
      screenHeight - imgHeight * 0.25 + 16
    );
    this.clickad = this.click.bind(this);
  }
  playVideo(cb) {
    let self = this;
    this.videoPlaying = true;
    self.advideo = wx.createVideo({
      x: 0,
      y: this.canvas.width * 0.34,
      autoplay: true,
      controls: false,
      muted: isMuted,
      objectFit: 'contain',

      width: this.canvas.width,
      height: this.canvas.height - this.canvas.width * 0.69,
      src: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
    });

    this.clickad = this.click.bind(this);
    self.canvas.addEventListener("touchstart", this.clickad);

    self.advideo.onPlay(() => {
      // self.advideo.seek(327);
    });
    self.drawVideoInfoLoop = this.drawVideoInfo.bind(self)
    window.cancelAnimationFrame(this.bannerAniId);

    self.bannerAniId = window.requestAnimationFrame(
      this.drawVideoInfoLoop,
      self.canvas
    )
    // self.drawVideoInfo();

    self.advideo.onEnded(() => {
      // this.aaa = ''
      self.canvas.removeEventListener("touchstart", this.clickad);
      self.advideo.destroy();
      window.cancelAnimationFrame(self.bannerAniId);
      // self.videoPlaying = false;

      cb();
    });
  }
  drawVideoInfo() {
    console.log('drawVideoInfo---------')
    let self = this;
    const screenWidth = this.results[1].windowWidth;
    const screenHeight = this.results[1].windowHeight;
    const imgWidth = screenWidth * 0.7;
    const imgHeight = this.canvas.width * 0.35;
    self.ctx.fillStyle = "#000";

    self.ctx.fillRect(0, screenHeight - imgHeight, screenWidth, imgHeight);
    self.ctx.fillRect(0, 0, screenWidth, imgHeight);
    self.ctx.save();
    self.ctx.strokeStyle = "white";
    self.ctx.fillStyle = "white";
    self.ctx.font = "16px Arial";
    self.roundRect(
      self.ctx,
      screenWidth * 0.05,
      screenWidth * 0.03,
      90,
      30,
      15,
      true
    );
    self.ctx.fillText(
      " 关闭广告 ",
      screenWidth * 0.05 + 10,
      screenWidth * 0.03 + 22
    );

    self.ctx.restore();

    self.ctx.fillStyle = "#fff";
    self.roundRect(
      self.ctx,
      10,
      screenHeight - imgHeight + 10,
      screenWidth - 20,
      imgHeight - 20,
      5
    );
    btnArea = {
      top: screenHeight - screenWidth / 3.5,
      left: imgWidth,
      right: screenWidth,
      bottom: screenHeight
    };
    btnAreaClose = {
      top: screenWidth * 0.03,
      left: screenWidth * 0.05,
      right: 110 + screenWidth * 0.05,
      bottom: screenWidth * 0.03 + 30
    };

    var logo = wx.createImage();
    logo.src = adIcon;
    self.ctx.drawImage(logo, 30, screenHeight - imgHeight * 0.5 - 20, 40, 40);
    self.ctx.fillStyle = "#000";
    self.ctx.font = "20px Arial";
    let adtitle = self.addata.title;
    self.ctx.fillText(
      adtitle,
      screenWidth * 0.5 - 60,
      screenHeight - imgHeight * 0.5 + 10
    );
    self.ctx.beginPath();
    self.ctx.strokeStyle = "#51c332";
    self.ctx.fillStyle = "#51c332";
    self.roundRect(
      self.ctx,
      screenWidth * 0.85 - 40,
      screenHeight - imgHeight * 0.5 - 15,
      60,
      30,
      5,
      true
    );
    self.ctx.fillText(
      "查看",
      screenWidth * 0.85 - 30,
      screenHeight - imgHeight * 0.5 + 7
    );
    self.bannerAniId = window.requestAnimationFrame(
      self.drawVideoInfoLoop,
      self.canvas
    )
  }

  roundRect(ctx, x, y, width, height, r, isStroke) {
    ctx.save();
    ctx.beginPath(); // draw top and top right corner
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner
    ctx.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner
    ctx.arcTo(x, y, x + r, y, r);
    if (isStroke) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.restore();

    ctx.closePath();

  }


  drawFullScreen() {
    let self = this;
    console.log(self.countSeconds)
    const screenWidth = this.canvas.width;
    const screenHeight = this.canvas.height;
    const imgWidth = screenWidth;
    const imgHeight = screenHeight;
    var fullScreenImg = wx.createImage();
    fullScreenImg.src = adMain;
    console.log(adMain);
    self.ctx.drawImage(fullScreenImg, 0, 0, imgWidth, imgHeight);
    self.ctx.fillStyle = "#333";
    self.roundRect(
      self.ctx,
      screenWidth - 130,
      screenHeight - 100,
      120,
      40,
      20
    );
    self.ctx.font = "20px Arial";
    self.ctx.fillStyle = "#fff";

    self.ctx.fillText(
      "剩余广告 " + self.countSeconds,
      screenWidth - 114,
      screenHeight - 72
    );
    this.fullScreenId = window.requestAnimationFrame(
      this.drawFullScreenLoop,
      canvas
    )
  }
  afterFullScreenAd() {

  }
  fullScreenAd(cb) {
    let self = this


    self.countSeconds = 6;
    let timer = setInterval(function () {
      self.countSeconds = self.countSeconds - 1;
    }, 1000);
    setTimeout(function () {
      self.adType = "";
      window.cancelAnimationFrame(self.fullScreenId);

      clearInterval(timer)
    }, 6000);


    this.drawFullScreenLoop = this.drawFullScreen.bind(self)

    // 清除上一局的动画
    window.cancelAnimationFrame(this.fullScreenId);

    this.fullScreenId = window.requestAnimationFrame(
      self.drawFullScreenLoop,
      self.canvas
    )
  }
}