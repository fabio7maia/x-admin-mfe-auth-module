/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
require('jest-canvas-mock');
require('@testing-library/jest-dom');

const emptyFn = () => {};

window.console = {
	log: emptyFn,
	error: emptyFn,
	warn: emptyFn,
};
