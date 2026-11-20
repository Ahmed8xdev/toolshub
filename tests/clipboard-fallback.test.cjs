const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../cs_doc.html'),'utf8');
const start=source.indexOf('        function copyToClipboard() {');
const end=source.indexOf('        function saveAsTemplate()',start);
assert.ok(start>=0&&end>start);
const getFunction=Function('documentationInput','navigator','showAlert','addToHistory',source.slice(start,end)+'\nreturn copyToClipboard;');

test('denied clipboard API leaves the full comment selected for manual copy',()=>{
 const feedback=[],history=[],input={value:'line 1\nline 2',focusCalled:false,selectCalled:false,focus(){this.focusCalled=true},select(){this.selectCalled=true}};
 const copy=getFunction(input,{},x=>feedback.push(x),x=>history.push(x));
 // A function callback stands in for the UI alert.
 assert.doesNotThrow(copy);
 assert.equal(input.selectCalled,true);
 assert.equal(input.focusCalled,true);
 assert.deepEqual(history,[]);
});
test('missing text never tries clipboard access',()=>{
 const alerts=[],input={value:'',focus(){throw Error('Should not select')},select(){throw Error('Should not select')}};
 const copy=getFunction(input,{},x=>alerts.push(x),()=>{throw Error('Should not save')});
 copy();
 assert.match(alerts[0],/Nothing to copy/);
});
test('clipboard path guards optional access',()=>{
 assert.ok(source.includes('if (!navigator.clipboard?.writeText)'));
 assert.ok(source.includes('documentationInput.select()'));
});
