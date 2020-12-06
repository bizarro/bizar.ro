import AutoBind from 'auto-bind'
import EventEmitter from 'events'
import GSAP from 'gsap'
import Prefix from 'prefix'

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
        animationsParagraphs: '[data-animation="paragraph"]',

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

    this.content = window
    this.wrapper = document.body

    this.scroll = {
      current: 0,
      ease: 0.05,
      last: 0
    }

    this.createAnimations()

    if (this.isScrollable) {
      this.createScrollHeight()
      this.createScrollStyles()
    } else {
      document.documentElement.style.overflow = 'hidden'
    }
  }

  /**
   * Animations.
   */
  createAnimations () {
    // Paragraphs.
    this.paragraphs = mapEach(this.elements.animationsParagraphs, element => {
      return new Paragraph({
        element
      })
    })

    this.animations.push(...this.paragraphs)
  }

  /**
   * Scroll.
   */
  createScrollStyles () {
    Object.assign(this.element.style, {
      left: 0,
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      width: '100%'
    })

    window.scrollTo(0, 0)
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
    this.createScrollHeight()

    each(this.animations, animation => {
      animation.onResize()
    })
  }

  onScroll () {
    this.scroll.current = window.pageYOffset
  }

  /**
   * Frames.
   */
  update () {
    if (!this.isScrollable) {
      return
    }

    this.scroll.last = GSAP.utils.interpolate(this.scroll.last, this.scroll.current, this.scroll.ease)

    if (this.scroll.last < 0.1) {
      this.scroll.last = 0
    }

    this.element.style[this.transform] = `translate3d(0, -${this.scroll.last}px, 0)`

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
