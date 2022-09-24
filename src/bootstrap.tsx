import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

const targetElement = document.getElementById('root');

if (targetElement) {
	const root = ReactDOM.createRoot(targetElement);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
