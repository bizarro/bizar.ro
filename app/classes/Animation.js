import Prefix from 'prefix'
import each from 'lodash/each'

export default class {
  constructor ({ element, elements }) {
    const { animationDelay, animationTarget } = element.dataset

    this.delay = animationDelay

    this.element = element
    this.elements = elements

    this.target = animationTarget ? element.closest(animationTarget) : element
    this.transformPrefix = Prefix('transform')

    this.isVisible = false

    if ('IntersectionObserver' in window) {
      this.createObserver()

      this.animateOut()
    } else {
      this.animateIn()
    }
  }

  createObserver () {
    this.observer = new IntersectionObserver((entries) => {
      each(entries, entry => {
        if (!this.isVisible && entry.isIntersecting) {
          this.animateIn()
        }
      })
    }).observe(this.target)
  }

  animateIn () {
    this.isVisible = true
  }

  animateOut () {
    this.isVisible = false
  }
}
