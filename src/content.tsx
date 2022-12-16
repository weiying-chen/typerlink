import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

// # Up-level Variables

let keys: string[] = []
let elements: any[] = []

// TODO: maybe replace creating div with something less hacky
let currentElement: HTMLElement = document.createElement('div')
let selectedElement: HTMLElement = document.createElement('div')

// ## Listeners

// document.removeEventListener('keydown', handleKeydown)
// document.addEventListener('keydown', handleKeydown)

// ## Main Function

function handleKeydown(event: KeyboardEvent) {
	// ## Exit conditions

	if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') return
	if (event.key === 'Backspace') return

	if (isModifier(event)) return
	if (event.key === 'Shift') return

	// So it doesn't interfere with Chrome's default space behavior
	if (event.key === ' ' && !keys.length) return

	const target = event.target as HTMLElement

	if (
		// TODO: fix this hack
		// target.nodeName === 'INPUT' ||
		target.nodeName === 'TEXTAREA' ||
		target.isContentEditable
	) {
		keys = []
		return
	}

	// ## Key Actions

	// If some of these conditional statements are put down below, they might not affect `elements`.

	if (event.key === ']') {
		selectedElement = findNext(elements, currentElement)
	}

	if (event.key === '[') {
		selectedElement = findPrevious(elements, currentElement)
	}

	// If `return` is added `elements` won't be set correctly below.
	if (event.key === ' ') {
		event.preventDefault()
	}

	if (event.key === 'Enter') {
		if (!currentElement) return
		currentElement.click()
		resetAll()
	}

	if (event.key === 'Escape') {
		resetAll()
	}

	// if (event.key === 'Backspace') {
	// 	keys = removeLast(keys)
	// }

	if (/\b[a-z0-9]\b|[ ]/i.test(event.key)) {
		keys.push(event.key)
	}

	// console.log('keys', keys)

	// ## `elements`

	// Since the text will have an HTML tag, searching for text will be affected
	elements = removeTextHighlight(elements)

	const selectors = 'a, h3, button'
	const text = keys.join('')

	elements = findElementsByText(selectors, text)

	// ## `currentElement`

	elements = addTextHighlight(elements, text)

	if (currentElement) {
		currentElement = removeSelectedClass(currentElement)
	}

	currentElement = selectedElement.innerHTML ? selectedElement : elements[0]

	if (currentElement) {
		currentElement.querySelector('span')?.classList.add('selected')

		currentElement.scrollIntoView({
			block: 'center',
			behavior: 'auto',
		})
	}

	// ## Only One Element

	if (elements.length === 1) {
		elements[0].click()
		resetAll()
		return
	}

	console.log('elements 6', elements)
}

// ## DOM Functions

function findElementsByText(selectors: string, text: string) {
	// Without `^$`, all the elements on the page will be matched if `text` is empty
	const pattern = new RegExp(text === '' ? '^$' : text)

	// TODO: Remove conditional statement nesting
	return [...document.querySelectorAll(selectors)].filter((element) => {
		if (element.childNodes) {
			// TODO: should this be const?
			let nodeWithText = [...element.childNodes].find(
				(childNode) => childNode.nodeType == Node.TEXT_NODE
			)

			if (nodeWithText) {
				if (nodeWithText.textContent?.match(pattern)) {
					return element
				}
			}
		}
	})
}

function addTextHighlight(elements: any[], text: string) {
	// Without `^$`, all the elements on the page will be matched if `text` is empty
	const pattern = new RegExp(text === '' ? '^$' : text)

	// `<span>` will change `color`.
	return elements.map((element) => {
		element.innerHTML = element.innerHTML.replace(
			pattern,
			'<span class="highlighted">$&</span>'
		)
		return element
	})
}

function removeTextHighlight(elements: any[]) {
	return elements.map((element: any) => {
		element.innerHTML = element.innerHTML.replace(/<\/?span[^>]*>/, '')
		return element
	})
}

function removeSelectedClass(currentElement: HTMLElement) {
	currentElement.querySelector('span')?.classList.remove('selected')
	return currentElement
}

// ## Utility Functions

function findPrevious(items: any[], currentItem: any) {
	const currentItemIndex = items.indexOf(currentItem)
	const lastElement = items[items.length - 1]
	const previousItem = items[currentItemIndex - 1]

	return currentItemIndex === 0
		? lastElement
		: previousItem
}

function findNext(items: any[], currentItem: any) {
	const currentItemIndex = items.indexOf(currentItem)
	const lastItemIndex = items.length - 1
	const nextItem = items[currentItemIndex + 1]

	return currentItemIndex === lastItemIndex ? items[0] : nextItem
}

function removeLast(items: any[]) {
	return items.filter((item, index) => {
		if (index !== items.length - 1) {
			return item
		}
	})
}

function isModifier(event: KeyboardEvent) {
	return event.ctrlKey || event.altKey || event.metaKey
}

// ## Other Functions

// TODO: find a cleaner or more functional way of doing this?
function resetAll() {
	keys = []
	currentElement = document.createElement('div')
	elements = removeTextHighlight(elements)
}

// ## React

function App() {
	// TODO: Global variables could be defined here

	// let [keysState, setKeysState] = useState<string[]>([])
	const inputRef = useRef<HTMLInputElement>(null)
	// const keysValue = keysState.map((key: string) => key).join()
	const [message, setMessage] = useState('Initial value')

	useEffect(() => {
		// function handleKeypress() {
		// 	setKeysState([...keys])

		// 	const inputElement = inputRef.current
		// 	console.log('inputElement', inputElement)
		// 	console.log('keysValue', keysValue)
		// 	if (inputElement) {
		// 		console.log('entered')
		// 		inputElement.value = keysValue
		// 	}
		// }

		// document.addEventListener('keydown', handleKeypress)

		// return () => {
		// 	document.removeEventListener('keydown', handleKeypress)
		// }
	}, [])


	function handleChange (event: any) {
		setMessage(event.target.value)
	}

	useEffect(() => {
		elements = removeTextHighlight(elements)

		const selectors = 'a, h3, button'

		console.log('messageInside:', message)
		elements = findElementsByText(selectors, message)
		console.log('elements:', elements)
		elements = addTextHighlight(elements, message)
	}, [message])

	console.log('messageOutside', message)

	// console.log('ks', keysState)
	// if (keysState.length) {
		return (
			<div id="keys">
				<input
					ref={inputRef}
					type="text"
					onChange={handleChange}
					value={message}
				/>
				<span id="count">
					{elements.indexOf(currentElement) + 1}/{elements.length}
				</span>
			</div>
		)
	// } else {
	// 	return null
	// }
}

const rootElement = document.createElement('div')

rootElement.setAttribute('id', 'app-wrapper')
document.body.appendChild(rootElement)

const root = createRoot(rootElement)

root.render(<App />)
