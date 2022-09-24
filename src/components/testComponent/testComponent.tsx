import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

export interface TestComponentProps {
	state?: Record<string, any>;
	children: React.ReactNode;
}

export const TestComponent: React.FC<TestComponentProps> = ({ children }) => {
	return (
		<HashRouter>
			<Route element={<>{children}</>} />
		</HashRouter>
	);
};
