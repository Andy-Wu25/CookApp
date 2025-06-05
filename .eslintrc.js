module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        'react-native/react-native': true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', 'react-native', '@typescript-eslint'],
    rules: {
        'react-native/no-raw-text': ['error', { skip: ['StyledText'] }],
        'react/react-in-jsx-scope': 'off', // Not needed with React Native + Expo
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
