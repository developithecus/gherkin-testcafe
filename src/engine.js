const fs = require('fs');
const path = require('path');
const parseGherkinDocument = require('./parse');
const runDocument = require('./runDocument');
const {streamToArray} = require('./util');
const {createRuleSet} = require('./ruleset');
const gherkin = require('gherkin').default;

const _rules = Symbol('rules');
const _stream = Symbol('stream');
const _documents = Symbol('documents');

const engine = (testDir) => ({
    [_stream]: null,
    [_rules]: [],
    [_documents]: [],

    use(...args) {
        if (args.length >= 2) {
            return this.defineRule(...args);
        } else {
            this[_rules] = this[_rules].concat(args[0].rules);
        }
    },

    defineRule(regex, executor, type = null) {
        executor = executor || function () {};
        type = type || null;

        this[_rules].push(createRuleSet(regex, executor, type));
        return this;
    },

    async run() {
        const promises = fs.readdirSync(testDir).map(f => path.join(testDir, f))
            .map(async file => {
                const parsedGherkin = await streamToArray(gherkin.fromPaths([file]));
                const {gherkinDocument} = parsedGherkin.find(d => d.gherkinDocument);

                const featureFile = {filename: file, collectedTests: []};

                const parsed = parseGherkinDocument(gherkinDocument);

                return runDocument(parsed, this[_rules], featureFile);
            });

        return Promise.all(promises);
    },
});

module.exports = engine;