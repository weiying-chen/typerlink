import React from 'react';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
	getPrevious,
	getNext,
	filterElementsByText,
	addHighlight,
	removeHighlight,
	isCommand,
	isInInput,
	selectElement,
	removeSelectedClass,
} from './utils';
// import './style.css';

type ContentEditableElement = HTMLElement & {
	contentEditable: 'true' | 'false';
	innerHTML: string;
};

function App() {
	const [elements, setElements] = useState<HTMLElement[]>([]);

	const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
		null
	);

	const [inputValue, setInputValue] = useState('');

	// TODO: Maybe merge this with `inputValue`?
	const [isInputFocused, setIsInputFocused] = useState(false);
	const elementsRef = useRef(elements);

	// This is needed because `selectedElement` only the initial state inside `handleDocumentKeyDown`.
	const selectedElementRef = useRef(selectedElement);
	const inputRef = useRef<HTMLInputElement | null>(null);

	elementsRef.current = elements;
	selectedElementRef.current = selectedElement;

	// The default `input` behavior already ignores Ctrl commands.
	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		// These functions can't be pure, because they have to access the original HTML elements
		if (elements.length) removeHighlight(elements);

		const selectors = 'a, button';
		const { value } = event.target as HTMLInputElement;

		// TODO: Rename "found" to something else?
		const foundElements = filterElementsByText(selectors, value);

		if (foundElements.length) addHighlight(foundElements, value);

		const foundSelectedElement = foundElements[0] || null;

		// No need to remove `selected` from the previous element because `removeHighlights` is removing `<marks>`.
		if (foundSelectedElement) {
			selectElement(foundSelectedElement)
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

	function handleDocumentKeyDown(event: any) {
		if (!isCommand(event)) return;

		// TODO: Make this DRY.
		// And maybe there should only be a function inside each key event
		if (event.ctrlKey && event.key === ']') {
			if (selectedElementRef.current) removeSelectedClass(selectedElementRef.current)

			const foundSelectedElement = getNext(
				elementsRef.current,
				selectedElementRef.current
			);

			if (foundSelectedElement) {
				selectElement(foundSelectedElement)
			}

			setSelectedElement(foundSelectedElement);
		}

		if (event.ctrlKey && event.key === '[') {
			if (selectedElementRef.current) removeSelectedClass(selectedElementRef.current)

			const foundSelectedElement = getPrevious(
				elementsRef.current,
				selectedElementRef.current
			);

			if (foundSelectedElement) {
				selectElement(foundSelectedElement)
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