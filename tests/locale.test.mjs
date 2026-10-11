import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const sandbox = { window: {} };
runInNewContext(readFileSync(new URL('../site/i18n.js', import.meta.url), 'utf8'), sandbox);
const dictionaries = sandbox.window.I18N;
const keys = Object.keys(dictionaries.en).sort();
for (const name of ['cs','en','ar','id']) {
  const other = Object.keys(dictionaries[name]).sort();
  assert.deepEqual(other, keys, `Incomplete ${name} interface translations`);
  for (const [key, value] of Object.entries(dictionaries[name])) {
    assert.equal(typeof value,'string',`${name}.${key}`);
    assert.ok(value.trim().length,`${name}.${key} must not be blank`);
  }
}
const indexHTML = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8');
const appJS = readFileSync(new URL('../site/app.js', import.meta.url), 'utf8');
assert.match(indexHTML, /<html lang="en" dir="ltr">/, 'English should be the initial document language');
assert.match(indexHTML, /<option value="en" selected>/, 'Language selector should initially show English');
assert.match(appJS, /languages\.includes\(storedLanguage\) \? storedLanguage : 'en'/, 'English should be the fallback while preserving prior user selection');
console.log(`OK: ${keys.length} interface strings present in all four languages; English default verified`);
