const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../delay_calc.html'), 'utf8');
const start = source.indexOf('        const readThemePreference = () => {');
const end = source.indexOf("        themeToggleBtn.addEventListener('click'", start);
assert.ok(start > 0 && end > start, 'theme storage helpers must be present');
const createHelpers = (window) =>
  Function('window', source.slice(start, end) + '\nreturn { readThemePreference, writeThemePreference };')(window);

test('theme preferences are saved and restored when storage works', () => {
  const stored = new Map();
  const helpers = createHelpers({
    localStorage: {
      getItem: key => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value)
    }
  });
  assert.equal(helpers.readThemePreference(), null);
  helpers.writeThemePreference('dark');
  assert.equal(helpers.readThemePreference(), 'dark');
});

test('storage access denied or quota errors never prevent calculator initialization', () => {
  const blocked = {};
  Object.defineProperty(blocked, 'localStorage', { get() { throw Error('SecurityError'); } });
  const inaccessible = createHelpers(blocked);
  assert.equal(inaccessible.readThemePreference(), null);
  assert.doesNotThrow(() => inaccessible.writeThemePreference('dark'));
  const full = createHelpers({ localStorage: { getItem: () => 'light', setItem: () => { throw Error('QuotaExceededError'); } } });
  assert.equal(full.readThemePreference(), 'light');
  assert.doesNotThrow(() => full.writeThemePreference('dark'));
});

test('the theme toggle uses guarded storage helpers rather than direct calls', () => {
  assert.match(source, /writeThemePreference\(newTheme\)/);
  assert.match(source, /const savedTheme = readThemePreference\(\)/);
});
