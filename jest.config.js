module.exports = {
	roots: ['src'],
	testMatch: ['**/?(*.)+(test).+ts'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
};
