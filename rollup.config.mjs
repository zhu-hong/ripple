import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default defineConfig({
  input: 'src/ripple/Ripple.jsx',
  external: ['clsx','goober','react','react-dom','react-transition-group'],
  plugins: [
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
    }),
    nodeResolve(),
  ],
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: false,
  },
})