const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const Plugin = require('../index');

const DIST = path.resolve(process.cwd(), 'dist');

const assetsPath = (filename) => path.resolve(process.cwd(), 'test/assets', filename);
const readFile = (filename) => fs.readFileSync(path.resolve(DIST, filename)).toString();

const build = (config) => {
    return new Promise(resolve => {
        const _config = Object.assign({
            mode: 'development'
        }, config);

        webpack(_config, (err, state) => {
            expect(err).toBeFalsy();
            resolve({state, config: _config});
        });
    });
};

describe('ObfuscationWebpack', () => {
    beforeEach(done => fs.rmdir(DIST, {recursive: true}, done));

    it('js file compilation check', done => {
        build({
            entry: [assetsPath('case1.js')],
            output: {
                path: DIST,
                filename: 'case1.js'
            },
            plugins: [new Plugin()]
        }).then(({state, config}) => {
            expect(readFile(config.output.filename)).toContain('<div class=\\\"a\\\">tw-spin</div>');
        }).then(done);
    });

    it('js and css file compilation check', done => {
        build({
            entry: [assetsPath('case2.js')],
            output: {
                path: DIST,
                filename: 'case2.js'
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader']
                    }
                ]
            },
            plugins: [new Plugin()]
        }).then(({state, config}) => {
            const content = readFile(config.output.filename);
            // CSS
            expect(content).toContain('.a {\\\\n    animation: a;\\\\n}\\\\n\\\\n@keyframes a {\\\\n\\\\n}');
            // JS
            expect(content).toContain('<div class=\\\"a\\\">tw-spin</div>');
        }).then(done);
    });
});
