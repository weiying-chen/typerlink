import React from "react"
import { useState, useEffect, useSyncExternalStore } from 'react';
import { createRoot }  from "react-dom/client"


let keys: string[] = []
let elements: any[] = []
// TODO: maybe replace creating div with something less hacky
let currentElement: HTMLElement = document.createElement('div')
let selectedElement: HTMLElement = document.createElement('div')

document.addEventListener('keypress', event => {
  // TODO: see if can refractor this
  if (event.key === ' ') return
  if (!(event.target instanceof HTMLElement)) return // EventTarget is not guarantied to be an HTMLElement
  if (event.target.nodeName === 'INPUT' ||
    event.target.nodeName === 'TEXTAREA' ||
    event.target.isContentEditable) {
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

  // TODO: fix this with if else
  if (event.key !== ']' && event.key !== '[' && event.key !== 'Enter') {
    keys.push(event.key)
  }

  console.log(keys)

  // Reset elements

  elements = removeHighlight(elements)

  // Get elements

  let text = keys.join('')
  const regExp = new RegExp (`\\b${text}`)
  const selectors = 'a, h3, button'

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
    const replacement = '<strong>$&</strong>'
    element.innerHTML = element.innerHTML.replace(text, replacement)
    return element
  })

  currentElement = selectedElement.innerHTML
    ? selectedElement
    : elements[0]

  if (currentElement) {
    if (currentElement.style) {
      currentElement = removeBorder(currentElement)
    }

    currentElement.style.borderBottom = '2px solid orange'

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
    elements = removeHighlight(elements) // In case there's a popup
    return
  }

  if (event.key === 'Enter') {
    currentElement.click()
    keys = []
    elements = removeHighlight(elements) // In case there's a popup
  }

  function removeHighlight (elements: any) {
    return elements.map((element: any) => {
      element.innerHTML = element.innerHTML.replace(/<strong>|<\/strong>/, '')
      return element
    })
  }

  function removeBorder (currentElement: any) {
    currentElement.style.borderBottom = 'none'
	return currentElement
  }
})

interface Keys {
	keys: string[]
}

function Message () {
	let [keysState, setKeysState] = useState<string[]>([])

  useEffect(() => {
    function handleKeypress () {
      setKeysState([...keys])
    }

    document.addEventListener("keypress", handleKeypress)

    // handleKeypress()

    return () => {
      document.removeEventListener("keypress", handleKeypress)
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

root.render(<Message />)