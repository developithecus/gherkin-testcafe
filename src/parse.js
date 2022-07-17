const parseExamples = examples => {
    const headers = examples.tableHeader.cells.map(c => c.value);
    const values = examples.tableBody.map(row => row.cells.map(cell => cell.value));

    const examplesObject = {};
    
    headers.forEach(key => examplesObject[key] = []);

    values.forEach(row => {
        row.forEach((value, idx) => examplesObject[headers[idx]].push(value));    
    });

    return examplesObject;
};

const parseStep = step => ({
    type: step.keyword.trim(),
    text: step.text.trim(),
});

const parseScenario = ({scenario}) => ({
    name: scenario.name,
    steps: scenario.steps.map(parseStep),
    variables: scenario.examples.map(parseExamples),
});

const parseGherkinDocument = doc => {
    return {
        name: doc.feature.name,
        scenarios: doc.feature.children.map(parseScenario),
    };
};

module.exports = parseGherkinDocument;