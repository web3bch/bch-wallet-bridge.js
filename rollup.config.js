import babel from "rollup-plugin-babel"
import pkg from "./package.json"

export default {
    input: './src/web3bch/index.ts',
    plugins: [
        babel({ extensions: ['.ts'], exclude: ['dist/**', 'node_modules/**'] }),
    ],
    output: [
        { file: pkg.main, format: 'cjs' },
    ],
}