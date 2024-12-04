// 安装rollup
// npm install --save-dev rollup rollup-plugin-babel rollup-plugin-uglify rollup-plugin-node-resolve rollup-plugin-commonjs

import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser'; // Uglify 的现代替代品
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'app'
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env']
        }),
        terser()
    ]
};