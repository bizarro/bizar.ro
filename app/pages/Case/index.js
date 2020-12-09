import GSAP from 'gsap'

import each from 'lodash/each'

import Page from 'components/Page'

export default class extends Page {
  constructor () {
    super({
      element: '.cases',
      elements: {
        cases: '.case'
      },
      isScrollable: true
    })

    this.create()
  }

  /**
   * Animations.
   */
  show (url) {
    const id = url.replace('/case/', '')

    this.selected = Array.from(this.elements.cases).find(item => item.id === id)

    const timeline = GSAP.timeline()

    timeline.set(this.selected, {
      autoAlpha: 1
    })

    timeline.call(_ => {
      this.element.style.height = `${this.selected.clientHeight}px`
    })

    timeline.set(this.element, {
      autoAlpha: 1,
    })

    this.showCase(timeline)

    return super.show(timeline)
  }

  showCase (timeline) {
    const title = this.selected.querySelector('.case__title__text')

    timeline.fromTo(title, {
      y: '100%'
    }, {
      delay: 0.5,
      duration: 1.5,
      ease: 'expo.out',
      stagger: 0.1,
      y: '0%'
    })
  }

  hide () {
    const timeline = GSAP.timeline()

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 0.33
    })

    timeline.set(this.selected, {
      autoAlpha: 0
    })

    return super.show(timeline)
  }

  /**
   * Create.
   */
  create () {
    super.create()
  }

  createList () {

  }

  /**
   * Events.
   */
  onResize () {
    super.onResize()
  }

  /**
   * Loop.
   */
  update () {
    super.update()
  }
}
