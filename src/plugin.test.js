import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, test } from 'node:test';

import { build } from 'vite';

import { babel, DEFAULT_INCLUDE } from './plugin.js';

/** Babel plugin that renames every `before` identifier to `after`. */
const renameBefore = () => ({
  visitor: {
    /** @param {{ node: { name: string } }} nodePath */
    Identifier(nodePath) {
      if (nodePath.node.name === 'before') nodePath.node.name = 'after';
    },
  },
});

/**
 * Builds `entry` inside `root` with the given plugin options and returns the output code.
 * @param {string} root Project root.
 * @param {import('./plugin.js').BabelPluginOptions} options Plugin options.
 * @returns {Promise<string>} Generated code.
 */
async function bundle(root, options) {
  const output = await build({
    root,
    logLevel: 'silent',
    configFile: false,
    plugins: [babel(options)],
    build: {
      write: false,
      minify: false,
      lib: { entry: path.join(root, 'entry.js'), formats: ['es'], fileName: 'out' },
    },
  });
  const [result] = /** @type {import('vite').Rolldown.RolldownOutput[]} */ ([output].flat());

  return result?.output[0].code ?? '';
}

describe('babel', () => {
  /** @type {string} */
  let root;

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'vite-plugin-babel-'));
    await writeFile(path.join(root, 'entry.js'), 'export const before = 1;\n');
  });

  afterEach(() => rm(root, { recursive: true, force: true }));

  test('transforms included modules with the provided Babel config', async () => {
    const code = await bundle(root, { babelConfig: { plugins: [renameBefore] } });

    assert.match(code, /after = 1/);
  });

  test('skips excluded modules', async () => {
    const code = await bundle(root, { babelConfig: { plugins: [renameBefore] }, exclude: /entry\.js$/ });

    assert.match(code, /before = 1/);
  });

  test('honors the plugin options for ordering, scope and dependency optimization', () => {
    const plugin = babel({ apply: 'build', optimizeOnSSR: true });
    const config = /** @type {() => import('vite').UserConfig} */ (plugin.config)();

    assert.equal(plugin.enforce, 'pre');
    assert.equal(plugin.apply, 'build');
    assert.deepEqual(/** @type {{ filter: unknown }} */ (plugin.transform).filter, {
      id: { include: DEFAULT_INCLUDE, exclude: undefined },
    });
    assert.equal(config.optimizeDeps?.rolldownOptions?.plugins?.length, 1);
    assert.equal(config.ssr?.optimizeDeps?.rolldownOptions?.plugins?.length, 1);
  });
});
