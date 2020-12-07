import GSAP from 'gsap'

import each from 'lodash/each'

import Component from 'classes/Component'

export default class extends Component {
  constructor () {
    super({
      classes: {
        linksActive: 'navigation__link--active'
      },
      element: '.navigation',
      elements: {
        links: '.navigation__link',
        easter: '.navigation__easter'
      }
    })
  }

  /**
   * Events.
   */
  onChange (url) {
    each(this.elements.links, link => {
      const value = link.href.replace(window.location.origin, '')

      if (url === value) {
        link.classList.add(this.classes.linksActive)
      } else {
        link.classList.remove(this.classes.linksActive)
      }
    })
  }

  onEasterEgg () {
    document.documentElement.style.background = `hsl(${GSAP.utils.random(0, 360, 0.01)}deg 19% 9%)`
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    this.elements.easter.addEventListener('click', this.onEasterEgg)
  }
}
