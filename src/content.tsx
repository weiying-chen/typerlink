import React from "react"
import { useState, useEffect, useSyncExternalStore } from 'react';
import { createRoot }  from "react-dom/client"

function isAlphanumeric (key: string) {
  // TODO: add more modifier keys
  return !(/Control|Shift|Alt|Meta/.test(key))
}

let keys: string[] = []
let elements: any[] = []
// TODO: maybe replace creating div with something less hacky
let currentElement: HTMLElement = document.createElement('div')
let selectedElement: HTMLElement = document.createElement('div')

document.addEventListener('keydown', (event: KeyboardEvent) => {
  // TODO: see if can refractor this
  if (!isAlphanumeric(event.key)) return

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

  // TODO: see if there's a more efficent conditional statement
  if (!(/\[|\]|Enter|Escape/.test(event.key))) {
    keys.push(event.key)
  }

  console.log('keys', keys)

  // Since the text will have an HTML tag, searching for text will be affected
  elements = removeHighlight(elements)

  let text = keys.join('')
  const regExp = new RegExp (`\\b${text}`)
  const selectors = 'a, h3, button'

  // TODO: Remove contidional statement nesting
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

  if (elements.length === 0) {
    keys = []
    return
  }

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
})

function App () {
	let [keysState, setKeysState] = useState<string[]>([])

  useEffect(() => {
    function handleKeypress (event: any) {
      setKeysState([...keys])
    }

    document.addEventListener("keydown", handleKeypress)

    return () => {
      document.removeEventListener("keydown", handleKeypress)
    }
  }, [])

	return (
		<div>
			{keysState.map((key: string) => <li>{key}</li>)}
		</div>
	)
}

const rootElement = document.createElement("div")

rootElement.setAttribute('id', 'app-wrapper')
document.body.appendChild(rootElement)

const root = createRoot(rootElement)

root.render(<App />)