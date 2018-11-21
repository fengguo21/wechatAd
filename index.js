import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

// import Advertise from 'qiyuad'
import Advertise from './index.js'


let ctx = canvas.getContext('2d')
let advertise = new Advertise({
  adType: 'bottomBanner',
  // canvas: canvas,
  // type: center,
  ctx: ctx,
  // appid: 'wx0e2f322626d29451',
  appid: 'wxb57627a2a7e9cb59',
  // slotid: '12B8E77CDC48',
  slotid: '0CC494A33A69',
  adid: 2,
  hasUUid: false,
})



let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {

    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()



  }

  restart() {
    let self = this
    setTimeout(function () {


    }, 1000)

    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.advertise = advertise

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画

    window.cancelAnimationFrame(this.aniId);
    // setTimeout(function () {
    //   self.advertise.fullScreenAd(self.restart.bind(self))
    // }, 2000)


    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let area = this.gameinfo.btnArea

    // if (x >= area.startX &&
    //   x <= area.endX &&
    //   y >= area.startY &&
    //   y <= area.endY) {
    //   advertise.playVideo(this.restart.bind(this))

    // }

    this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)


    // if (advertise.loaded && advertise.adType == 'fullScreen') {
    //   advertise.drawFullScreen()
    //   return

    // }
    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)
    if (this.advertise.loaded) {
      this.advertise.drawBottomBanner()
      this.advertise.drawBubble(300, 100, 30, 30)

    }



    // 游戏结束停止帧循环
    if (databus.gameOver) {

      this.gameinfo.renderGameOver(ctx, databus.score)
      // this.advertise.draw()


      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }
  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}