import FontFaceObserver from 'fontfaceobserver'
import { Renderer, Camera, Transform, Plane, Post, Vec2 } from 'ogl'
import each from 'lodash/each'

import fragment from 'shaders/post.glsl'

import { mapEach } from 'utils/dom'

import Media from './Media'

export default class {
  constructor ({ url }) {
    this.background = {
      r: 21,
      g: 28,
      b: 19
    }

    this.url = url

    this.renderer = new Renderer()
    this.gl = this.renderer.gl

    this.resolution = {
      value: new Vec2()
    }

    this.planeGeometry = new Plane(this.gl, {
      widthSegments: 20
    })

    document.body.appendChild(this.gl.canvas)

    this.createCamera()
    this.createScene()
    this.createPost()

    this.onResize()

    this.createList()

    const font = new FontFaceObserver('Ampersand', 10000)

    font.load().then(_ => {
      this.onResize()
    }).catch(_ => {
      this.onResize()
    })

    this.update()
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 5
  }

  createScene () {
    this.scene = new Transform()
  }

  createPost () {
    this.post = new Post(this.gl)

    this.pass = this.post.addPass({
      fragment,
      uniforms: {
        uResolution: this.resolution,
      },
  });
  }

  createList () {
    this.mediasList = document.querySelector('.home__list')
    this.mediasElements = document.querySelectorAll('.home__item')
    this.medias = mapEach(this.mediasElements, (homeItem, index) => {
      const homeLink = homeItem.querySelector('.home__link')
      const homeLinkMedia = homeItem.querySelector('.home__link__media')

      const id = homeLink.href.replace(`${window.location.origin}/case/`, '')
      const caseMedia = document.querySelector(`#${id} .case__media`)

      let media = new Media({
        caseMedia,
        geometry: this.planeGeometry,
        gl: this.gl,
        homeItem,
        homeLink,
        homeLinkMedia,
        id,
        homeList: this.mediasList,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport
      })

      return media
    })

    if (this.url.indexOf('/case/') > -1) {
      const id = this.url.replace('/case/', '').replace('/', '')
      const media = this.medias.find(media => media.id === id)

      media.onOpen()
    }
  }

  /**
   * Change.
   */
  onChange (url) {
    if (url.indexOf('/about') > -1) {
      each(this.medias, media => media.onAboutOpen())
    } else {
      each(this.medias, media => media.onAboutClose())
    }

    if (url.indexOf('/case') > -1) {
      const id = url.replace('/case/', '')
      const media = this.medias.find(media => media.id === id)

      media.onOpen()
    } else {
      each(this.medias, media => media.onClose())
    }
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
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height,
      width
    }

    this.post.resize()

    this.resolution.value.set(this.gl.canvas.width, this.gl.canvas.height)

    if (this.medias) {
      each(this.medias, media => media.onResize({
        screen: this.screen,
        viewport: this.viewport
      }))
    }
  }

  /**
   * Update.
   */
  update (scroll) {
    this.gl.clearColor(this.background.r / 255, this.background.g / 255, this.background.b / 255, 1)

    if (this.medias) {
      each(this.medias, media => {
        media.update(scroll)
      })
    }

    this.post.render({
      scene: this.scene,
      camera: this.camera
    })
  }
}
