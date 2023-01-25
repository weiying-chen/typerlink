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
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		expect(input).toBeVisible();
	});
})

describe('`button`', () => {
	test('has been highlighted`', async () => {
		const { container } = render(
			<>
				<Dummy />
				<App />
			</>
		);

		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'B');

		const button = screen.getByRole('button');

		expect(container).toMatchSnapshot();
		expect(button).toBeVisible();

		// TODO: Ask ChatGPT
		// 1. the best way to test <button><mark>B</mark></button> 
		// 2. If jest.mock() should be used
		// 3. If can change the `fireEvent`s to `userEvent`s. 
	});
});
