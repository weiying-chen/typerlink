import React from 'react'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

function isModifier(event: KeyboardEvent) {
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
	// So it doesn't interfere with Chrome's default space behavior
	if (event.key === ' ' && !keys.length) return

	const target = event.target as HTMLElement

	if (
		target.nodeName === 'INPUT' ||
		target.nodeName === 'TEXTAREA' ||
		target.isContentEditable
	) {
		keys = []
		return
	}

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

	if (event.key === 'Backspace') {
		keys = removeLast(keys)
	}

	if (/\b[a-z0-9]\b|[ ]/i.test(event.key)) {
		keys.push(event.key)
	}

	// console.log('keys', keys)

	// Since the text will have an HTML tag, searching for text will be affected
	elements = removeTextHighlight(elements)

	const selectors = 'a, h3, button'
	const text = keys.join('')

	elements = findElementsByText(selectors, text)
	elements = highlightText(elements, text)

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

	if (elements.length === 1) {
		elements[0].click()
		resetAll()
		return
	}

	console.log('elements 6', elements)
})

function findElementsByText(selectors: string, text: string) {
	// Without `^$`, all the elements on the page will be matched if `text` is empty
	const pattern = new RegExp(text === '' ? '^$' : text)

	// TODO: Remove conditional statement nesting
	return [...document.querySelectorAll(selectors)].filter((element) => {
		if (element.childNodes) {
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

// Element functions

function highlightText(elements: any[], text: string) {
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

// Utils

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

// Reset

// TODO: find a cleaner or more functional way of doing this?
function resetAll() {
	keys = []
	currentElement = document.createElement('div')
	elements = removeTextHighlight(elements)
}

// React

function App() {
	let [keysState, setKeysState] = useState<string[]>([])

	useEffect(() => {
		function handleKeypress() {
			setKeysState([...keys])
		}

		document.addEventListener('keydown', handleKeypress)

		return () => {
			document.removeEventListener('keydown', handleKeypress)
		}
	}, [])

	if (keysState.length) {
		return (
			<div id="keys">
				<span id="matches">{keysState.map((key: string) => key)}</span>
				<span id="caret">|</span>
				<span id="count">
					{elements.indexOf(currentElement) + 1}/{elements.length}
				</span>
			</div>
		)
	} else {
		return null
	}
}

const rootElement = document.createElement('div')

rootElement.setAttribute('id', 'app-wrapper')
document.body.appendChild(rootElement)

const root = createRoot(rootElement)

root.render(<App />)
