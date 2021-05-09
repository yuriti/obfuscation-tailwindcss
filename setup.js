module.exports = callback => {
  const handler = (compiler, compilation, opts) => {
    const make = callback(compiler, compilation, opts);
    return (chunks, callback) => {
      make(chunks);
      callback();
    };
  }

  class ObfuscationTailwind {
    constructor(opts = {}) {
      this.opts = opts;
    }

    apply(compiler) {
      if (compiler.hooks) {
        // setup hooks for webpack >= 4
        compiler.hooks.compilation.tap('ObfuscationTailwindHooks', compilation => {
          compilation.hooks.optimizeChunkAssets.tapAsync('ObfuscationTailwindOptimizeChunkAssetsHooks', handler(compiler, compilation, this.opts));
        });
      } else {
        // setup hooks for webpack <= 3
        compiler.plugin('compilation', (compilation) => {
          compilation.plugin('optimize-chunk-assets', handler(compiler, compilation, this.opts));
        });
      }
    }
  }

  return ObfuscationTailwind;
};
