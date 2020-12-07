import GSAP from 'gsap'

import Animation from 'classes/Animation'

export default class extends Animation {
  constructor ({ element }) {
    super({
      element
    })
  }

  animateIn () {
    if (this.isAnimatingIn || this.isVisible) {
      return
    }

    this.isAnimatingIn = true

    this.timelineIn = GSAP.timeline({
      delay: this.delay,
      paused: true
    })

    this.timelineIn.fromTo(this.element, {
      autoAlpha: 1,
      scaleX: 0
    }, {
      duration: 1,
      ease: 'expo.inOut',
      scaleX: 1
    })

    this.timelineIn.call(() => {
      this.isAnimatingIn = false
      this.isVisible = true
    })

    super.animateIn(this.timelineIn)
  }

  animateOut () {
    this.element.style.opacity = 0
    this.element.style.visibility = 'hidden'

    super.animateOut()
  }
}
