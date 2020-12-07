import AutoBind from 'auto-bind'
import EventEmitter from 'events'
import GSAP from 'gsap'
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

    this.transform = Prefix('transform')
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

    this.scroll = {
      current: 0,
      ease: 0.07,
      last: 0
    }

    this.content = window
    this.wrapper = document.body

    this.createAnimations()
  }

  /**
   * Animations.
   */
  createAnimations () {
    // Lines.
    this.lines = mapEach(this.elements.animationsLines, element => {
      return new Line({
        element
      })
    })

    this.animations.push(...this.lines)

    // Paragraphs.
    this.paragraphs = mapEach(this.elements.animationsParagraphs, element => {
      return new Paragraph({
        element
      })
    })

    this.animations.push(...this.paragraphs)

    // Y.
    this.ys = mapEach(this.elements.animationsYs, element => {
      return new Y({
        element
      })
    })

    this.animations.push(...this.ys)
  }

  /**
   * Scroll.
   */
  createScrollStyles () {
    this.scroll = {
      current: 0,
      ease: 0.07,
      last: 0
    }

    this.element.style[this.transform] = `translate3d(0, -${this.scroll.last}px, 0)`

    Object.assign(this.element.style, {
      left: 0,
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      width: '100%'
    })
  }

  createScrollHeight () {
    this.wrapper.style.height = `${this.element.offsetHeight}px`

    this.scroll.length = this.element.offsetHeight
  }

  /**
   * Animations.
   */
  show (animation) {
    return new Promise(resolve => {
      animation.call(() => {
        if (this.isScrollable) {
          this.createScrollHeight()
          this.createScrollStyles()
        } else {
          document.documentElement.style.overflow = 'hidden'
        }

        resolve()

        this.isVisible = true
      })

      this.addEventListeners()
    })
  }

  hide (animation) {
    return new Promise(resolve => {
      this.isVisible = false

      this.removeEventListeners()

      animation.call(() => {
        this.destroy()

        resolve()
      })
    })
  }

  /**
   * Events.
   */
  onResize () {
    each(this.animations, animation => {
      animation.onResize()
    })

    if (this.isScrollable) {
      this.createScrollHeight()
    }
  }

  onScroll () {
    this.scroll.current = window.pageYOffset
  }

  /**
   * Frames.
   */
  update () {
    if (!this.isScrollable) return

    this.scroll.last = GSAP.utils.interpolate(this.scroll.last, this.scroll.current, this.scroll.ease)

    if (this.scroll.last < 0.1) {
      this.scroll.last = 0
    }

    this.element.style[this.transform] = `translate3d(0, -${Math.floor(this.scroll.last)}px, 0)`

    if (this.isVisible) {
      each(this.animations, animation => {
        animation.onScroll(this.scroll.last)
      })
    }
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    this.content.addEventListener('scroll', this.onScroll, { passive: true })
  }

  removeEventListeners () {
    this.content.removeEventListener('scroll', this.onScroll, { passive: true })
  }

  /**
   * Destroy.
   */
  destroy () {
    this.removeEventListeners()
  }
}
