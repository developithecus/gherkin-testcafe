const Fixture = require('testcafe/lib/api/structure/fixture');
const Test = require('testcafe/lib/api/structure/test');

function generateStepExecutors(scenario, rules) {
    return scenario.steps.map(step => {
        const rule = rules.find(r => r.test(step.text));

        if (!rule) {
            throw new Error('Undefined step: ' + step.text);
        }

        return rule.apply(step.text);
    });
}

function runDocument(feature, rules, featureFile) {
    const fixture = new Fixture(featureFile);
    fixture(feature.name);

    const promises = feature.scenarios.map(scenario => {
        const executors = generateStepExecutors(scenario, rules);
        const test = new Test(featureFile);

        return new Promise(resolve => {
            test(scenario.name, async t => {
                resolve(Promise.all(executors.map(e => e.run(t))));
            });
        });
    });

    return Promise.all(promises);
}

module.exports = runDocument;