const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.resolve(__dirname,'../delay_calc.html'),'utf8');
const start=src.indexOf('        function parseTime(input) {');
const end=src.indexOf('\n\n        function calculateDelay()',start);
assert.ok(start>0&&end>start);
const parseTime=Function(src.slice(start,end)+'\nreturn parseTime;')();
test('dot separated date format is parsed without locale-dependent string parsing',()=>{
 const d=parseTime('21.01.2025, 05:10 PM');
 assert.equal(d.getFullYear(),2025);assert.equal(d.getMonth(),0);assert.equal(d.getDate(),21);
 assert.equal(d.getHours(),17);assert.equal(d.getMinutes(),10);
});
test('midnight, noon, and invalid dates are handled correctly',()=>{
 assert.equal(parseTime('01.01.2025, 12:00 AM').getHours(),0);
 assert.equal(parseTime('01.01.2025, 12:00 PM').getHours(),12);
 assert.equal(parseTime('31.02.2025, 03:00 PM'),null);
 assert.equal(parseTime('01.13.2025, 01:00 PM'),null);
 assert.equal(parseTime('01.01.2025, 13:00 PM'),null);
 assert.equal(parseTime('01.01.2025, 01:61 PM'),null);
});
test('supported month-name dates remain accepted and extra text is not',()=>{
 assert.equal(parseTime('Apr 19, 2025 05:18 PM').getMonth(),3);
 assert.equal(parseTime('21.01.2025, 05:10 PM lorem'),null);
});
test('delivery estimates no longer accept partial numeric strings or blanks',()=>{
 assert.ok(src.includes('Number(orderDeliveryInput.value)'));
 assert.ok(src.includes('!orderDeliveryInput.value.trim()'));
 assert.ok(src.includes('deliveryMins < 0'));
});

test('named month inputs reject unknown months and invalid day overflow',()=>{
 assert.equal(parseTime('Fak 19, 2025 05:18 PM'),null);
 assert.equal(parseTime('Feb 31, 2025 05:18 PM'),null);
 assert.equal(parseTime('February 29, 2024 12:00 AM').getDate(),29);
 assert.equal(parseTime('February 29, 2025 12:00 AM'),null);
 assert.equal(parseTime('Apr 19, 2025 13:01 PM'),null);
 assert.equal(parseTime('Apr 19, 2025 10:60 PM'),null);
 assert.equal(parseTime('September 3, 2025 9:08 AM').getMonth(),8);
});
