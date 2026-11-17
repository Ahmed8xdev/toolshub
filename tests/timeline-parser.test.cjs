const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {parseMainTimeline,parseAdditionalTimeline}=require('../timeline-parser.js');
test('main timeline preserves actual input events and order',()=>{
 const data=parseMainTimeline('1:59 AM **Scheduled**\n4:07 AM **Queued**\n4:08 AM **Accepted**');
 assert.deepEqual(data.parsedData,[{time:'1:59 AM',event:'Scheduled'},{time:'4:07 AM',event:'Queued'},{time:'4:08 AM',event:'Accepted'}]);
});
test('additional timeline handles event names containing punctuation',()=>{
 const r=parseAdditionalTimeline('Ordered at 1:50 AM\nPickup - Committed 2:15 AM');
 assert.deepEqual(r,[{event:'Ordered at',time:'1:50 AM'},{event:'Pickup - Committed',time:'2:15 AM'}]);
});
test('invalid timeline rows are rejected instead of being replaced with demo values',()=>{
 assert.throws(()=>parseMainTimeline('25:99 PM **Scheduled**'),/Invalid/);
 assert.throws(()=>parseAdditionalTimeline('Confirmed sometime'),/Invalid/);
 assert.deepEqual(parseMainTimeline(''),{parsedData:[]});
});
test('UI connects the real parser and never invents cancellation reasons',()=>{
 const source=fs.readFileSync(path.resolve(__dirname,'../late_owner.html'),'utf8');
 assert.ok(source.includes('parseMainTimeline(text)'));
 assert.ok(source.includes('parseAdditionalTimeline(text)'));
 assert.ok(source.includes('timeline-parser.js'));
 assert.ok(!source.includes('Math.random() * reasons.length'));
});
