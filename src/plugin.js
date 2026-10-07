import { loadPartialConfigAsync, transformAsync } from '@babel/core';

/**
 * @import { InputOptions } from '@babel/core'
 * @import { Plugin, Rolldown, UserConfig } from 'vite'
 */

/** @typedef {string | RegExp | Array<string | RegExp>} Pattern */

/**
 * @typedef {object} BabelPluginOptions
 * @property {Plugin['apply']} [apply] Limits the plugin to `serve` or `build`.
 * @property {Plugin['enforce']} [enforce] Plugin ordering. Defaults to `pre`.
 * @property {InputOptions} [babelConfig] Babel options. Babel config files are also honored.
 * @property {Pattern} [include] Module ids to transform. Defaults to JS/JSX files.
 * @property {Pattern} [exclude] Module ids to skip. Takes priority over `include`.
 * @property {boolean} [optimizeOnSSR] Also transform dependencies optimized for SSR.
 */

export const DEFAULT_INCLUDE = /\.[cm]?jsx?$/;

/**
 * Runs Babel on matching modules during Vite `serve`, `build` and dependency optimization.
 * @param {BabelPluginOptions} [options] Plugin options.
 * @returns {Plugin} A Vite plugin.
 */
export function babel({
  apply,
  babelConfig = {},
  enforce = 'pre',
  exclude,
  include = DEFAULT_INCLUDE,
  optimizeOnSSR = false,
} = {}) {
  const filter = { id: { exclude, include } };
  /** @type {string | undefined} */
  let root;
  /** @type {Promise<InputOptions> | undefined} */
  let options;

  /**
   * Resolves the Babel config once per plugin instance.
   * @returns {Promise<InputOptions>} Babel options ready to be reused per file.
   */
  const getOptions = () => {
    options ??= loadPartialConfigAsync({
      ...babelConfig,
      root,
      cwd: root,
      babelrc: false,
      caller: { name: 'vite-plugin-babel', supportsStaticESM: true, ...babelConfig.caller },
    }).then(partial => partial?.options ?? {});

    return options;
  };

  /**
   * @param {string} code Module source.
   * @param {string} id Module id.
   * @returns {Promise<Rolldown.SourceDescription | null>} The transformed module, if Babel produced code.
   */
  const handler = async (code, id) => {
    const result = await transformAsync(code, { ...(await getOptions()), filename: id });

    return result?.code == null
      ? null
      : { code: result.code, map: /** @type {Rolldown.SourceMapInput} */ (result.map) };
  };

  /** @returns {UserConfig['optimizeDeps']} */
  const optimizeDeps = () => ({
    rolldownOptions: { plugins: [{ name: 'rolldown-plugin-babel', transform: { filter, handler } }] },
  });

  return {
    name: 'vite-plugin-babel',
    apply,
    enforce,
    config: () => ({
      optimizeDeps: optimizeDeps(),
      ssr: optimizeOnSSR ? { optimizeDeps: optimizeDeps() } : undefined,
    }),
    configResolved(config) {
      root = config.root;
    },
    transform: { filter, handler },
  };
}
