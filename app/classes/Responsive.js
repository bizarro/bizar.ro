import clamp from 'lodash/clamp'

import {
  BREAKPOINT_DESKTOP,
  BREAKPOINT_TABLET
} from 'utils/breakpoints'

export default class {
  /**
   * @param {number} minimum  - Minimum font size value of HTML.
   * @param {number} maximum - Maximum font size value of HTML.
   * @param {boolean} round - Disable floating numbers in font size of HTML.
   * @param {boolean} scaleHeight - Enables behavior of scaling based on the height of the screen. Useful for websites without y-axis scrollbars.
   * @param {boolean} scaleWidth - Enables behavior of scaling based on the width of the screen.
   */
  constructor ({
    minimum = 0,
    maximum = {
      mobile: 10,
      tablet: 100,
      desktop: 100
    },
    round = false,
    scaleHeight = false,
    scaleWidth = true
  } = {}) {
    this.minimum = minimum
    this.maximum = maximum
    this.round = round
    this.scaleHeight = scaleHeight
    this.scaleWidth = scaleWidth

    this.onResize()
  }

  onResize () {
    const sizes = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    const multiplier = 10

    /**
     * Final designs sizes.
     */
    const desktop = {
      height: 1080,
      width: 1920
    }

    const tablet = {
      height: 1080,
      width: 1920
    }

    const mobile = {
      height: 736,
      width: 400
    }

    let { height, width } = mobile

    if (sizes.width >= BREAKPOINT_TABLET) {
      const { height: tabletHeight, width: tabletWidth } = tablet

      height = tabletHeight
      width = tabletWidth
    }

    if (sizes.width >= BREAKPOINT_DESKTOP) {
      const { height: desktopHeight, width: desktopWidth } = desktop

      height = desktopHeight
      width = desktopWidth
    }

    const scaleHeight = sizes.height / height
    const scaleWidth = sizes.width / width

    let scale = scaleWidth

    if (this.scaleHeight && this.scaleWidth) {
      scale = Math.min(scaleHeight, scaleWidth)
    } else if (this.scaleHeight) {
      scale = scaleHeight
    }

    let fontSize = clamp(multiplier * scale, this.minimum.phone, this.maximum.phone)

    if (sizes.width >= 768) {
      fontSize = clamp(multiplier * scale, this.minimum.tablet, this.maximum.tablet)
    }

    if (sizes.width >= 1152) {
      fontSize = clamp(multiplier * scale, this.minimum.desktop, this.maximum.desktop)
    }

    if (this.round) {
      fontSize = Math.round(fontSize)
    }

    document.documentElement.style.fontSize = `${fontSize}px`

    this.scale = scale
    this.size = fontSize
    this.sizes = sizes
  }
}
