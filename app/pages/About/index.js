import GSAP from 'gsap'

import each from 'lodash/each'

import Page from 'components/Page'

export default class extends Page {
  constructor () {
    super({
      classes: {
        buttonActive: 'home__button--active'
      },
      element: '.about',
      elements: {
        sliders: '.about__slider'
      }
    })

    this.create()
  }

  show () {
    const timeline = GSAP.timeline()

    timeline.to(this.element, {
      autoAlpha: 1,
      duration: 1
    })

    timeline.call(_ => {
      this.update()
    })

    super.show(timeline)
  }

  create () {
    super.create()

    this.createSliders()
  }

  createSliders () {
    each(this.elements.sliders, slider => {

    })
  }

  update () {
    super.update()

    window.requestAnimationFrame(this.update)
  }
}
