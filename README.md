# @scandinavianairlines/vite-plugin-babel

Run Babel during every Vite command — `serve`, `build`, and dependency optimization.

> [!NOTE]
> This is a fork of [`vite-plugin-babel`](https://github.com/owlsdepartment/vite-plugin-babel) by [Miłosz Mandowski](https://github.com/owlsdepartment), rewritten in plain JavaScript for Babel 8 and Vite 8+. All credit for the original idea and implementation goes to its authors. See [Migrating from `vite-plugin-babel`](#migrating-from-vite-plugin-babel) for the differences.

## Requirements

- Node.js 24 or newer
- `vite` 8 or newer
- `@babel/core` ^8

## Installation

```bash
pnpm add -D @scandinavianairlines/vite-plugin-babel @babel/core
```

## Usage

```js
import babel from '@scandinavianairlines/vite-plugin-babel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    babel({
      babelConfig: {
        plugins: ['@babel/plugin-proposal-decorators'],
      },
    }),
  ],
});
```

Project-wide Babel config files (`babel.config.*`) are honored; file-relative `.babelrc` files are not. Babel plugins and presets must be installed separately.

## Options

| Name            | Type                                             | Default          | Description                                                                                                                        |
| --------------- | ------------------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `apply`         | `'serve' \| 'build' \| (config, env) => boolean` | `undefined`      | Limits the plugin to `serve` or `build`. See [conditional application](https://vite.dev/guide/api-plugin#conditional-application). |
| `enforce`       | `'pre' \| 'post'`                                | `'pre'`          | Plugin ordering. See [plugin ordering](https://vite.dev/guide/api-plugin#plugin-ordering).                                         |
| `babelConfig`   | `object`                                         | `{}`             | [Babel options](https://babeljs.io/docs/options).                                                                                  |
| `include`       | `string \| RegExp \| Array<string \| RegExp>`    | `/\.[cm]?jsx?$/` | Module ids to transform. Add the matching Babel presets for other file types.                                                      |
| `exclude`       | `string \| RegExp \| Array<string \| RegExp>`    | `undefined`      | Module ids to skip. Takes priority over `include`.                                                                                 |
| `optimizeOnSSR` | `boolean`                                        | `false`          | Also transform dependencies optimized for SSR.                                                                                     |

`include` and `exclude` are passed to Vite's native [hook filters](https://vite.dev/guide/api-plugin#hook-filters), so non-matching modules never reach the plugin.

## Migrating from `vite-plugin-babel`

- Requires Babel 8 and Vite 8; earlier versions are not supported.
- `filter` is removed. Use `include` / `exclude`.
- `loader` is removed. It only applied to esbuild-based dependency optimization (Vite 7 and earlier).
- The default `include` also matches `.mjs` / `.cjs` files.

## License

[MIT](LICENSE)
