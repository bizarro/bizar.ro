import each from 'lodash/each'

import Detection from 'classes/Detection'
import Page from 'components/Page'

import { delay } from 'utils/math'

export default class extends Page {
  constructor () {
    super({
      classes: {
        active: 'cases--active',
        caseActive: 'case--active',
        mediaActive: 'case__gallery__media__placeholder--active'
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
    this.element.classList.add(this.classes.active)

    const id = url.replace('/case/', '').replace('/', '')

    this.elements.wrapper = Array.from(this.elements.cases).find(item => item.id === id)
    this.elements.wrapper.classList.add(this.classes.caseActive)

    this.scroll.limit = this.elements.wrapper.limit - window.innerHeight

    if (Detection.isMobile()) {
      this.elements.image = this.elements.wrapper.querySelector('.case__media__image')

      if (!this.elements.image.src) {
        this.elements.image.src = this.elements.image.getAttribute(Detection.isWebPSupported() ? 'data-src-webp' : 'data-src')
      }
    }

    const medias = this.elements.wrapper.querySelectorAll('.case__gallery__media__placeholder')

    each(medias, media => {
      const image = new Image()

      image.className = 'case__gallery__media__image'
      image.src = media.getAttribute(Detection.isWebPSupported() ? 'data-src-webp' : 'data-src')
      image.decode().then(_ => {
        media.classList.add(this.classes.mediaActive)
        media.appendChild(image)
      })
    })

    return super.show()
  }

  async hide () {
    this.scroll.target = 0

    this.elements.wrapper.classList.remove(this.classes.caseActive)

    this.element.classList.remove(this.classes.active)

    await delay(Detection.isMobile() ? 400 : 1000)

    this.elements.wrapper = null

    return super.hide()
  }

  /**
   * Events
   */
  onResize () {
    super.onResize()

    each(this.elements.cases, element => {
      element.limit = element.clientHeight
    })
  }
}
