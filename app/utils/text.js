import each from 'lodash/each'

export function split ({ element, expression = ' ', append = true }) {
  const words = splitText(element.innerHTML.toString().trim(), expression)

  let innerHTML = ''

  each(words, line => {
    if (line.indexOf('<br>') > -1) {
      const lines = line.split('<br>')

      each(lines, (line, index) => {
        innerHTML += (index > 0) ? '<br>' + parseLine(line) : parseLine(line)
      })
    } else {
      innerHTML += parseLine(line)
    }
  })

  element.innerHTML = innerHTML

  const spans = element.querySelectorAll('span')

  if (append) {
    each(spans, span => {
      const isSingleLetter = span.textContent.length === 1
      const isNotEmpty = span.innerHTML.trim() !== ''
      const isNotAndCharacter = span.textContent !== '&'
      const isNotDashCharacter = span.textContent !== '-'

      if (isSingleLetter && isNotEmpty && isNotAndCharacter && isNotDashCharacter) {
        span.innerHTML = `${span.textContent}&nbsp;`
      }
    })
  }

  return spans
}

export function calculate (spans) {
  const lines = []
  let words = []

  let position = spans[0].offsetTop

  each(spans, (span, index) => {
    if (span.offsetTop === position) {
      words.push(span)
    }

    if (span.offsetTop !== position) {
      lines.push(words)

      words = []
      words.push(span)

      position = span.offsetTop
    }

    if (index + 1 === spans.length) {
      lines.push(words)
    }
  })

  return lines
}

function splitText (text, expression) {
  const splits = text.split('<br>')

  let words = []

  each(splits, (item, index) => {
    if (index > 0) {
      words.push('<br>')
    }

    words = words.concat(item.split(expression))

    let isLink = false
    let link = ''

    const innerHTML = []

    each(words, word => {
      if (!isLink && (word.includes('<a') || word.includes('<strong'))) {
        link = ''

        isLink = true
      }

      if (isLink) {
        link += ` ${word}`
      }

      if (isLink && (word.includes('/a>') || word.includes('/strong>'))) {
        innerHTML.push(link)

        link = ''
      }

      if (!isLink && link === '') {
        innerHTML.push(word)
      }

      if (isLink && (word.includes('/a>') || word.includes('/strong>'))) {
        isLink = false
      }
    })

    words = innerHTML
  })

  return words
}

function parseLine (line) {
  line = line.trim()

  if (line === '' || line === ' ') {
    return line
  } else {
    return (line === '<br>') ? '<br>' : `<span>${line}</span>` + ((line.length > 1) ? ' ' : '')
  }
}
