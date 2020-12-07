import GSAP from 'gsap'

import Page from 'components/Page'
import Scrolling from 'components/Scrolling'

export default class extends Page {
  constructor () {
    super({
      classes: {
        buttonActive: 'home__button--active'
      },
      element: '.home',
      elements: {
        list: '.home__list',
        items: '.home__item',
        links: '.home__link'
      },
      isScrollable: false
    })

    this.create()
  }

  /**
   * Animations.
   */
  show () {
    const timeline = GSAP.timeline()

    timeline.call(_ => {
      document.documentElement.style.position = 'fixed'

      this.list.enable()
    })

    timeline.to(this.element, {
      autoAlpha: 1,
      duration: 0.33
    })

    timeline.call(_ => {
      this.update()
    })

    return super.show(timeline)
  }

  hide () {
    const timeline = GSAP.timeline()

    timeline.call(_ => {
      document.documentElement.style.position = ''
    })

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 0.33
    })

    timeline.call(_ => {
      this.list.disable()

      window.cancelAnimationFrame(this.frame)
    })

    return super.show(timeline)
  }

  /**
   * Create.
   */
  create () {
    super.create()

    this.createList()
  }

  createList () {
    this.list = new Scrolling({
      element: document.body,
      elements: {
        list: this.elements.list,
        items: this.elements.items,
        buttons: this.elements.links
      }
    })
  }

  /**
   * Events.
   */
  onResize () {
    super.onResize()

    this.list.onResize()
  }

  /**
   * Loop.
   */
  update () {
    super.update()

    this.list.update()

    this.frame = window.requestAnimationFrame(this.update)
  }
}
