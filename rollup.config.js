import babel from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

import pkg from './package.json';

const extensions = ['.js', '.ts']

const plugins = [
  json({ compact: true }),
  resolve({ extensions }),
  commonjs(),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
    extensions,
    include: ['src/**/*'],
  }),
  terser(),
  process.env.BUNDLE_SIZE ? visualizer() : null,
];

const normalBundle = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    },
  ],
  plugins,
};

const browserBundle = {
  input: 'src/index.ts',
  output: [
    {
      name: 'visualiser',
      file: pkg.browser,
      format: 'umd',
    }
  ],
  plugins,
};

export default () =>
  process.env.ROLLUP_WATCH
    ? [normalBundle]
    : [normalBundle, browserBundle];