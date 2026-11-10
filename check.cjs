const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={};const get=id=>nodes[id]||(nodes[id]={value:'60',style:{},className:'',textContent:'',innerHTML:'',setAttribute(){},appendChild(){},addEventListener(){}});
const ctx={document:{getElementById:get,createElement:()=>({style:{}}),querySelectorAll:()=>[]},setInterval(){}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);
function run(s){return vm.runInContext(s,ctx);}
run('selectMode();tick(2.1)');assert.equal(run('state.status'),'blocked');
for(let i=0;i<6;i++){run(`reset();align();state.mode=${i-1};selectMode();tick(2.1)`);assert.equal(run('state.status'),'running');run('selectMode()');assert.equal(run('state.status'),'running');for(let n=0;n<700;n++)run('tick(.1)');assert.equal(run('state.status'),'complete');assert.equal(run('state.heater'),false);assert.equal(run('state.motor'),0);}
run('reset();align();preset();selectMode();tick(2.1)');assert.equal(run('state.status'),'scheduled');run('power();tick(10)');assert.equal(run('state.status'),'off');
run('reset();align();selectMode();tick(2.1);align()');assert.equal(run('state.status'),'interrupted');
console.log('PASS: all 6 programs complete; lid interlock, observed cancel behavior, preset, unplug and lid-loss transitions.');

