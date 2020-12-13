import each from 'lodash/each'

import Animation from 'classes/Animation'

import { easing } from 'utils/dom'
import { calculate, split } from 'utils/text'

export default class extends Animation {
  constructor ({ element }) {
    const lines = []
    const paragraphs = element.querySelectorAll('h1, h2, p')

    if (paragraphs.length !== 0) {
      each(paragraphs, element => {
        split({ element })
        split({ element })

        lines.push(...element.querySelectorAll('span span'))
      })
    } else {
      split({ element })
      split({ element })

      lines.push(...element.querySelectorAll('span span'))
    }

    super({
      element,
      elements: {
        lines
      }
    })

    this.onResize()

    if ('IntersectionObserver' in window) {
      this.animateOut()
    }
  }

  animateIn () {
    super.animateIn()

    each(this.lines, (line, lineIndex) => {
      each(line, word => {
        word.style.transition = `transform 1.5s ${lineIndex * 0.1}s ${easing}`
        word.style[this.transformPrefix] = `translateY(0)`
      })
    })
  }

  animateOut () {
    super.animateOut()

    each(this.lines, line => {
      each(line, word => {
        word.style[this.transformPrefix] = `translateY(100%)`
      })
    })
  }

  onResize () {
    this.lines = calculate(this.elements.lines)
  }
}
