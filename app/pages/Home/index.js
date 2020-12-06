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

    this.createList()
  }

  createList () {
    console.log(this.elements)

    this.list = new Scrolling({
      element: document.body,
      elements: {
        list: this.elements.list,
        items: this.elements.items,
        buttons: this.elements.links
      }
    })

    this.list.enable()
  }

  update () {
    this.list.update()

    window.requestAnimationFrame(this.update)
  }
}
