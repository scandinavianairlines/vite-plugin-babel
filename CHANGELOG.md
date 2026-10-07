# 1.0.0 (2026-10-07)


### Bug Fixes

* add clean command to prepare hook 9720d9a
* add package.json to exports field 3fa1da9
* add v 7 to accepted peer deps 568a8b7
* **build:** add seperate `esm` and `cjs` bundles to support `type: module` packages and projects bbf7273, closes #5
* correct the spelling  in documentation file readme，  the attribute of babelConfig "plugin" should be "plugins" fc8524a
* regenerate yarn.lock e44c095
* restore bahaviour pre 1.7.0, with deprecation warning 5fe423c
* return babel options from getBabelOptions 8bceb82
* use loadPartialConfig instead of loadOptions as it allows for config reusability 0a0c8bf
* warn when `filter` is used without `include` b447111


### Features

* **#1:** added esbuild loader option 342efcf, closes #1
* add `vite@3.0.0` as possible peer dependency and bump devDependency 3a218c0
* add enforce and apply config options 2ebe028
* add include/exclude options 4b4ea71
* add SSR dependency optimization and cache babel config options for faster transforms d5e3894
* add support for Vite 8 and rolldown with backwards support 421692d
* allow defining esbuild loader to use a3d47c7
* allow filter to have JavaScript specific regex features in development 72cc089
* convert it to an universal Babel plugin 4c9f175
* extend filter with a function option and allow for Vite 6 efd64b4
* init project 9e11571
* migrate build to rollup b666e7e
* partial support for Vite 8 6226a1d
* rewrite plugin in JavaScript for Babel 8 and Vite 8 bc4469b
* seperate import/require types in package json and sort out rollup build 0cd38fb
* update peer dependencies to allow Vite 4 4158d75


### BREAKING CHANGES

* requires Babel 8, Vite 8+ and Node.js 24+.
The `filter` and `loader` options are removed; use `include` / `exclude`.
