import React from 'react';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client';
// This is being added to dummy.html
import '../public/style.css';

// # Up-level Variables

let keys: string[] = [];
// let elements: any[] = []

// TODO: maybe replace creating div with something less hacky
let currentElement: HTMLElement = document.createElement('div');
let selectedElement: HTMLElement = document.createElement('div');

// ## Listeners

// document.removeEventListener('keydown', handleKeydown)
// document.addEventListener('keydown', handleKeydown)

// ## Main Function

function handleKeydown(event: KeyboardEvent) {
	// ## Exit conditions

	if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
	if (event.key === 'Backspace') return;

	if (isModifier(event)) return;
	if (event.key === 'Shift') return;

	// So it doesn't interfere with Chrome's default space behavior
	if (event.key === ' ' && !keys.length) return;

	const target = event.target as HTMLElement;

	if (
		// TODO: fix this hack
		// target.nodeName === 'INPUT' ||
		target.nodeName === 'TEXTAREA' ||
		target.isContentEditable
	) {
		keys = [];
		return;
	}

	// ## Key Actions

	// If some of these conditional statements are put down below, they might not affect `elements`.

	if (event.key === ']') {
		// selectedElement = findNext(elements, currentElement)
	}

	if (event.key === '[') {
		// selectedElement = findPrevious(elements, currentElement)
	}

	// If `return` is added `elements` won't be set correctly below.
	if (event.key === ' ') {
		event.preventDefault();
	}

	if (event.key === 'Enter') {
		if (!currentElement) return;
		currentElement.click();
		resetAll();
	}

	if (event.key === 'Escape') {
		resetAll();
	}

	// if (event.key === 'Backspace') {
	// 	keys = removeLast(keys)
	// }

	if (/\b[a-z0-9]\b|[ ]/i.test(event.key)) {
		keys.push(event.key);
	}

	// console.log('keys', keys)

	// ## `elements`

	// Since the text will have an HTML tag, searching for text will be affected
	// elements = removeTextHighlight(elements)

	const selectors = 'a, button';
	const text = keys.join('');

	// elements = findElementsByText(selectors, text)

	// ## `currentElement`

	// elements = addTextHighlight(elements, text)

	if (currentElement) {
		currentElement = removeSelectedClass(currentElement);
	}

	// currentElement = selectedElement.innerHTML ? selectedElement : elements[0]

	if (currentElement) {
		currentElement.querySelector('span')?.classList.add('selected');

		currentElement.scrollIntoView({
			block: 'center',
			behavior: 'auto',
		});
	}

	// ## Only One Element

	// if (elements.length === 1) {
	// 	elements[0].click()
	// 	resetAll()
	// 	return
	// }

	// console.log('elements 6', elements)
}

// ## DOM Functions

function findElementsByText(selectors: string, text: string) {
	// Without `^$`, all the elements on the page will be matched if `text` is empty
	const pattern = new RegExp(text === '' ? '^$' : text);

	// TODO: Remove conditional statement nesting
	return [...document.querySelectorAll(selectors)].filter((element) => {
		if (element.childNodes) {
			const nodeWithText = [...element.childNodes].find(
				(childNode) => childNode.nodeType == Node.TEXT_NODE
			);

			if (nodeWithText) {
				if (nodeWithText.textContent?.match(pattern)) {
					return element;
				}
			}
		}
	});
}

function addTextHighlight(elements: any[], text: string) {
	// Without `^$`, all the elements on the page will be matched if `text` is empty
	const pattern = new RegExp(text === '' ? '^$' : text);

	// `<span>` will change `color`.
	return elements.map((element) => {
		element.innerHTML = element.innerHTML.replace(
			pattern,
			'<span class="highlighted">$&</span>'
		);
		return element;
	});
}

function removeTextHighlight(elements: any[]) {
	return elements.map((element: any) => {
		element.innerHTML = element.innerHTML.replace(/<\/?span[^>]*>/, '');
		return element;
	});
}

function removeSelectedClass(currentElement: HTMLElement) {
	currentElement.querySelector('span')?.classList.remove('selected');
	return currentElement;
}

// TODO: turn into a pure function
function setCurrentElement(
	currentElement: HTMLElement,
	elements: any[],
	selectedElement: HTMLElement
) {
	if (currentElement) {
		currentElement = removeSelectedClass(currentElement);
	}

	// This is the problem (maybe selectedElement)

	return selectedElement.innerHTML ? selectedElement : elements[0];

	// console.log('currentElement', currentElement)

	// if (currentElement) {
	// 	currentElement = removeSelectedClass(currentElement)
	// }

	// console.log('currentElement', currentElement)
	// currentElement = selectedElement.innerHTML ? selectedElement : elements[0]

	// if (currentElement) {
	// 	currentElement.querySelector('span')?.classList.add('selected')

	// 	currentElement.scrollIntoView({
	// 		block: 'center',
	// 		behavior: 'auto',
	// 	})
	// }
}

// ## Utility Functions

function findPrevious(items: any[], currentItem: any) {
	const currentItemIndex = items.indexOf(currentItem);
	const lastElement = items[items.length - 1];
	const previousItem = items[currentItemIndex - 1];

	return currentItemIndex === 0 ? lastElement : previousItem;
}

function findNext(items: any[], currentItem: any) {
	const currentItemIndex = items.indexOf(currentItem);
	const lastItemIndex = items.length - 1;
	const nextItem = items[currentItemIndex + 1];

	// console.log('currentItem:', currentItem)
	// console.log('currentItemIndex', currentItemIndex)

	return currentItemIndex === lastItemIndex ? items[0] : nextItem;
}

function removeLast(items: any[]) {
	return items.filter((item, index) => {
		if (index !== items.length - 1) {
			return item;
		}
	});
}

function isModifier(event: KeyboardEvent) {
	return event.ctrlKey || event.altKey || event.metaKey;
}

// ## Other Functions

// TODO: find a cleaner or more functional way of doing this?
function resetAll() {
	keys = [];
	currentElement = document.createElement('div');
	// elements = removeTextHighlight(elements)
	// // Must remove the highlight before cleaning the element
	// elements = []
}

// ## React

function App() {
	// const inputRef = useRef<HTMLInputElement>(null)
	// const [documentEvent, setDocumentEvent] = useState<KeyboardEvent>(
	// 	{} as KeyboardEvent
	// )
	const [inputValue, setInputValue] = useState('');
	const [elements, setElements] = useState<HTMLElement[]>([]);
	const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
		null
	);

	// This is needed because `selectedElement` only the initial state inside `handleDocumentKeyDown`.
	const selectedElementRef = useRef(selectedElement);
	const elementsRef = useRef(elements);
	const inputRef = useRef<HTMLInputElement | null>(null);

	selectedElementRef.current = selectedElement;
	elementsRef.current = elements;

	function findElementsByText(selectors: string, text: string) {
		if (!text) return [];

		const regex = new RegExp(text);
		const elements = [...document.querySelectorAll<HTMLElement>(selectors)];

		return elements.filter((element) => {
			// `innerText` will include the spaces created by tags.
			return element.textContent?.match(regex);
		});
	}

	function addHighlight(elements: any[], pattern: string) {
		elements.forEach((element, index) => {
			element.innerHTML = element.innerHTML.replace(
				pattern,
				`<mark>$&</mark>`
			);
		});
	}

	function removeHighlight(elements: any[]) {
		elements.forEach((element: any) => {
			element.innerHTML = element.innerHTML.replace(/<\/?mark[^>]*>/, '');
		});
	}

	function addSelected(element: HTMLElement) {
		element.querySelector('mark')?.classList.add('selected');
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		// const selectors = 'a, button'
		const selectors = 'a, button';
		const { value } = event.target as HTMLInputElement;

		// TODO: Rename "found" to something else?
		const foundElements = findElementsByText(selectors, value);
		const foundSelectedElement = foundElements[0] || null;

		// These functions can't be pure, because they have to access the original HTML elements
		if (elements.length) removeHighlight(elements);
		if (foundElements.length) addHighlight(foundElements, value);

		// No need to remove `selected` from the previous element because `removeHighlights` is removing `marks`.
		if (foundSelectedElement) addSelected(foundSelectedElement);

		setInputValue(value);
		setElements(foundElements);
		setSelectedElement(foundSelectedElement);
	}

	function isCommand(event: KeyboardEvent) {
		// TODO: maybe check for non-alphanumeric
		return event.ctrlKey || event.key === 'Enter' || event.key === 'Escape';
	}

	function handleDocumentKeyDown(event: any) {
		if (!isCommand(event)) return;
		// setDocumentEvent(event)
		if (event.ctrlKey && event.key === ']') {
			const foundSelectedElement = findNext(
				elementsRef.current,
				selectedElementRef.current
			);

			selectedElementRef.current
				?.querySelector('mark')
				?.classList.remove('selected');

			if (foundSelectedElement) addSelected(foundSelectedElement);

			setSelectedElement(foundSelectedElement);
		}

		if (event.key === 'Enter') {
			if (!selectedElementRef.current) return;

			selectedElementRef.current.click();
			setInputValue('');
			setElements([]);

			// This will also set `selectedElementRef.current to `null`.
			setSelectedElement(null);
		}
		// event.preventDefault() // to prevent keys like Ctrl + v?
	}

	useEffect(() => {
		// A React event handler can't be used, because it can't access `document`.
		inputRef.current?.focus();

		document.addEventListener('keydown', handleDocumentKeyDown);

		return () => {
			document.removeEventListener('keydown', handleDocumentKeyDown);
		};
	}, []);

	// useEffect(() => {
	// 	console.log('elements:', elements)
	// }, [elements])

	// useEffect(() => {
	// 	console.log('selectedElement:', selectedElement)
	// }, [selectedElement])

	// useEffect(() => {
	// 	console.log('selectedElementRef.current:', selectedElementRef.current)
	// }, [selectedElementRef.current])

	// useEffect(() => {
	// 	if (elements.length) {
	// 		// console.log('elements:', elements[0].textContent)
	// 		// console.log('inputValue:', inputValue)
	// 		setElements(addTextHighlight(elements, inputValue))
	// 	}
	// }, [inputValue])

	// useEffect(() => {
	// 	// TODO: Maybe this should be outside of the component
	// 	function handleKeydown(event: KeyboardEvent) {
	// 		elements = removeTextHighlight(elements)

	// 		const target = event.target as HTMLInputElement

	// 		console.log('key', event.key)
	// 		console.log('value', target.value)

	// 		if (event.ctrlKey && event.key === ']') {
	// 			selectedElement = findNext(elements, currentElement)
	// 		}

	// 		if (event.ctrlKey && event.key === '[') {
	// 			// console.log('blurred')

	// 			selectedElement = findPrevious(elements, currentElement)
	// 		}

	// 		if (event.key === 'Enter') {
	// 			if (!currentElement) return
	// 			currentElement.click()
	// 			resetAll()
	// 		}

	// 		if (event.key === 'Escape') {
	// 			resetAll()
	// 		}

	// 		// console.log('currentElement', currentElement)
	// 		// console.log('elements', elements)
	// 		// console.log('selectedElement', selectedElement)
	// 		currentElement = setCurrentElement(
	// 			currentElement,
	// 			elements,
	// 			selectedElement
	// 		)

	// 		// if (currentElement) {
	// 		// 	currentElement = removeSelectedClass(currentElement)
	// 		// }

	// 		// currentElement = selectedElement.innerHTML ? selectedElement : elements[0]

	// 		// console.log('currentElement', currentElement)

	// 		// console.log('currentElement', currentElement)

	// 		// console.log('currentElement', currentElement)

	// 		currentElement.querySelector('span')?.classList.add('selected')

	// 		if (currentElement) {
	// 			// console.log('querySelector', currentElement.querySelector('span'))
	// 			// console.log('currentElement after', currentElement)

	// 			currentElement.scrollIntoView({
	// 				block: 'center',
	// 				behavior: 'auto',
	// 			})
	// 		}
	// 	}

	// 	// document.addEventListener('keydown', checkKeyPress)

	// 	// return () => {
	// 	// 	document.removeEventListener('keydown', checkKeyPress)
	// 	// }
	// }, [])

	// useEffect(() => {
	// 	// console.log('Value:', value)
	// 	console.log('keyEvent', documentEvent)
	// 	console.log('value', inputValue)

	// 	if (documentEvent.key === ']') {
	// 		selectedElement = findNext(elements, currentElement)
	// 	}

	// 	if (documentEvent.key === '[') {
	// 		selectedElement = findPrevious(elements, currentElement)
	// 	}

	// 	if (documentEvent.key === 'Enter') {
	// 		if (!currentElement) return
	// 		currentElement.click()
	// 		resetAll()
	// 		console.log('elements:', elements)
	// 		return
	// 	}

	// 	if (documentEvent.key === 'Escape') {
	// 		resetAll()
	// 		return
	// 	}

	// 	const selectors = 'a, h3, button'

	// 	// elements = removeTextHighlight(elements)
	// 	// elements = findElementsByText(selectors, inputValue)
	// 	// elements.push('element') // THIS UPDATES ELEMENTS PROPERLY
	// 	// console.log('inputValue:', inputValue)

	// 	const pattern = new RegExp(inputValue === '' ? '^$' : inputValue)

	// 	// TODO: Remove conditional statement nesting
	// 	elements = [...document.querySelectorAll(selectors)].filter(
	// 		(element) => {
	// 			if (element.childNodes) {
	// 				const nodeWithText = [...element.childNodes].find(
	// 					(childNode) => childNode.nodeType === Node.TEXT_NODE
	// 				)

	// 				if (nodeWithText) {
	// 					// if (nodeWithText.textContent?.match(pattern)) {
	// 					return element
	// 					// }
	// 				}

	// 				// if (nodeWithText) {
	// 				// 	if (nodeWithText.textContent?.match(pattern)) {
	// 				// 		return element
	// 				// 	}
	// 				// }
	// 			}
	// 		}
	// 	)

	// 	console.log('elements.length', elements.length)

	// 	// elements = addTextHighlight(elements, inputValue)

	// 	// if (currentElement) {
	// 	// 	currentElement = removeSelectedClass(currentElement)
	// 	// }

	// 	// currentElement = selectedElement.innerHTML ? selectedElement : elements[0]

	// 	// if (currentElement) {
	// 	// 	currentElement.querySelector('span')?.classList.add('selected')

	// 	// 	currentElement.scrollIntoView({
	// 	// 		block: 'center',
	// 	// 		behavior: 'auto',
	// 	// 	})
	// 	// }

	// 	// console.log('elements:', elements.length)
	// }, [documentEvent, inputValue])

	// useEffect(() => {
	// 	// console.log('KEY')

	// 	if (keyEvent.ctrlKey && keyEvent.key === ']') {
	// 		selectedElement = findNext(elements, currentElement)
	// 	}

	// 	if (keyEvent.ctrlKey && keyEvent.key === '[') {
	// 		selectedElement = findPrevious(elements, currentElement)
	// 	}

	// 	// currentElement = setCurrentElement(currentElement, elements, selectedElement)

	// 	// if (currentElement) {
	// 	// 	currentElement = removeSelectedClass(currentElement)
	// 	// }

	// 	// This is the problem (maybe selectedElement)

	// 	if (!elements.length) return
	// 	currentElement = elements[0]

	// 	currentElement.innerHTML = currentElement.innerHTML.replace(
	// 		'React',
	// 		'<span class="highlighted">$&</span>'
	// 	)

	// 	// if (currentElement) {
	// 	// 	currentElement = removeSelectedClass(currentElement)
	// 	// }

	// 	// currentElement = selectedElement.innerHTML ? selectedElement : elements[0]
	// 	// currentElement.innerHTML = currentElement.innerHTML.replace(
	// 	// "",
	// 	// "<span></span>"
	// 	// )

	// 	if (currentElement) {
	// 		const spanElement = currentElement.querySelector('span')
	// 		spanElement?.classList.add('selected')
	// 		// console.log('currentElement', currentElement)
	// 		// console.log('spanElement', spanElement)

	// 		currentElement.scrollIntoView({
	// 			block: 'center',
	// 			behavior: 'auto',
	// 		})
	// 	}
	// }, [keyEvent])

	return (
		<div id="keys">
			<input
				ref={inputRef}
				type="text"
				onChange={handleInputChange}
				value={inputValue}
			/>
			<span id="count">
				{/* TODO: Turn this into a variable */}
				{selectedElement ? elements.indexOf(selectedElement) + 1 : 0}/
				{elements.length}
			</span>
			<abbr>a</abbr>
			<abbr>b</abbr>
			<abbr>c</abbr>
		</div>
	);
}

const rootElement = document.createElement('div');

rootElement.setAttribute('id', 'app-wrapper');
document.body.appendChild(rootElement);

const root = createRoot(rootElement);

root.render(<App />);
