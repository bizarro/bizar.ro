class Detection {
  isMobile () {
    return document.documentElement.classList.contains('mobile')
  }

  isWebPSupported () {
    const element = document.createElement('canvas')

    if (element.getContext && element.getContext('2d')) {
      return element.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }

    return false
  }
}

const DetectionManager = new Detection()

export default DetectionManager
