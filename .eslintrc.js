module.exports = {
    "extends": "google",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": 0,
        "require-jsdoc": "off",
        "comma-dangle": ["error", "never"],
        "max-len": ["error", { "ignoreStrings": true }]
    }
};