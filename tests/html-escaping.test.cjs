const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {escapeHtml}=require('../escape-html.js');
const page=fs.readFileSync(path.join(__dirname,'../cs_doc.html'),'utf8');

test('encodes executable HTML in documentation and template fields',()=>{
  const attacker='<img src=x onerror="alert(1)"> & \'<script>';
  const encoded=escapeHtml(attacker);
  assert.equal(encoded,'&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;&lt;script&gt;');
  assert.ok(!encoded.includes('<img')&&!encoded.includes('<script>'));
});
test('encodes quote characters used in HTML attributes',()=>{
  assert.equal(escapeHtml('" autofocus onfocus="evil()'), '&quot; autofocus onfocus=&quot;evil()');
  assert.equal(escapeHtml(null),'');
});
test('all dynamic HTML injection points now encode user data',()=>{
  for(const expected of [
   'escapeHtml(section.name)', 'escapeHtml(template.name)',
   'escapeHtml(template.content)','escapeHtml(item)', 'escapeHtml(item.term)',
   "escapeHtml(item.hint || '')", 'let previewText = escapeHtml(text);'
  ]) assert.ok(page.includes(expected), 'Missing encoding: '+expected);
  assert.ok(page.includes('<script src="./escape-html.js"></script>'));
});
