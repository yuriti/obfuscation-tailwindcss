const Generator = require('./class.generator');

module.exports = callback => {
    const handler = (compiler, compilation, generator, opts) => {
        const make = callback(compiler, compilation, generator, opts);
        return (chunks, callback) => {
            make(chunks);
            callback();
        };
    }

    class ObfuscationTailwind {
        constructor(opts = {}) {
            this.opts = Object.assign({}, {
                startsWithout: []
            }, opts);

            this.generator = new Generator(this.opts);
        }

        apply(compiler) {
            if (compiler.hooks) {
                // setup hooks for webpack >= 4
                compiler.hooks.compilation.tap('ObfuscationTailwindHooks', compilation => {
                    compilation.hooks.optimizeChunkAssets.tapAsync('ObfuscationTailwindOptimizeChunkAssetsHooks', handler(compiler, compilation, this.generator, this.opts));
                });
            } else {
                // setup hooks for webpack <= 3
                compiler.plugin('compilation', (compilation) => {
                    compilation.plugin('optimize-chunk-assets', handler(compiler, compilation, this.generator, this.opts));
                });
            }
        }
    }

    return ObfuscationTailwind;
};
