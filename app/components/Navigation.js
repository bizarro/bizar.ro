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

    this.homeBottom = document.querySelector('.home__background__bottom')
    this.homeTop = document.querySelector('.home__background__top')
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
    let color = `hsl(${GSAP.utils.random(0, 360, 0.01)}deg 19% 9%)`

    document.documentElement.style.background = color

    this.homeBottom.style.background = `linear-gradient(to bottom, transparent 0%, ${color} 100%)`
    this.homeTop.style.background = `linear-gradient(to bottom, ${color} 0%, transparent 100%)`
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    this.elements.easter.addEventListener('click', this.onEasterEgg)
  }
}
