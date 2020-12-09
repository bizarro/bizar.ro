import AutoBind from 'auto-bind'
import GSAP from 'gsap'
import { Mesh, Program, TextureLoader } from 'ogl'

import fragment from 'shaders/fragment.glsl'
import vertex from 'shaders/vertex.glsl'

export default class {
  constructor ({ caseMedia, geometry, gl, homeItem, homeLink, homeLinkMedia, id, scene, screen, viewport }) {
    AutoBind(this)

    this.transition = 0

    this.geometry = geometry
    this.gl = gl
    this.scene = scene

    this.caseMedia = caseMedia

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
  }

  createMesh () {
    const texture = TextureLoader.load(this.gl, {
      src: this.homeLinkMedia.getAttribute('data-src')
    })

    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        uAlphaMultiplier: { value: 0 },
        uDirection: { value: this.direction === 'left' ? 0.5 : -0.5 },
        uMultiplier: { value: 1 },
        uTime: { value: 0 },
        tMap: { value: texture }
      },
      transparent: true
    })

    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program
    })

    this.plane.setParent(this.scene)
    this.plane.visible = false
  }

  createBounds () {
    this.boundsHome = this.homeLinkMedia.getBoundingClientRect()
    this.boundsCase = this.caseMedia.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()
  }

  createListeners () {
    this.homeLink.addEventListener('mouseover', this.onMouseOver)
    this.homeLink.addEventListener('mouseout', this.onMouseLeave)
  }

  createTween () {
    this.tween = GSAP.timeline({ paused: true })

    this.tween.call(_ => {
      if (!this.isExpanded) this.plane.visible = false
    })

    this.tween.call(_ => this.plane.visible = true)

    this.tween.fromTo(this.plane.program.uniforms.uAlpha, {
      value: 0
    }, {
      duration: 0.5,
      value: 1,
    })

    this.animation = GSAP.timeline({ paused: true })

    this.animation.fromTo(this, {
      transition: 0
    }, {
      delay: 0.5,
      duration: 1.5,
      ease: 'expo.inOut',
      transition: 1
    }, 'start')

    this.animation.fromTo(this.plane.program.uniforms.uAlphaMultiplier, {
      value: 0
    }, {
      duration: 0.5,
      value: 1,
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
    this.height = GSAP.utils.interpolate(this.boundsHome.height, this.boundsCase.height, this.transition)
    this.width = GSAP.utils.interpolate(this.boundsHome.width, this.boundsCase.width, this.transition)

    this.plane.scale.x = this.viewport.width * this.width / this.screen.width
    this.plane.scale.y = this.viewport.height * this.height / this.screen.height
  }

  updateY (y = 0) {
    this.y = GSAP.utils.interpolate(
      this.boundsHome.top - this.homeItem.extra,
      this.boundsCase.top,
      this.transition
    )

    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - ((this.y - y) / this.screen.height) * this.viewport.height
  }

  updateX (x = 0) {
    this.x = GSAP.utils.interpolate(
      this.boundsHome.left + x,
      this.boundsCase.left,
      this.transition
    )

    this.plane.position.x = -(this.viewport.width / 2) + (this.plane.scale.x / 2) + (this.x / this.screen.width) * this.viewport.width
  }

  update (scroll) {
    this.updateScale()
    this.updateY(scroll)
    this.updateX()

    this.plane.program.uniforms.uTime.value += (this.direction === 'left' ? 0.04 : -0.04)
  }

  /**
   * Events.
   */
  onMouseOver () {
    this.tween.play()
  }

  onMouseLeave () {
    this.tween.reverse()
  }

  /**
   * Methods.
   */
  open () {
    this.isExpanded = true

    this.animation.play()
  }

  close () {
    this.isExpanded = false

    this.animation.reverse()
  }
}
