import GSAP from 'gsap'

import each from 'lodash/each'

import Page from 'components/Page'

export default class extends Page {
  constructor () {
    super({
      classes: {
        imageActive: 'case__gallery__media__image--active'
      },
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

    timeline.set(this.element, {
      autoAlpha: 1,
    })

    this.showCase(timeline)

    timeline.call(_ => {
      this.element.style.height = `${this.selected.clientHeight}px`
    })

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

    const images = this.selected.querySelectorAll('img')

    each(images, image => {
      if (!image.hasAttribute('src')) {
        image.classList.add(this.classes.imageActive)
        image.setAttribute('src', image.getAttribute('data-src'))
      }
    })
  }

  hide () {
    const timeline = GSAP.timeline()

    timeline.to(window, {
      duration: 1,
      ease: 'expo.inOut',
      scrollTo: {
        y: 0,
      }
    }, 'start')

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 1
    }, 'start')

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
