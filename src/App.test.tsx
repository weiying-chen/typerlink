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

	test('is visible after pressing `/`', async () => {
		const { container } = render(<App />);

		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		expect(input).toBeVisible();
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

		const link = screen.getByRole('link');
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
});
