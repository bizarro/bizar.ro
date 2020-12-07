import GSAP from 'gsap'
import Prefix from 'prefix'

import each from 'lodash/each'

import Component from 'classes/Component'

import { getOffset } from 'utils/dom'

export default class extends Component {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    this.transformPrefix = Prefix('transform')

    this.distance = 0

    this.scroll = {
      ease: 0.07,
      position: 0,
      current: 0,
      target: 0,
      last: 0
    }

    each(this.elements.buttons, button => {
      const offset = getOffset(button)

      button.height = offset.height
      button.offset = offset.top
      button.position = 0
    })

    this.length = this.elements.buttons.length

    this.height = this.elements.buttons[0].height
    this.heightTotal = this.elements.list.getBoundingClientRect().height

    this.windowHalf = window.innerHeight * 0.5
  }

  enable () {
    this.isEnabled = true

    this.update()

    this.addEventListeners()
  }

  disable () {
    this.isEnabled = false

    this.removeEventListeners()
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

  previous () {
    this.scroll.target -= this.height
  }

  next () {
    this.scroll.target += this.height
  }

  onWheel (event) {
    const delta = -event.wheelDeltaY || event.deltaY
    let speed = 25

    if (delta < 0) {
      speed *= -1
    }

    this.scroll.target += speed
  }

  transform (element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${Math.floor(y)}px, 0)`
  }

  update (isForced = false) {
    if (!this.isEnabled && !isForced) {
      return
    }

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    const scrollClamp = Math.round((this.scroll.current + this.windowHalf) % this.heightTotal)
    const scrollPercent = scrollClamp / this.heightTotal

    let index = Math.floor(scrollPercent * this.length)

    if (index < 0) {
      index = (this.length - Math.abs(index % this.length)) % this.length
    }

    if (this.index !== index) {
      this.index = index

      this.emit('change', index)
    }

    each(this.elements.items, item => {
      this.transform(item, -this.scroll.current)
    })

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'down'
    } else {
      this.direction = 'up'
    }

    each(this.elements.buttons, element => {
      const position = (element.offset + element.position + element.height - this.scroll.current)

      element.isBefore = position < 0
      element.isAfter = position > this.heightTotal

      if (this.direction === 'up' && element.isBefore) {
        element.position = element.position + this.heightTotal

        element.isBefore = false
        element.isAfter = false
      }

      if (this.direction === 'down' && element.isAfter) {
        element.position = element.position - this.heightTotal

        element.isBefore = false
        element.isAfter = false
      }

      this.transform(element, element.position)
    })

    this.distance = this.scroll.current - this.scroll.target

    this.scroll.last = this.scroll.current
  }

  onResize () {
    this.scroll = {
      ease: 0.07,
      position: 0,
      current: 0,
      target: 0,
      last: 0
    }

    each(this.elements.buttons, button => {
      button.style[this.transform] = ''

      const offset = getOffset(button)

      button.height = offset.height
      button.offset = offset.top
      button.position = 0
    })

    each(this.elements.items, item => {
      item.style[this.transform] = ''
    })

    this.height = this.elements.buttons[0].getBoundingClientRect().height
    this.heightTotal = this.elements.list.getBoundingClientRect().height

    this.windowHalf = window.innerHeight * 0.5

    this.update(true)
  }

  addEventListeners () {
    // this.element.addEventListener('mousedown', this.onDown, { passive: true })
    // this.element.addEventListener('mousemove', this.onMove, { passive: true })
    // this.element.addEventListener('mouseup', this.onUp, { passive: true })

    this.element.addEventListener('touchstart', this.onDown, { passive: true })
    this.element.addEventListener('touchmove', this.onMove, { passive: true })
    this.element.addEventListener('touchend', this.onUp, { passive: true })

    this.element.addEventListener('DOMMouseScroll', this.onWheel, { passive: true })
    this.element.addEventListener('mousewheel', this.onWheel, { passive: true })
    this.element.addEventListener('wheel', this.onWheel, { passive: true })
  }

  removeEventListeners () {
    // this.element.removeEventListener('mousedown', this.onDown)
    // this.element.removeEventListener('mousemove', this.onMove)
    // this.element.removeEventListener('mouseup', this.onUp)

    this.element.removeEventListener('touchstart', this.onDown)
    this.element.removeEventListener('touchmove', this.onMove)
    this.element.removeEventListener('touchend', this.onUp)

    this.element.removeEventListener('DOMMouseScroll', this.onWheel)
    this.element.removeEventListener('mousewheel', this.onWheel)
    this.element.removeEventListener('wheel', this.onWheel)
  }

  destroy () {
    this.removeEventListeners()
  }
}
