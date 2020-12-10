import map from 'lodash/map'

export const findAncestor = (element, selector) => {
  while ((element = element.parentElement) && !((element.matches || element.matchesSelector).call(element, selector))) { return element }
}

export const getOffset = element => {
  const box = element.getBoundingClientRect()

  return {
    bottom: box.bottom + window.pageXOffset - document.documentElement.clientLeft,
    height: box.height,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft,
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
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
