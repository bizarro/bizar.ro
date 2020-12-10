import 'utils/polyfill'
import 'utils/scroll'
import 'utils/sw'

import AutoBind from 'auto-bind'
import Stats from 'stats.js'

import each from 'lodash/each'

import Responsive from 'classes/Responsive'

import About from 'pages/About'
import Case from 'pages/Case'
import Home from 'pages/Home'

import Canvas from 'components/Canvas'
import Navigation from 'components/Navigation'

class App {
  constructor () {
    if (IS_DEVELOPMENT) {
      this.createStats()
    }

    this.url = window.location.pathname

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }

    AutoBind(this)

    this.createResponsive()
    this.createCanvas()
    this.createNavigation()
    this.createAbout()
    this.createCase()
    this.createHome()

    this.pages = {
      '/': this.home,
      '/about': this.about,
      '/case': this.case
    }

    if (this.url.indexOf('/case') > -1) {
      this.page = this.case
    } else {
      this.page = this.pages[this.url]
    }

    this.page.show(this.url)

    this.addEventListeners()
    this.addLinksEventsListeners()

    this.update()
  }

  createResponsive () {
    this.responsive = new Responsive()
  }

  createCanvas () {
    this.canvas = new Canvas()
  }

  createNavigation () {
    this.navigation = new Navigation({
      canvas: this.canvas
    })

    this.navigation.onChange(this.url)
  }

  createStats () {
    this.stats = new Stats()

    document.body.appendChild(this.stats.dom)
  }

  createAbout () {
    this.about = new About()
  }

  createHome () {
    this.home = new Home()
  }

  createCase () {
    this.case = new Case()
  }

  /**
   * Change.
   */
  async onChange ({ push = !IS_DEVELOPMENT, url = null }) {
    url = url.replace(window.location.origin, '')

    if (this.url === url) return

    document.documentElement.style.overflow = 'hidden'
    document.body.style.pointerEvents = 'none'

    this.url = url

    this.canvas.onChange(this.url)

    await this.page.hide()

    window.scrollTo(0, 0)

    if (push) {
      window.history.pushState({}, document.title, url)
    }

    this.navigation.onChange(this.url)

    if (this.url.indexOf('/case') > -1) {
      this.page = this.case
    } else {
      this.page = this.pages[this.url]
    }

    await this.page.show(this.url)

    if (this.page.isScrollable) {
      document.documentElement.style.overflow = ''
    }

    document.body.style.pointerEvents = ''
  }

  /**
   * Loop.
   */
  update () {
    if (this.stats) {
      this.stats.begin()
    }

    if (this.page) {
      this.page.update()
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll.last)
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

  onPopState () {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  onResize () {
    if (this.responsive && this.responsive.onResize) {
      this.responsive.onResize()
    }

    requestAnimationFrame(_ => {
      if (this.about.isVisible) {
        this.about.onResize()
      }

      if (this.home.isVisible) {
        this.home.onResize()
      }

      if (this.case.isVisible) {
        this.case.onResize()
      }

      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize()
      }
    })
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
    window.addEventListener('popstate', this.onPopState, { passive: true })
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

  addLinksEventsListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      const isLocal = link.href.indexOf(window.location.origin) > -1

      if (isLocal) {
        link.onclick = event => {
          event.preventDefault()

          this.onChange({
            url: link.href
          })
        }
      } else if (link.href.indexOf('mailto') === -1 && link.href.indexOf('tel') === -1) {
        link.rel = 'noopener'
        link.target = '_blank'
      }
    })
  }
}

window.APP = new App()
