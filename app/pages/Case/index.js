import GSAP from 'gsap'

import each from 'lodash/each'

import Detection from 'classes/Detection'
import Page from 'components/Page'

export default class extends Page {
  constructor () {
    super({
      classes: {
        imageActive: 'case__gallery__media__image--active'
      },
      element: '.cases',
      elements: {
        wrapper: '#trolli',
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
    this.isAnimating = false

    const id = url.replace('/case/', '')

    this.elements.wrapper = Array.from(this.elements.cases).find(item => item.id === id)

    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight

    const timeline = GSAP.timeline()

    timeline.set(this.elements.wrapper, {
      autoAlpha: 1
    })

    timeline.set(this.element, {
      autoAlpha: 1,
    })

    this.showCase(timeline)

    return super.show(timeline)
  }

  showCase (timeline) {
    const title = this.elements.wrapper.querySelector('.case__title__text')
    const information = this.elements.wrapper.querySelector('.case__information')

    timeline.fromTo(title, {
      y: '100%'
    }, {
      delay: 0.5,
      duration: 1.5,
      ease: 'expo.out',
      stagger: 0.1,
      y: '0%'
    }, 'start')

    timeline.fromTo(information, {
      autoAlpha: 0
    }, {
      autoAlpha: 1,
      delay: 0.5,
      duration: 0.5
    }, 'start')

    const images = this.elements.wrapper.querySelectorAll('img')

    each(images, image => {
      if (!image.hasAttribute('src')) {
        image.classList.add(this.classes.imageActive)
        image.setAttribute('src', image.getAttribute(Detection.isWebPSupported() ? 'data-src-webp' : 'data-src'))
      }
    })
  }

  hide () {
    this.isAnimating = true

    const timeline = GSAP.timeline()

    timeline.to(this.scroll, {
      duration: 1,
      ease: 'expo.inOut',
      current: 0,
      target: 0,
      position: 0,
      onUpdate: _ => this.transform(this.elements.wrapper, this.scroll.current)
    }, 'start')

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 1
    }, 'start')

    timeline.set(this.elements.wrapper, {
      autoAlpha: 0
    })

    timeline.call(_ => {
      this.elements.wrapper = null
    })

    return super.hide(timeline)
  }

  /**
   * Events.
   */
  onResize () {
    super.onResize()
  }
}
