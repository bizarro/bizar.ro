import GSAP from 'gsap'

import each from 'lodash/each'

import Detection from 'classes/Detection'
import Page from 'components/Page'

import { getOffset } from 'utils/dom'

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

    this.element.style.height = `${getOffset(this.selected).height}px`

    const timeline = GSAP.timeline()

    timeline.set(this.selected, {
      autoAlpha: 1
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

    const images = this.selected.querySelectorAll('img')

    each(images, image => {
      if (!image.hasAttribute('src')) {
        image.classList.add(this.classes.imageActive)
        image.setAttribute('src', image.getAttribute(Detection.isWebPSupported() ? 'data-src-webp' : 'data-src'))
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

    this.selected = null

    return super.show(timeline)
  }

  /**
   * Events.
   */
  onResize () {
    super.onResize()

    if (this.selected) {
      this.element.style.height = `${getOffset(this.selected).height}px`
    }
  }
}
