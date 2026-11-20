const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../cs_doc.html'),'utf8');
const start=src.indexOf('        function createActionButton(action) {');
const end=src.indexOf('\n\n        function renderTemplates()',start);
assert.ok(start>0 && end>start);
const stub={createElement:()=>({
 className:'',textContent:'',title:'',draggable:false,dataset:{},
 classList:{added:[],add(x){if(/\s/.test(x))throw Error('InvalidCharacterError');this.added.push(x)}}
})};
const create=Function('document',src.slice(start,end)+'\nreturn createActionButton;')(stub);
test('malformed persisted class names cannot crash the quick actions editor',()=>{
 for(const name of ['flag-red flag-orange','', 'unknown', 'bad\nclass']){
  const el=create({text:'Note',tooltip:'Tip',color:name});
  assert.deepEqual(el.classList.added,[]);
  assert.equal(el.dataset.text,'Note');
 }
});
test('valid flag colors are still applied',()=>{
 for(const name of ['flag-red','flag-orange','flag-green'])
  assert.deepEqual(create({text:'Note',color:name}).classList.added,[name]);
});
