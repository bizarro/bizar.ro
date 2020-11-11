import 'utils/polyfill'
import 'utils/sw'

import AutoBind from 'auto-bind'
import Stats from 'stats.js'

import Canvas from 'components/Canvas'

class App {
  constructor () {
    if (IS_DEVELOPMENT) {
      this.createStats()
    }

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }

    AutoBind(this)

    this.createCanvas()

    this.addEventListeners()

    this.update()
  }

  createCanvas () {
    this.canvas = new Canvas()
  }

  createStats () {
    this.stats = new Stats()

    document.body.appendChild(this.stats.dom)
  }

  /**
   * Loop.
   */
  update () {
    if (this.stats) {
      this.stats.begin()
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page && this.page.scroll)
    }

    if (this.stats) {
      this.stats.end()
    }

    window.requestAnimationFrame(this.update)
  }

  /**
   * Events.
   */
  onContextMenu (event) {
    event.preventDefault()
    event.stopPropagation()

    return false
  }

  onResize () {
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize()
    }
  }

  onTouchDown (event) {
    event.stopPropagation()

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY

    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(this.mouse)
    }
  }

  onTouchMove (event) {
    event.stopPropagation()

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY

    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(this.mouse)
    }
  }

  onTouchUp (event) {
    event.stopPropagation()

    this.mouse.x = event.changedTouches ? event.changedTouches[0].clientX : event.clientX
    this.mouse.y = event.changedTouches ? event.changedTouches[0].clientY : event.clientY

    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(this.mouse)
    }
  }

  onWheel (event) {
    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(event)
    }
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    window.addEventListener('resize', this.onResize, { passive: true })

    window.addEventListener('mousedown', this.onTouchDown, { passive: true })
    window.addEventListener('mousemove', this.onTouchMove, { passive: true })
    window.addEventListener('mouseup', this.onTouchUp, { passive: true })

    window.addEventListener('touchstart', this.onTouchDown, { passive: true })
    window.addEventListener('touchmove', this.onTouchMove, { passive: true })
    window.addEventListener('touchend', this.onTouchUp, { passive: true })

    window.addEventListener('DOMMouseScroll', this.onWheel, { passive: true })
    window.addEventListener('mousewheel', this.onWheel, { passive: true })
    window.addEventListener('wheel', this.onWheel, { passive: true })

    window.oncontextmenu = this.onContextMenu
  }
}

window.APP = new App()
