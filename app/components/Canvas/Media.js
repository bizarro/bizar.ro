import AutoBind from 'auto-bind'
import GSAP from 'gsap'
import { Mesh, Program, TextureLoader } from 'ogl'

import Detection from 'classes/Detection'

import fragment from 'shaders/fragment.glsl'
import vertex from 'shaders/vertex.glsl'

import { getOffset } from 'utils/dom'
import { delay, lerp } from 'utils/math'

export default class {
  constructor ({ caseMedia, geometry, gl, homeList, homeItem, homeLink, homeLinkMedia, id, scene, screen, viewport }) {
    AutoBind(this)

    this.alpha = {
      current: 0,
      target: 0,
      ease: 0.15
    }

    this.transition = 0

    this.geometry = geometry
    this.gl = gl
    this.scene = scene

    this.caseMedia = caseMedia

    this.homeList = homeList
    this.homeItem = homeItem
    this.homeLink = homeLink
    this.homeLinkMedia = homeLinkMedia

    this.direction = homeLinkMedia.getAttribute('data-direction')
    this.id = id

    this.screen = screen
    this.viewport = viewport

    this.createMesh()
    this.createBounds()
    this.createListeners()
    this.createTween()

    this.onResize()
  }

  createMesh () {
    const texture = TextureLoader.load(this.gl, {
      src: this.homeLinkMedia.getAttribute(Detection.isWebPSupported() ? 'data-src-webp' : 'data-src')
    })

    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        uDirection: { value: this.direction === 'left' ? 0.5 : -0.5 },
        uTime: { value: 0 },
        uMultiplier: { value: 1 },
        tMap: { value: texture }
      },
      transparent: true
    })

    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program
    })

    this.plane.setParent(this.scene)
  }

  createBounds () {
    this.boundsList = getOffset(this.homeList)
    this.boundsHome = getOffset(this.homeLinkMedia)
    this.boundsCase = getOffset(this.caseMedia, this.scroll)

    this.updateScale()
    this.updateX()
    this.updateY()
  }

  createListeners () {
    if (Detection.isMobile()) {
      this.homeLink.addEventListener('touchstart', this.onMouseOver, { passive: true })

      window.addEventListener('touchend', this.onMouseLeave, { passive: true })
    } else {
      this.homeLink.addEventListener('mouseover', this.onMouseOver)
      this.homeLink.addEventListener('mouseout', this.onMouseLeave)
    }
  }

  createTween () {
    this.animation = GSAP.timeline({ paused: true })

    this.animation.fromTo(this, {
      transition: 0
    }, {
      delay: 0.5,
      duration: 1.5,
      ease: 'expo.inOut',
      transition: 1
    }, 'start')

    this.animation.fromTo(this.plane.program.uniforms.uMultiplier, {
      value: 1
    }, {
      duration: 1.5,
      ease: 'power4.in',
      value: 0,
    }, 'start')
  }

  updateScale () {
    this.height = lerp(this.boundsHome.height, this.boundsCase.height, this.transition)
    this.width = lerp(this.boundsHome.width, this.boundsCase.width, this.transition)

    this.plane.scale.x = this.viewport.width * this.width / this.screen.width
    this.plane.scale.y = this.viewport.height * this.height / this.screen.height
  }

  updateY (y) {
    this.y = lerp(this.boundsHome.top + (this.homeItem.position % this.boundsList.height), this.boundsCase.top - y, this.transition)

    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - (this.y / this.screen.height) * this.viewport.height
  }

  updateX () {
    this.x = lerp(this.boundsHome.left, this.boundsCase.left, this.transition)

    this.plane.position.x = -(this.viewport.width / 2) + (this.plane.scale.x / 2) + (this.x / this.screen.width) * this.viewport.width
  }

  updateAlpha () {
    if (Detection.isMobile()) {
      if (this.isOpened) {
        this.alpha.target = 1
      } else {
        this.alpha.target = 0
      }
    } else {
      if (this.isOpened || this.isHovering) {
        this.alpha.target = 1
      } else {
        this.alpha.target = 0
      }
    }

    if (this.alpha.current === this.alpha.target) return

    this.alpha.current = lerp(this.alpha.current, this.alpha.target, this.alpha.ease, true)

    if (this.alpha.current < 0.01) {
      this.alpha.current = 0
    } else if (this.alpha.current > 0.99) {
      this.alpha.current = 1
    }

    this.plane.program.uniforms.uAlpha.value = this.alpha.current
  }

  updateVisibility () {
    if (this.alpha.current === 0 && this.plane.visible) {
      this.plane.visible = false
    } else if (this.alpha.current !== 0 && !this.plane.visible) {
      this.plane.visible = true
    }
  }

  update (y) {
    this.scroll = y

    this.updateScale()
    this.updateX()
    this.updateY(y)
    this.updateAlpha()
    this.updateVisibility()

    if (this.alpha.current > 0) {
      this.plane.program.uniforms.uTime.value += (this.direction === 'left' ? 0.04 : -0.04)
    }
  }

  /**
   * Events.
   */
  onResize (sizes) {
    if (sizes) {
      const { screen, viewport } = sizes

      if (screen) this.screen = screen
      if (viewport) this.viewport = viewport
    }

    this.createBounds()
  }

  onMouseOver () {
    this.isHovering = true
  }

  onMouseLeave () {
    this.isHovering = false
  }

  /**
   * About.
   */
  onAboutOpen () {
    this.isAboutOpened = true
  }

  onAboutClose () {
    this.isAboutOpened = false
  }

  /**
   * Methods.
   */
  onOpen () {
    this.isOpened = true

    this.animation.play()
  }

  async onClose () {
    this.animation.reverse()

    if (!this.isAboutOpened) {
      await delay(1000)
    }

    this.isOpened = false
  }
}
