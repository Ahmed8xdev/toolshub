const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

for (const page of ['index.html', 'late_owner.html', 'cs_doc.html']) {
  const source = fs.readFileSync(path.join(__dirname, '..', page), 'utf8');
  const start = source.indexOf('        const readThemePreference = () => {');
  const end = source.indexOf('        };', source.indexOf('        const writeThemePreference = (theme) => {', start)) + '        };'.length;
  test(page + ' gracefully handles denied and full browser storage', () => {
    assert.ok(start > -1 && end > start);
    const create = window => Function('window', source.slice(start, end) +
      '\\nreturn { readThemePreference, writeThemePreference };')(window);
    const blocked = {};
    Object.defineProperty(blocked, 'localStorage', { get() { throw Error('SecurityError'); } });
    const a = create(blocked);
    assert.equal(a.readThemePreference(), null);
    assert.doesNotThrow(() => a.writeThemePreference('dark'));
    let saved;
    const b = create({ localStorage: { getItem: () => 'dark', setItem: (k, v) => { saved = [k, v]; } } });
    assert.equal(b.readThemePreference(), 'dark');
    b.writeThemePreference('light');
    assert.deepEqual(saved, ['theme', 'light']);
    const c = create({ localStorage: { getItem: () => null, setItem: () => { throw Error('QuotaExceededError'); } } });
    assert.doesNotThrow(() => c.writeThemePreference('dark'));
    assert.equal(c.readThemePreference(), null);
    assert.match(source, /writeThemePreference\\(newTheme\\)/);
    assert.doesNotMatch(source, /(?<!\\.)localStorage\\.getItem\\('theme'\\)/);
  });
}
