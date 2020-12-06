import AutoBind from 'auto-bind'
import EventEmitter from 'events'

import each from 'lodash/each'

export default class extends EventEmitter {
  constructor ({ classes, element, elements, elementsForceArray }) {
    super()

    AutoBind(this)

    this.classes = classes

    this.element = element instanceof window.HTMLElement ? element : document.querySelector(element)
    this.elements = {}

    each(elements, (selector, key) => {
      if (selector instanceof window.HTMLElement || selector instanceof window.NodeList) {
        this.elements[key] = selector
      } else if (Array.isArray(selector)) {
        this.elements[key] = selector
      } else {
        this.elements[key] = this.element.querySelectorAll(selector)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector)
        }
      }
    })

    each(elementsForceArray, (selector, key) => {
      this.elements[selector] = [this.elements[selector]]
    })

    this.addEventListeners()
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }

  destroy () {
    this.removeEventListeners()
  }
}
