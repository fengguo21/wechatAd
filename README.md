旗鱼广告
使用：
npm install qiyuad

    初始化：
    import Advertise from 'qiyuad'
    let advertise = new Advertise({
        adType: 'bottomBanner',//广告类型 'bottomBanner'

        ctx: ctx,//游戏绘图上下文
        // appid: 'wx0e2f322626d29451',
        appid: 'wxb57627a2a7e9cb59',//小程序id
        // slotid: '12B8E77CDC48',
        slotid: '0CC494A33A69',//广告位ID
        adid: 2,
        hasUUid: false,
        })






    1.底部banner:
         advertise.drawBottomBanner()//把bannerg广告画在canvas下方。（一帧）
    2.视频：
        advertise.playVideo(cb)
        //cb 为视频正常播放完执行的回调函数，中途关闭不执行。
