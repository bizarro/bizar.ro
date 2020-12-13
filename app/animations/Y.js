import Animation from 'classes/Animation'
import { easing } from 'utils/dom'

export default class extends Animation {
  constructor ({ element }) {
    super({ element })
  }

  animateIn () {
    super.animateIn()

    this.element.style.transition = `transform 1.5s ${easing}`
    this.element.style[this.transformPrefix] = `translateY(0)`
  }

  animateOut () {
    super.animateOut()

    this.element.style[this.transformPrefix] = `translateY(100%)`
  }
}
