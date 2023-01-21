import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('App Test', () => {
	test('`#keys` has display: none on page load', async () => {
        const app = render(<App />);
        // const appElement = app.container.querySelector('#keys') 
        // expect(appElement).toBe
    });
});
