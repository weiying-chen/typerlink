import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';
import App from './App';

describe('App Test', () => {
	test('`input` is not visible on page load', () => {
		render(<App />);

		const input = screen.getByRole('textbox', { hidden: true });

		expect(input).not.toBeVisible();
	});

	test('`input` is visible after pressing `/`', () => {
		render(<App />);
		fireEvent.keyDown(document, { key: '/' });

		const input = screen.getByRole('textbox', { hidden: true });

		expect(input).toBeVisible();
	});
});
