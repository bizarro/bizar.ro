import Animation from 'classes/Animation'

export default class extends Animation {
  constructor ({ element }) {
    super({ element })
  }

  animateIn () {
    super.animateIn()

    this.element.style[this.transformPrefix] = `scaleX(1)`
  }

  animateOut () {
    super.animateOut()

    this.element.style[this.transformPrefix] = `scaleX(0)`
  }
}
