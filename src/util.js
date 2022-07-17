const streamToArray = stream => new Promise((resolve, reject) => {
    const data = [];
    stream.on('data', data.push.bind(data));
    stream.on('error', reject);
    stream.on('end', () => resolve(data));
});

module.exports = {
    streamToArray,
};