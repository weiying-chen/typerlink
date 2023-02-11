export function isCommand(event: KeyboardEvent) {
	// TODO: maybe check for non-alphanumeric
	return (
		event.ctrlKey ||
		event.key === 'Enter' ||
		event.key === 'Escape' ||
		event.key === '/'
	);
}

export function isInInput(event: KeyboardEvent) {
	const target = event.target as HTMLElement;

	return (
		target.nodeName === 'INPUT' ||
		target.nodeName === 'TEXTAREA' ||
		target.isContentEditable
	);
}

export function getPrevious(items: any[], currentItem: any) {
	const currentItemIndex = items.indexOf(currentItem);
	const lastElement = items[items.length - 1];
	const previousItem = items[currentItemIndex - 1];

	return currentItemIndex === 0 ? lastElement : previousItem;
}

export function getNext(items: any[], currentItem: any) {
	const currentItemIndex = items.indexOf(currentItem);
	const lastItemIndex = items.length - 1;
	const nextItem = items[currentItemIndex + 1];

	return currentItemIndex === lastItemIndex ? items[0] : nextItem;
}

export function getTextNodes(node: Node): Text[] {
	let textNodes = [];

	if (node.nodeType === Node.TEXT_NODE) {
		textNodes.push(node as Text);
	}

	node.childNodes.forEach((childNode) => {
		textNodes.push(...getTextNodes(childNode));
	});

	return textNodes;
}

export function filterElementsByText(selectors: string, text: string) {
	if (!text) return [];

	// TODO: how about just using `text` and `includes`?
	const regex = new RegExp(text);
	const elements = [...document.querySelectorAll<HTMLElement>(selectors)];

	return elements.filter((element) => {
		// `innerText` will include the spaces created by tags.
		return element.textContent?.match(regex);
	});
}

export function addHighlight(elements: HTMLElement[], text: string) {
	elements.forEach((element, index) => {
		const textNodes = getTextNodes(element);

		// The first text that matches in the `element`.
		const foundTextNode = textNodes.find((node) =>
			node.textContent?.includes(text)
		);
		const div = document.createElement('div');
		const innerHTML = (foundTextNode?.textContent ?? '').replace(
			text,
			'<mark>$&</mark>'
		);

		// TODO: turn this into a function to make it declarative?
		foundTextNode?.parentNode?.insertBefore(div, foundTextNode);
		div.insertAdjacentHTML('afterend', innerHTML);
		div.remove();
		foundTextNode?.remove();
	});
}

export function removeHighlight(elements: any[]) {
	elements.forEach((element: any) => {
		element.innerHTML = element.innerHTML.replace(/<\/?mark[^>]*>/, '');
	});
}

// TODO: rename function
export function selectElement (foundSelectedElement: HTMLElement) {
	addSelectedClass(foundSelectedElement);
	foundSelectedElement.scrollIntoView({
		block: 'center',
		behavior: 'auto',
	});
} 

export function addSelectedClass(element: HTMLElement) {
	element.querySelector('mark')?.classList.add('selected');
}

export function removeSelectedClass (selectedElementRefCurrent: HTMLElement) {
	selectedElementRefCurrent
		.querySelector('mark')
		?.classList.remove('selected');
} 