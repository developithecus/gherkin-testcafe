const RuleSet = () => ({
    rules: [],

    define(regex, executor) {
        this.rules.push(createRuleSet(regex, executor, null));
    },

    given(regex, executor) {
        this.rules.push(createRuleSet(regex, executor, 'given'));
    },

    then(regex, executor) {
        this.rules.push(createRuleSet(regex, executor, 'then'));
    },

    when(regex, executor) {
        this.rules.push(createRuleSet(regex, executor, 'when'));
    },
});

function createRuleSet(regex, executor, type) {
    executor = executor || function() {};
    type = type || null;

    return {
        type,
        regex,

        test(step) {
            return this.regex.test(step);
        },

        apply(step) {
            let result = null;

            const [input, ...variables] = step.match(this.regex);

            result = {
                step,
                variables,
                run: this.executor(...variables),
            };

            return result;
        },

        executor(...variables) {
            return function(t) {
                return executor(t, ...variables);
            };
        }
    };
}

module.exports = {
    RuleSet,
    createRuleSet,
};