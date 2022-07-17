const tests = require('./src/engine');

tests('./features')
    .use(/I navigate to "(.+)"/, async (t, website) => {
        await t.navigateTo(website);
    })
    .run()
    .then(results => {
        console.log(results);
    });