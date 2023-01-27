import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';
import App from './App';
import Dummy from './__mocks__/Dummy';

// Otherwise, the `scrollIntoView` called from `App` will throw an error.
Element.prototype.scrollIntoView = jest.fn();

describe('`input`', () => {
	beforeEach(() => {
		render(<App />);
	});

	test('is not visible on page load', () => {
		const input = screen.getByRole('textbox', { hidden: true });

		expect(input).not.toBeVisible();
	});

	test('is visible after pressing `/`', async () => {
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		expect(input).toBeVisible();
	});

	test('is not visible after pressing `Esc`', async () => {
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		expect(input).toBeVisible();

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(input).not.toBeVisible();
		
	});
});

describe('link', () => {
	beforeEach(async () => {
		const { container } = render(
			<>
				<Dummy />
				<App />
			</>
		);

		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');
	});

	test('has been highlighted`', () => {
		const link = screen.getByRole('link');
		const mark = within(link).getByText('Link');
		
		expect(mark).toBeInTheDocument();
		expect(mark.tagName).toBe('MARK');
	});

	test('has had highlight removed', () => {
		fireEvent.keyDown(document, { key: 'Escape' });

		const link = screen.getByRole('link');
		const mark = within(link).queryByText('Link');

		expect(mark).not.toBeInTheDocument();
	});

	test('has been selected`', () => {
		const link = screen.getByRole('link');
		const mark = within(link).getByText('Link');
		
		expect(mark).toHaveClass('selected');
	});

	// test('is the next one after pressing `]`', () => {
	// });

	// test('is the previous one after pressing `[`', () => {
	// });

	// test('has been follwed after pressing `Enter`', () => {
	// });
});
