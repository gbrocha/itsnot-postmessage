import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import cleaner from 'rollup-plugin-cleaner'
import typescript from 'rollup-plugin-typescript2'
import ttypescript from 'ttypescript'
import alias from '@rollup/plugin-alias'

import packageJson from './package.json'

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']

export default {
  input: './src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: [
        {
          find: '@/',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    }),
    cleaner({ targets: ['build/'] }),
    peerDepsExternal(),
    resolve({ extensions }),
    commonjs(),
    typescript({
      typescript: ttypescript,
      useTsconfigDeclarationDir: true,
    }),
  ],
}
