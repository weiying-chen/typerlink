import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';
import App from './App';
import Dummy from './__mocks__/Dummy';

// Otherwise, the `scrollIntoView` called from `App` will throw an error.
Element.prototype.scrollIntoView = jest.fn();

describe('`input`', () => {
	test('is not visible on page load', () => {
		render(<App />);

		const input = screen.getByRole('textbox', { hidden: true });

		expect(input).not.toBeVisible();
	});

	test('is visible after pressing `/`', () => {
		render(<App />);

		// TODO: See if can use `userEvent` instead.
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		expect(input).toBeVisible();
	});
});

describe('target element', () => {
	test('has been highlighted`', async () => {
		const { container } = render(
			<>
				<Dummy />
				<App />
			</>
		);

		// TODO: See if can use `userEvent` instead.
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');

		const link = screen.getByRole('link');

		// `getByRole('mark')` doesn't work for now, so this is a temporary replacement.
		const mark = within(link).getByText('Link');

		expect(mark).toBeInTheDocument()
		expect(mark.tagName).toBe('MARK') 
	
		// TODO: Ask ChatGPT
		// 1. the best way to test <a href="#"><mark>Link text</mark></a>
		// 2. If jest.mock() should be used
		// 3. If can change the `fireEvent`s to `userEvent`s.
	});
});
