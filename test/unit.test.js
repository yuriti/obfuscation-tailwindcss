const fs = require('fs');
const path = require('path');
const {regex} = require('../src/config.json');
const Generator = require('../src/class.generator');

test('checking an exception for a generator (options.startsWithout)', () => {
    const exception = ['a', 'b'];
    const items = ['this', 'is', 'a', 'test'];
    const output = [];

    const generator = new Generator({startsWithout: exception});

    for (let i = 0; i < items.length; i++) {
        output.push(generator.make(items[i]));
    }

    expect(exception).not.toContain(output);
});

test('checking for finding style with keyframes', () => {
    const replaceRegex = new RegExp(`\\\.(${regex})`, 'g');
    //
    const source = fs.readFileSync(path.resolve(process.cwd(), 'test/assets/case1.css')).toString();
    while (match = replaceRegex.exec(source)) {
        expect(match[0]).toContain('.tw-spin');
    }
});

test('javascript check if class name is in html tag', () => {
    const replaceRegex = new RegExp(`["'.\\\s](${regex})`, 'g');
    //
    const source = fs.readFileSync(path.resolve(process.cwd(), 'test/assets/case1.js')).toString();
    while (match = replaceRegex.exec(source)) {
        expect(match[0]).toContain('"tw-spin');
    }
});