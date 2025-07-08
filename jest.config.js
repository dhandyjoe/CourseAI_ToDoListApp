module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.test.ts'],
	collectCoverage: false, // Set to true by default if you want coverage on every test run
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.d.ts',
		'!src/index.ts', // Exclude main entry point if desired
		'!src/config/**', // Exclude config files if desired
		'!src/migrations/**' // Exclude database migrations
	],
	coverageDirectory: 'coverage',
	coverageReporters: [
		'text',
		'text-summary',
		'html',
		'lcov'
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70
		}
	}
};
