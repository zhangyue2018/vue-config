module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'], // 继承react官方规则
    parserOptions: {
        parser: "@babel/eslint-parser"
    }
}