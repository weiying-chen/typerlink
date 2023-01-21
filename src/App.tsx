import React from 'react';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
	getPrevious,
	getNext,
	findElementsByText,
	addHighlight,
	removeHighlight,
	addSelectedClass,
} from './utils';
// import './style.css';

type ContentEditableElement = HTMLElement & {
	contentEditable: 'true' | 'false';
	innerHTML: string;
};

function App() {
	const [inputValue, setInputValue] = useState('');
	const [elements, setElements] = useState<HTMLElement[]>([]);
	const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
		null
	);
	// TODO: Maybe merge this with `inputValue`?
	const [isInputFocused, setIsInputFocused] = useState(false);

	// This is needed because `selectedElement` only the initial state inside `handleDocumentKeyDown`.
	const elementsRef = useRef(elements);
	const selectedElementRef = useRef(selectedElement);
	const inputRef = useRef<HTMLInputElement | null>(null);

	selectedElementRef.current = selectedElement;
	elementsRef.current = elements;

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		// The default `input` behavior already ignores Ctrl commands.
		const selectors = 'a, button';
		const { value } = event.target as HTMLInputElement;

		// TODO: Rename "found" to something else?
		const foundElements = findElementsByText(selectors, value);
		const foundSelectedElement = foundElements[0] || null;

		// These functions can't be pure, because they have to access the original HTML elements
		if (elements.length) removeHighlight(elements);
		if (foundElements.length) addHighlight(foundElements, value);

		// No need to remove `selected` from the previous element because `removeHighlights` is removing `<marks>`.
		if (foundSelectedElement) {
			addSelectedClass(foundSelectedElement);
			foundSelectedElement.scrollIntoView({
				block: 'center',
				behavior: 'auto',
			});
		}

		setInputValue(value);
		setElements(foundElements);
		setSelectedElement(foundSelectedElement);
	}

	function handleInputBlur(event: ChangeEvent<HTMLInputElement>) {
		setIsInputFocused(false);
		setInputValue('');

		// Highlight won't be removed if `elements` are set to `[]`.
		if (elementsRef.current.length) removeHighlight(elementsRef.current);

		setElements([]);

		// This will also set `selectedElementRef.current to `null`.
		setSelectedElement(null);
	}

	function isInInput(event: KeyboardEvent) {
		const target = event.target as HTMLElement;

		return (
			target.nodeName === 'INPUT' ||
			target.nodeName === 'TEXTAREA' ||
			target.isContentEditable
		);
	}

	function isCommand(event: KeyboardEvent) {
		// TODO: maybe check for non-alphanumeric
		return (
			event.ctrlKey ||
			event.key === 'Enter' ||
			event.key === 'Escape' ||
			event.key === '/'
		);
	}

	function handleDocumentKeyDown(event: any) {
		if (!isCommand(event)) return;

		// TODO: Make this DRY.
		// And maybe there should only be a function inside each key event
		if (event.ctrlKey && event.key === ']') {
			const foundSelectedElement = getNext(
				elementsRef.current,
				selectedElementRef.current
			);

			selectedElementRef.current
				?.querySelector('mark')
				?.classList.remove('selected');

			if (foundSelectedElement) {
				addSelectedClass(foundSelectedElement);
				foundSelectedElement.scrollIntoView({
					block: 'center',
					behavior: 'auto',
				});
			}

			setSelectedElement(foundSelectedElement);
		}

		if (event.ctrlKey && event.key === '[') {
			const foundSelectedElement = getPrevious(
				elementsRef.current,
				selectedElementRef.current
			);

			selectedElementRef.current
				?.querySelector('mark')
				?.classList.remove('selected');

			if (foundSelectedElement) {
				addSelectedClass(foundSelectedElement);
				foundSelectedElement.scrollIntoView({
					block: 'center',
					behavior: 'auto',
				});
			}

			setSelectedElement(foundSelectedElement);
		}

		if (event.key === 'Enter') {
			if (!selectedElementRef.current) return;

			selectedElementRef.current.click();
			setInputValue('');

			// Highlight won't be removed if `elements` are set to `[]`.
			if (elementsRef.current.length)
				removeHighlight(elementsRef.current);

			setElements([]);

			// This will also set `selectedElementRef.current to `null`.
			setSelectedElement(null);
		}

		if (event.key === 'Escape') {
			(
				document.activeElement as
					| HTMLInputElement
					| HTMLTextAreaElement
					| ContentEditableElement
			)?.blur();
		}

		if (event.key === '/' && !isInInput(event)) {
			// Prevents `/` from being input.
			event.preventDefault();
			setIsInputFocused(true);
		}
	}

	useEffect(() => {
		// A React event handler can't be used, because it can't access `document`.
		document.addEventListener('keydown', handleDocumentKeyDown);

		return () => {
			document.removeEventListener('keydown', handleDocumentKeyDown);
		};
	}, []);

	useEffect(() => {
		inputRef.current?.focus();
	}, [isInputFocused]);
	
	return (
		<div id="keys" style={{ display: isInputFocused ? 'flex' : 'none' }}>
			<input
				type="text"
				ref={inputRef}
				onChange={handleInputChange}
				onBlur={handleInputBlur}
				value={inputValue}
			/>
			<span id="count">
				{/* TODO: Turn this into a variable */}
				{selectedElement ? elements.indexOf(selectedElement) + 1 : 0}/
				{elements.length}
			</span>
		</div>
	);
}

export default App