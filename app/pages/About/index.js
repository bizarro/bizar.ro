import GSAP from 'gsap'

import each from 'lodash/each'

import Page from 'components/Page'

import { BREAKPOINT_PHONE } from 'utils/breakpoints'
import { getOffset } from 'utils/dom'

export default class extends Page {
  constructor () {
    super({
      element: '.about',
      elements: {
        wrapper: '.about__content',
        title: '.about__header__title',
        titles: '.about__header__title__text span',
        sections: '.about__section',
        sectionsTitles: '.about__section__title'
      },
      isScrollable: true
    })

    this.create()
  }

  /**
   * Animations.
   */
  show () {
    const timeline = GSAP.timeline()

    timeline.set(this.element, {
      autoAlpha: 1
    })

    timeline.set(this.elements.title, {
      autoAlpha: 1
    })

    timeline.fromTo(this.elements.titles, {
      y: '100%'
    }, {
      duration: 1.5,
      ease: 'expo.out',
      stagger: 0.1,
      y: '0%'
    })

    timeline.call(this.onResize)

    return super.show(timeline)
  }

  hide () {
    const timeline = GSAP.timeline()

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 0.4
    })

    return super.show(timeline)
  }

  /**
   * Create.
   */
  onResize () {
    super.onResize()

    each(this.elements.sectionsTitles, title => {
      title.start = getOffset(title.parentNode).top + this.scroll.current
      title.limit = title.parentNode.clientHeight - title.clientHeight
      title.y = 0
    })

    if (window.innerWidth > BREAKPOINT_PHONE) {
      each(this.elements.sectionsTitles, title => {
        title.y = title.position = GSAP.utils.clamp(0, title.limit, this.scroll.current - title.start)
        title.style.transform = `translateY(${title.y}px)`
      })
    } else {
      each(this.elements.sectionsTitles, title => title.style.transform = '')
    }
  }

  /**
   * Loop.
   */
  update () {
    super.update()

    if (window.innerWidth > BREAKPOINT_PHONE) {
      each(this.elements.sectionsTitles, title => {
        title.position = GSAP.utils.clamp(0, title.limit, this.scroll.current - title.start)

        title.y = GSAP.utils.interpolate(title.y, title.position, 0.75)
        title.style.transform = `translateY(${title.y}px)`
      })
    }
  }
}
