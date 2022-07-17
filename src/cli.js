(async () => {
    const createTestCafe = require('testcafe');

    const testcafe = await createTestCafe();
    const runner = testcafe.createRunner();

    await runner
        .src('index.js')
        .browsers('edge')
        .run();
})();