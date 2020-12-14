import NormalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import each from 'lodash/each'

import Component from 'classes/Component'

import { getOffset } from 'utils/dom'
import { lerp } from 'utils/math'

export default class extends Component {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    this.transformPrefix = Prefix('transform')

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      clamp: 0
    }

    each(this.elements.items, element => {
      const offset = getOffset(element)

      element.extra = 0
      element.height = offset.height
      element.offset = offset.top
      element.position = 0
    })

    this.length = this.elements.items.length

    this.height = this.elements.items[0].height
    this.heightTotal = this.elements.list.getBoundingClientRect().height
  }

  enable () {
    this.isEnabled = true

    this.update()
  }

  disable () {
    this.isEnabled = false
  }

  onTouchDown (event) {
    if (!this.isEnabled) return

    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onTouchMove (event) {
    if (!this.isDown || !this.isEnabled) return

    const y = event.touches ? event.touches[0].clientY : event.clientY
    const distance = (this.start - y) * 2

    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp (event) {
    if (!this.isEnabled) return

    this.isDown = false
  }

  onWheel (event) {
    if (!this.isEnabled) return

    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY * 0.5

    this.scroll.target += speed
  }

  transform (element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${Math.floor(y)}px, 0)`
  }

  update () {
    if (!this.isEnabled) return

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

    const scrollClamp = Math.round(this.scroll.current % this.heightTotal)

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'down'
    } else {
      this.direction = 'up'
    }

    each(this.elements.items, (element, index) => {
      element.position = -this.scroll.current - element.extra

      const offset = element.position + element.offset + element.height

      element.isBefore = offset < 0
      element.isAfter = offset > this.heightTotal

      if (this.direction === 'up' && element.isBefore) {
        element.extra = element.extra - this.heightTotal

        element.isBefore = false
        element.isAfter = false
      }

      if (this.direction === 'down' && element.isAfter) {
        element.extra = element.extra + this.heightTotal

        element.isBefore = false
        element.isAfter = false
      }

      element.clamp = element.extra % scrollClamp

      this.transform(element, element.position)
    })

    this.scroll.last = this.scroll.current
    this.scroll.clamp = scrollClamp
  }

  onResize () {
    each(this.elements.items, element => {
      this.transform(element, 0)

      const offset = getOffset(element)

      element.extra = 0
      element.height = offset.height
      element.offset = offset.top
      element.position = 0
    })

    this.height = this.elements.items[0].getBoundingClientRect().height
    this.heightTotal = this.elements.list.getBoundingClientRect().height

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0
    }
  }
}
