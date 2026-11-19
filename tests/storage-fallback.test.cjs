const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'cs_doc.html'), 'utf8');
const start = html.indexOf('        function readSavedState(key) {');
const end = html.indexOf('        // --- Rendering Functions ---', start);
assert.ok(start >= 0 && end > start, 'storage helpers must be present');
const source = html.slice(start, end);

function helpers(storage) {
    const warnings = [];
    const context = { localStorage: storage, console: { warn: (...args) => warnings.push(args) } };
    vm.createContext(context);
    vm.runInContext(source, context);
    return { context, warnings };
}

test('blocked localStorage reads fall back without throwing', () => {
    const { context, warnings } = helpers({
        getItem() { throw new Error('SecurityError'); },
        setItem() {},
    });
    assert.equal(context.readSavedState('savedTemplates'), null);
    assert.equal(warnings.length, 1);
});

test('blocked or full localStorage writes do not interrupt editing', () => {
    const { context, warnings } = helpers({
        getItem() { return null; },
        setItem() { throw new Error('QuotaExceededError'); },
    });
    assert.doesNotThrow(() => context.saveState('documentationHistory', ['draft']));
    assert.equal(warnings.length, 1);
});

test('available storage preserves JSON serialization', () => {
    const entries = new Map();
    const { context, warnings } = helpers({
        getItem(key) { return entries.get(key) ?? null; },
        setItem(key, value) { entries.set(key, value); },
    });
    context.saveState('savedTemplates', [{ name: 'Greeting', content: 'Hello' }]);
    assert.equal(context.readSavedState('savedTemplates'), '[{"name":"Greeting","content":"Hello"}]');
    assert.equal(warnings.length, 0);
});
