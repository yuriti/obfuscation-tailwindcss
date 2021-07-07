const incstr = require('incstr');

module.exports = class Generator {
    constructor(options = {}) {
        this.cache = {};
        this.options = options;
        this.nextId = incstr.idGenerator({alphabet: 'abcdefghijklmnopqrstuvwxyz'});
    }

    generate() {
        let value = null;

        do {
            value = this.nextId();
        } while (this.options.startsWithout && this.options.startsWithout.length ? (new RegExp('^(' + this.options.startsWithout.join('|') + ')', 'i')).test(value) : false);

        return value;
    }

    make(value) {
        return this.cache[value] = this.cache[value] || this.generate();
    }
}
