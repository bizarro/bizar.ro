import GSAP from 'gsap'

import each from 'lodash/each'

import Animation from 'classes/Animation'

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
  }

  animateIn () {
    if (this.isAnimatingIn) {
      return
    }

    this.isAnimatingIn = true

    this.timelineIn = GSAP.timeline({
      delay: this.delay,
      paused: true
    })

    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })

    each(this.lines, (line, lineIndex) => {
      this.timelineIn.fromTo(line, {
        y: '100%'
      }, {
        delay: lineIndex * 0.1,
        duration: 1.5,
        ease: 'expo.out',
        y: '0%'
      }, 'lines')
    })

    this.timelineIn.call(() => {
      this.isAnimatingIn = false
    })

    super.animateIn(this.timelineIn)
  }

  animateOut () {
    GSAP.set(this.element, {
      autoAlpha: 0,
      overflow: 'hidden'
    })

    super.animateOut()
  }

  show () {
    this.animateIn()
  }

  hide () {
    GSAP.to(this.element, {
      autoAlpha: 0,
      duration: 0.4
    })
  }

  onResize () {
    super.onResize()

    this.lines = calculate(this.elements.lines)
  }
}
