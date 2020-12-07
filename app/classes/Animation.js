import { BREAKPOINT_TABLET } from 'utils/breakpoints'
import { getOffset } from 'utils/dom'

export default class {
  constructor ({ element, elements }) {
    const { animationDelay, animationTarget } = element.dataset

    this.delay = animationDelay

    this.element = element
    this.elements = elements

    this.target = animationTarget ? element.closest(animationTarget) : element

    this.isVisible = false

    this.onResize(true)

    this.animateOut()
  }

  animateIn (timeline) {
    timeline.call(() => {
      this.isVisible = true
    })

    timeline.play()
  }

  animateOut () {
    this.isVisible = false
  }

  show () {

  }

  hide () {

  }

  onResize () {
    const { innerHeight, innerWidth } = window
    const { animationThreshold } = this.element.dataset

    this.offset = getOffset(this.target).top
    this.threshold = animationThreshold !== undefined ? animationThreshold : innerWidth >= BREAKPOINT_TABLET ? 0.75 : 1

    this.positionHide = innerHeight
    this.positionShow = innerHeight * this.threshold
  }

  onScroll (scroll) {
    const positionHide = scroll + this.positionHide
    const positionVisible = scroll + this.positionShow

    if (!this.isVisible && positionVisible >= this.offset) {
      this.animateIn()
    } else if (this.isVisible && positionHide < this.offset) {
      this.animateOut()
    }
  }
}
