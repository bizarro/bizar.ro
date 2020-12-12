import AutoBind from 'auto-bind'
import EventEmitter from 'events'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Prefix from 'prefix'

import Line from 'animations/Line'
import Paragraph from 'animations/Paragraph'
import Y from 'animations/Y'

import each from 'lodash/each'

import { mapEach } from 'utils/dom'

export default class extends EventEmitter {
  constructor ({ classes, element, elements, isScrollable = true }) {
    super()

    AutoBind(this)

    this.classes = {
      ...classes
    }

    this.selectors = {
      element,
      elements: {
        animationsLines: '[data-animation="line"]',
        animationsParagraphs: '[data-animation="paragraph"]',
        animationsYs: '[data-animation="y"]',

        ...elements
      }
    }

    this.isScrollable = isScrollable

    this.transformPrefix = Prefix('transform')
  }

  create () {
    this.animations = []

    this.element = document.querySelector(this.selectors.element)
    this.elements = {}

    each(this.selectors.elements, (selector, key) => {
      if (selector instanceof window.HTMLElement || selector instanceof window.NodeList) {
        this.elements[key] = selector
      } else if (Array.isArray(selector)) {
        this.elements[key] = selector
      } else {
        this.elements[key] = this.element.querySelectorAll(selector)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector)
        }
      }
    })

    if (this.isScrollable) {
      this.scroll = {
        ease: 0.1,
        position: 0,
        current: 0,
        target: 0,
        limit: this.elements.wrapper.clientHeight - window.innerHeight
      }
    }

    this.createAnimations()
  }

  /**
   * Animations.
   */
  createAnimations () {
    // Lines.
    this.lines = mapEach(this.elements.animationsLines, element => {
      return new Line({
        element,
        scroller: this.element
      })
    })

    this.animations.push(...this.lines)

    // Paragraphs.
    this.paragraphs = mapEach(this.elements.animationsParagraphs, element => {
      return new Paragraph({
        element,
        scroller: this.element
      })
    })

    this.animations.push(...this.paragraphs)

    // Y.
    this.ys = mapEach(this.elements.animationsYs, element => {
      return new Y({
        element,
        scroller: this.element
      })
    })

    this.animations.push(...this.ys)
  }

  /**
   * Animations.
   */
  show (animation) {
    this.isVisible = true

    return new Promise(resolve => {
      animation.call(() => {
        if (this.isScrollable) {
          this.scroll = {
            ease: 0.1,
            position: 0,
            current: 0,
            target: 0,
            limit: this.elements.wrapper.clientHeight - window.innerHeight
          }
        }

        resolve()
      })

      this.addEventListeners()
    })
  }

  hide (animation) {
    this.isVisible = false

    return new Promise(resolve => {
      this.removeEventListeners()

      animation.call(() => {
        this.destroy()

        resolve()
      })
    })
  }

  transform (element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(y)}px, 0)`
  }

  /**
   * Events.
   */
  onResize () {
    each(this.animations, animation => {
      animation.onResize()
    })

    if (!this.isScrollable) return

    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
  }

  onDown (event) {
    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onMove (event) {
    if (!this.isDown) {
      return
    }

    const y = event.touches ? event.touches[0].clientY : event.clientY
    const distance = (this.start - y) * 2

    this.scroll.target = this.scroll.position + distance
  }

  onUp (event) {
    this.isDown = false
  }

  onWheel (event) {
    const delta = -event.wheelDeltaY || event.deltaY
    let speed = 25

    if (delta < 0) {
      speed *= -1
    }

    this.scroll.target += speed
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)
  }

  /**
   * Frames.
   */
  update () {
    if (!this.isScrollable || this.isAnimating || !this.isVisible) return

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0
    }

    this.transform(this.elements.wrapper, this.scroll.current)

    each(this.animations, animation => {
      animation.onScroll(this.scroll.current)
    })
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    if (this.isScrollable) {
      this.element.addEventListener('touchstart', this.onDown, { passive: true })
      this.element.addEventListener('touchmove', this.onMove, { passive: true })
      this.element.addEventListener('touchend', this.onUp, { passive: true })

      this.element.addEventListener('DOMMouseScroll', this.onWheel, { passive: true })
      this.element.addEventListener('mousewheel', this.onWheel, { passive: true })
      this.element.addEventListener('wheel', this.onWheel, { passive: true })
    }
  }

  removeEventListeners () {
    if (this.isScrollable) {
      this.element.removeEventListener('touchstart', this.onDown)
      this.element.removeEventListener('touchmove', this.onMove)
      this.element.removeEventListener('touchend', this.onUp)

      this.element.removeEventListener('DOMMouseScroll', this.onWheel)
      this.element.removeEventListener('mousewheel', this.onWheel)
      this.element.removeEventListener('wheel', this.onWheel)
    }
  }

  /**
   * Destroy.
   */
  destroy () {
    this.removeEventListeners()
  }
}
