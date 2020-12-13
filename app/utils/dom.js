import map from 'lodash/map'

export const findAncestor = (element, selector) => {
  while ((element = element.parentElement) && !((element.matches || element.matchesSelector).call(element, selector))) { return element }
}

export const getOffset = (element, scroll = 0) => {
  const box = element.getBoundingClientRect()

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width
  }
}

export function getIndex (node) {
  let index = 0

  while ((node = node.previousElementSibling)) {
    index++
  }

  return index
}

export function mapEach (element, callback) {
  if (element instanceof window.HTMLElement) {
    return [callback(element)]
  }

  return map(element, callback)
}

export const easing = `cubic-bezier(0.19, 1, 0.22, 1)`
