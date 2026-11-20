const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../cs_doc.html'),'utf8');
test('history restores the actual saved comment instead of a title attribute',()=>{
 assert.ok(source.includes('data-history-index="${index}"'));
 assert.ok(source.includes('documentationInput.value = historyItems[index]'));
 assert.ok(source.includes("typeof historyItems[index] === 'string'"));
 assert.ok(!source.includes("documentationInput.value = e.target.closest('.history-item').title"));
});
test('filtered history retains original list indices',()=>{
 assert.match(source,/historyItems\s*\.map\(\(text, index\) => \(\{ text, index \}\)\)/);
 assert.match(source,/\.filter\(\(\{ text \}\) => text\.toLowerCase\(\)\.includes\(searchTerm\)\)/);
});
