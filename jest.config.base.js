module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    testMatch: [
        "**/test/unit/**/*.test.ts"
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "**/src/**/*.ts",
        "!**/node_modules/**",
        "!**/dist/**",
        "!**/test/**",
        "!**/index.ts"
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: [
        "text",
        "lcov"
    ],
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 15000,
    transform: {
        "^.+\\.ts?$": [
            "ts-jest",
            {
                isolatedModules: true,
                tsconfig: "<rootDir>/tsconfig.json"
            }
        ]
    },
    modulePathIgnorePatterns: [
        "<rootDir>/dist/"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ]
};
