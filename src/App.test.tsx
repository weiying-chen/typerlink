import '@testing-library/jest-dom';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
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

	test('is visible after pressing /', async () => {
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		expect(input).toBeVisible();
	});

	test('is not visible after pressing Esc', async () => {
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox');

		expect(input).toBeVisible();
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(input).not.toBeVisible();
	});
});

describe('link', () => {
	beforeEach(() => {
		const { container } = render(
			<>
				<Dummy />
				<App />
			</>
		);

		fireEvent.keyDown(document, { key: '/' });
	});

	test('has been highlighted`', async () => {
		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');

		const link = screen.getAllByRole('link')[0];

		const mark = within(link).getByText('Link');

		expect(mark).toBeInTheDocument();
		expect(mark.tagName).toBe('MARK');
	});

	test('has had highlight removed', async () => {
		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');

		fireEvent.keyDown(document, { key: 'Escape' });

		const link = screen.getAllByRole('link')[0];
		const mark = within(link).queryByText('Link');

		expect(mark).not.toBeInTheDocument();
	});

	test('#1 has been selected`', async () => {
		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');

		const link = screen.getAllByRole('link')[0];
		const mark = within(link).getByText('Link');

		expect(mark).toHaveClass('selected');
	});

	test('#1 has been deselected next after pressing ]', async () => {
		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');

		fireEvent.keyDown(document, { key: ']', ctrlKey: true });

		const link = screen.getAllByRole('link')[0];
		const mark = within(link).getByText('Link');

		expect(mark).not.toHaveClass('selected');
	});

	// TODO: test is not longer selected when pressing ] or [
	test('#2 has been selected after pressing ]', async () => {
		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');

		fireEvent.keyDown(document, { key: ']', ctrlKey: true });

		const link = screen.getAllByRole('link')[1];
		const mark = within(link).getByText('Link');

		expect(mark).toHaveClass('selected');
	});

	test('is the next one after pressing [', async () => {
		const input = screen.getByRole('textbox');

		await userEvent.type(input, 'Link');

		fireEvent.keyDown(document, { key: '[', ctrlKey: true });

		const link = screen.getAllByRole('link')[2];
		const mark = within(link).getByText('Link');

		expect(mark).toHaveClass('selected');
	});

	test('is clicked after pressing Enter', async () => {
		const input = screen.getByRole('textbox');
	
		await userEvent.type(input, 'Link');
	
		const link = screen.getAllByRole('link')[0];
		const handleMockLinkClick = jest.fn();

		link.addEventListener('click', handleMockLinkClick);
		fireEvent.keyDown(document, { key: 'Enter' });
		expect(handleMockLinkClick).toHaveBeenCalled();
	});
});
