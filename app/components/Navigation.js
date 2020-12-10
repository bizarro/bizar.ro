import GSAP from 'gsap'

import each from 'lodash/each'

import Component from 'classes/Component'

export default class extends Component {
  constructor ({ canvas }) {
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

    this.canvas = canvas

    this.homeBottom = document.querySelector('.home__background__bottom')
    this.homeTop = document.querySelector('.home__background__top')
  }

  /**
   * Convert.
   */
  convert (h, s, l) {
    let r, g, b

    if (s == 0) {
      r = g = b = l
    } else {
      let hue2rgb = function hue2rgb(p, q, t){
        if(t < 0) t += 1
        if(t > 1) t -= 1
        if(t < 1/6) return p + (q - p) * 6 * t
        if(t < 1/2) return q
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s
      let p = 2 * l - q

      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
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
    let random = GSAP.utils.random(0, 360, 0.01)
    let color = `hsl(${random}deg 19% 9%)`

    document.documentElement.style.background = color

    this.homeBottom.style.background = `linear-gradient(to bottom, transparent 0%, ${color} 100%)`
    this.homeTop.style.background = `linear-gradient(to bottom, ${color} 0%, transparent 100%)`

    let background = this.convert(random / 100, 0.19, 0.09)

    this.canvas.background = {
      r: background[0],
      g: background[1],
      b: background[2]
    }
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    this.elements.easter.addEventListener('click', this.onEasterEgg)
  }
}
