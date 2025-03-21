import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only'


export default {
  input: 'src/main.js',
  output: {
    format: 'iife',
    name: 'app',
    file: 'public/main.min.js'
  },
  plugins: [
    svelte(),
    css({ output: 'bundle.css' }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    //terser()
  ]
}; 