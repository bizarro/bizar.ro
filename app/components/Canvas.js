import GSAP from 'gsap'
import { Renderer, Camera, Transform, Box, Program, Mesh } from 'ogl'

import fragment from 'shaders/fragment.glsl'
import vertex from 'shaders/vertex.glsl'

export default class {
  constructor () {
    this.renderer = new Renderer()
    this.gl = this.renderer.gl

    document.body.appendChild(this.gl.canvas)

    this.createCamera()
    this.createScene()
    this.createDOM()

    this.onResize()
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5
  }

  createScene () {
    this.scene = new Transform()

    const geometry = new Box(this.gl)
    const program = new Program(this.gl, {
      fragment,
      vertex
    })

    this.mesh = new Mesh(this.gl, {
      geometry,
      program
    })

    this.mesh.setParent(this.scene)
  }

  createDOM () {
    this.element = document.createElement('a')
    this.element.innerHTML = `
      This is the holding page of Luis Henrique Bizarro<br>
      for his WebGL Experience (just for fun)!
    `

    this.element.setAttribute('href', 'https://twitter.com/lhbzr/')
    this.element.setAttribute('target', '_blank')

    GSAP.set(this.element, {
      bottom: 25,
      left: '50%',
      whiteSpace: 'nowrap',
      x: '-50%'
    })

    document.body.appendChild(this.element)
  }

  /**
   * Touch.
   */
  onTouchDown (event) {

  }

  onTouchMove (event) {

  }

  onTouchUp (event) {

  }

  /**
   * Wheel.
   */
  onWheel (event) {

  }

  /**
   * Resize.
   */
  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })
  }

  /**
   * Update.
   */
  update () {
    this.mesh.rotation.y -= 0.04
    this.mesh.rotation.x += 0.03

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
  }
}
