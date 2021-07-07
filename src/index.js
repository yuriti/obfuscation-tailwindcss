const incstr = require('incstr');
const {ReplaceSource} = require('webpack-sources');
const regex = '(([a-zA-Z-:]*)[\\\\\\\\]*:)*([\\\\\\\\]*!)?tw-[a-zA-Z-]([a-zA-Z0-9-]*([\\\\\\\\]*(\\/|\\%|\\#|\\.|\\[|\\]))*)*';

const cache = {};
const generateClassName = incstr.idGenerator({alphabet: 'abcdefghijklmnopqrstuvwxyz'});

const _generateClassName = (startsWithout = []) => {
    let className = null;

    do {
        className = generateClassName();
    } while (startsWithout.length ? (new RegExp('^(' + startsWithout.join('|') + ')', 'i')).test(className) : false);

    return className;
}

module.exports = require('./setup')((compiler, compilation, opts) => (chunks) => {
    // Each chunks...
    chunks.forEach((chunk) => {

        // Each files...
        chunk.files.forEach((file) => {
            // Ext
            const ext = file.match(/.+\.(css|js|html).*$/);

            // Validation ext
            if (!ext) {
                return;
            }

            const replaceRegex = ext.includes('css') ? new RegExp(`\\\.(${regex})`, 'g') : new RegExp(`["'.\\\s](${regex})`, 'g');
            const asset = compilation.assets[file];

            let source = null;
            while (match = replaceRegex.exec(asset.source())) {
                const className = match[1].replace(/\\/g, '');
                const replacementClassName = cache[className] = cache[className] || _generateClassName(opts.startsWithout);
                const index = match.index + match[0].indexOf(match[1]);

                source = source || new ReplaceSource(asset);
                source.replace(index, index + match[1].length - 1, replacementClassName);
            }

            if (!source) {
                return;
            }

            compilation.assets[file] = source;
        });
    });
});
