import AutoBind from 'auto-bind'
import EventEmitter from 'events'
import NormalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import Line from 'animations/Line'
import Paragraph from 'animations/Paragraph'
import Y from 'animations/Y'

import each from 'lodash/each'

import { mapEach } from 'utils/dom'
import { clamp, lerp } from 'utils/math'

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
        limit: 0
      }
    }

    this.createAnimations()
  }

  /**
   * Animations.
   */
  createAnimations () {
    this.lines = mapEach(this.elements.animationsLines, element => {
      return new Line({ element })
    })

    this.animations.push(...this.lines)

    this.paragraphs = mapEach(this.elements.animationsParagraphs, element => {
      return new Paragraph({ element })
    })

    this.animations.push(...this.paragraphs)

    this.ys = mapEach(this.elements.animationsYs, element => {
      return new Y({ element })
    })

    this.animations.push(...this.ys)
  }

  /**
   * Animations.
   */
  show () {
    if (this.isScrollable) {
      this.scroll.position = 0
      this.scroll.current = 0
      this.scroll.target = 0
    }

    this.isVisible = true

    return Promise.resolve()
  }

  hide () {
    each(this.animations, animation => {
      animation.animateOut()
    })

    this.isVisible = false

    return Promise.resolve()
  }

  transform (element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(y)}px, 0)`
  }

  /**
   * Events.
   */
  onResize () {
    if (!this.isScrollable || !this.elements.wrapper) return

    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight

    this.update()

    each(this.animations, animation => {
      animation.onResize && animation.onResize()
    })
  }

  onTouchDown (event) {
    if (!this.isScrollable) return

    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onTouchMove (event) {
    if (!this.isDown || !this.isScrollable) {
      return
    }

    const y = event.touches ? event.touches[0].clientY : event.clientY
    const distance = (this.start - y) * 2

    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp (event) {
    if (!this.isScrollable) return

    this.isDown = false
  }

  onWheel (event) {
    if (!this.isScrollable) return

    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY

    this.scroll.target += speed
  }

  /**
   * Frames.
   */
  update () {
    if (!this.isScrollable || !this.isVisible) return

    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target)

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0
    }

    if (this.elements.wrapper) {
      this.transform(this.elements.wrapper, this.scroll.current)
    }
  }
}
