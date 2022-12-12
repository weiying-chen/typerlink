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
		const nextElement = elements.reduce((result, element, index, array) => {
			if (element === currentElement) {
				result =
					index !== array.length - 1 ? array[index + 1] : array[0]
			}

			return result
		}, {})

		selectedElement = nextElement
	}

	if (event.key === '[') {
		const previousElement = elements.reduce(
			(result, element, index, array) => {
				if (element === currentElement) {
					result =
						index !== 0 ? array[index - 1] : array[array.length - 1]
				}

				return result
			},
			{}
		)

		selectedElement = previousElement
	}

	// If `return` is added `elements` won't be set correctly below.

	if (event.key === ' ') {
		event.preventDefault()
	}

	if (event.key === 'Enter') {
		if (!currentElement) {
			alert('currentElement is undefined')
		}
		currentElement.click()
		currentElement = document.createElement('div')
		keys = []
		elements = removeHighlight(elements)
	}

	if (event.key === 'Escape') {
		keys = []
		currentElement = document.createElement('div')
		elements = removeHighlight(elements)
	}

	if (event.key === 'Backspace') {
		keys = removeLast(keys)
	}

	if (/\b[a-z0-9]\b|[ ]/i.test(event.key)) {
		keys.push(event.key)
	}

	// console.log('keys', keys)

	// Since the text will have an HTML tag, searching for text will be affected
	elements = removeHighlight(elements)

	let text = keys.join('')
	// Without `^$`, all the elements on the page will be matched if `text` is empty
	const selectors = 'a, h3, button'

	elements = searchByText(selectors, text)
	elements = highlight(elements, text)

	if (currentElement) {
		currentElement = removeSelected(currentElement)
	}

	currentElement = selectedElement.innerHTML ? selectedElement : elements[0]

	if (currentElement) {
		currentElement.querySelector('mark')?.classList.add('selected')

		currentElement.scrollIntoView({
			block: 'center',
			behavior: 'auto',
		})
	}

	if (elements.length === 1) {
		if (!elements[0]) {
			alert('elements[0] is undefined')
		}
		elements[0].click()
		keys = []
		currentElement = document.createElement('div')
		elements = removeHighlight(elements)
		return
	}

	console.log('elements4', elements)
})

function searchByText(selectors: string, text: string) {
	// TODO: Remove conditional statement nesting
	const pattern = new RegExp(text === '' ? '^$' : text)

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

function highlight(elements: any[], text: string) {
	const pattern = new RegExp(text === '' ? '^$' : text)

	return elements.map((element) => {
		element.innerHTML = element.innerHTML.replace(
			pattern,
			'<mark class="highlighted">$&</mark>'
		)
		return element
	})
}

function removeHighlight(elements: any[]) {
	return elements.map((element: any) => {
		element.innerHTML = element.innerHTML.replace(/<\/?mark[^>]*>/, '')
		return element
	})
}

function removeSelected(currentElement: HTMLElement) {
	currentElement.querySelector('mark')?.classList.remove('selected')
	return currentElement
}

function removeLast(array: string[]) {
	return array.filter((item, index, array) => {
		if (index !== array.length - 1) {
			return item
		}
	})
}

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
