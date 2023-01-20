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
