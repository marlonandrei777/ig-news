module.exports = {
    // para quais pastas eu quero ignorar nos testes
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    /* para passar um array de arquivos que queremos q o jest execute
    antes de executar os testes */
    setupFilesAfterEnv: [
        "<rootDir>/src/tests/setupTests.ts"
    ],
    /* para arquivos com tais extensoes eu quero tranformar os arquivos
    de um jeito q o babel consiga entender esses arquivos */
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    // para indicar em qual ambiente os nossos testes estao executando
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "\\.(scss|css|sass)$": "identity-obj-proxy"
    },
    // coverageReports
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.tsx",
        "!src/**/*.spec.tsx",
        "!src/**/_app.tsx", // para ignorar o arquivo padrao app
        "!src/**/_document.tsx", // para ignorar o arquivo padrao document
    ],
    coverageReporters: ["lcov", "json"]
};