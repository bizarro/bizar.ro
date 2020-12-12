import GSAP from 'gsap'

import Page from 'components/Page'
import Scrolling from 'components/Scrolling'

export default class extends Page {
  constructor () {
    super({
      element: '.home',
      elements: {
        list: '.home__list',
        items: '.home__item'
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

    timeline.call(this.list.enable)

    timeline.to(this.element, {
      autoAlpha: 1,
      duration: 0.33
    })

    return super.show(timeline)
  }

  hide () {
    const timeline = GSAP.timeline()

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 0.33
    })

    timeline.call(this.list.disable)

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
        items: this.elements.items
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
  }
}
