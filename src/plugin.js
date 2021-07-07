const {ReplaceSource} = require('webpack-sources');
const {regex} = require('./config.json');

module.exports = require('./setup')((compiler, compilation, generator, opts) => (chunks) => {
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
                const index = match.index + match[0].indexOf(match[1]);

                source = source || new ReplaceSource(asset);
                source.replace(index, index + match[1].length - 1, generator.make(match[1].replace(/\\/g, '')));
            }

            if (!source) {
                return;
            }

            compilation.assets[file] = source;
        });
    });
});
