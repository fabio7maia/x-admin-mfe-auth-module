import React from 'react';

interface AppHeaderProps {
	title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
	const language = 'PT';

	// eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
	const handleOnChangeLanguage = React.useCallback((evt): void => {}, []);

	return (
		<>
			<div
				style={{
					position: 'fixed',
					top: 0,
					minHeight: '55px',
					width: 'calc(100vw - 60px)',
					backgroundColor: 'red',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 30px',
					color: '#fff',
				}}
			>
				<h1>{title}</h1>
				<select value={language} onChange={handleOnChangeLanguage}>
					<option value="en">EN</option>
					<option value="pt">PT</option>
				</select>
			</div>
			<div style={{ height: '55px' }}></div>
		</>
	);
};

export default AppHeader;
