import React from "react"
import { useState, useEffect } from 'react'
import { createRoot }  from "react-dom/client"

// function isAlphanumeric (key: string) {
//   return !(/Shift/.test(key))
// }

function isModifier (event: KeyboardEvent) {
 return event.ctrlKey || event.altKey || event.metaKey
}

let keys: string[] = []
let elements: any[] = []
// TODO: maybe replace creating div with something less hacky
let currentElement: HTMLElement = document.createElement('div')
let selectedElement: HTMLElement = document.createElement('div')

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (isModifier(event)) return
  if (event.key === 'Shift') return
  // if (!isAlphanumeric(event.key)) return

  const target = event.target as HTMLElement

  if (target.nodeName === 'INPUT' ||
    target.nodeName === 'TEXTAREA' ||
    target.isContentEditable) {
    keys = []
    return
  }

  if (event.key === ']') {
    const nextElement = elements.reduce((result, element, index, array) => {
      if (element === currentElement) {
        result = index !== array.length - 1 ? array[index + 1] : array[0]
      }

      return result
    }, {})

    selectedElement = nextElement
  }

  if (event.key === '[') {
    const previousElement = elements.reduce((result, element, index, array) => {
      if (element === currentElement) {
        result = index !== 0 ? array[index - 1] : array[array.length - 1]
      }

      return result
    }, {})

    selectedElement = previousElement
  }

  // TODO: see if there's a more efficient conditional statement
  if (!(/\[|\]|Enter|Escape|Backspace/.test(event.key))) {
    keys.push(event.key)
  }

  console.log('keys', keys)

  // Since the text will have an HTML tag, searching for text will be affected
  elements = removeHighlight(elements)

  let text = keys.join('')
  const regExp = new RegExp (`\\b${text}`)
  const selectors = 'a, h3, button'

  // TODO: Remove conditional statement nesting
  elements = [...document.querySelectorAll(selectors)].filter(element => {
    if (element.childNodes) {
	  let nodeWithText = [...element.childNodes].find(childNode => childNode.nodeType == Node.TEXT_NODE)
      if (nodeWithText) {
         if (nodeWithText.textContent?.match(regExp)) {
           return element
         }
      }
    }
  })

  elements = elements.map(element => {
    element.innerHTML = element.innerHTML.replace(text, '<mark class="highlighted">$&</mark>')
    return element
  })

  if (currentElement) {
    currentElement = removeBorder(currentElement)
  }

  currentElement = selectedElement.innerHTML
    ? selectedElement
    : elements[0]

  if (currentElement) {
    currentElement.querySelector('mark')?.classList.add('selected')

    currentElement.scrollIntoView({
      block: "center",
      behavior: "auto"
    })
  }

  // if (elements.length === 0) {
  //   keys = []
  //   return
  // }

  if (elements.length === 1) {
    elements[0].click()
    keys = []
    currentElement = document.createElement('div')
    elements = removeHighlight(elements)
    return
  }

  if (event.key === 'Enter') {
    currentElement.click()
    keys = []
    elements = removeHighlight(elements)
  }

  if (event.key === 'Escape') {
    keys = []
    elements = removeHighlight(elements)
  }

  if (event.key === 'Backspace') {
    keys = removeLastKey(keys)
  }

  function removeHighlight (elements: any) {
    return elements.map((element: any) => {
      element.innerHTML = element.innerHTML.replace(/<\/?mark[^>]*>/, '')
      return element
    })
  }

  function removeBorder (currentElement: HTMLElement) {
    currentElement.querySelector('mark')?.classList.remove('selected')
    return currentElement
  }

  function removeLastKey (keys: string[]) {
    return keys.filter((key, index, array) => {
      if (index !== array.length - 1) {
        return key
      }
    })
  }
})

function App () {
	let [keysState, setKeysState] = useState<string[]>([])

  useEffect(() => {
    function handleKeypress () {
      setKeysState([...keys])
    }

    document.addEventListener("keydown", handleKeypress)

    return () => {
      document.removeEventListener("keydown", handleKeypress)
    }
  }, [])

  if (keysState.length) {
		return <div id="keys">{keysState.map((key: string) => key)}</div>
  } else {
    return null
  }
}

const rootElement = document.createElement('div')

rootElement.setAttribute('id', 'app-wrapper')
document.body.appendChild(rootElement)

const root = createRoot(rootElement)

root.render(<App />)