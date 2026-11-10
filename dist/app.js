'use strict';
// Programs are explanatory approximations, never actual cooking recipes.
const programs = [
 {name:'Soy Milk',material:'soy',stages:[['Preheat',8,75,0],['Blend',6,80,2],['Cook',10,98,1]]},
 {name:'Rice Paste',material:'rice',stages:[['Heat',8,85,0],['Cook',9,98,1],['Blend smooth',7,95,2]]},
 {name:'Boil Water',material:'water',stages:[['Heat water',16,100,0]]},
 {name:'Juice',material:'juice',stages:[['Pulse',5,22,1],['Blend',9,22,2]]},
 {name:'Keep Warm',material:'water',stages:[['Reach target',8,60,0],['Maintain warmth',16,60,0]]},
 {name:'Cleaning',material:'water',stages:[['Agitate',6,22,2],['Rest',3,22,0],['Rinse motion',6,22,2]]}
];
// Placeholder durations in minutes, explicitly labeled in the interface.
// Replace these with observed starting durations when available.
const durationMinutes=[24,26,8,2,60,3];
programs.forEach((p,i)=>{p.minutes=durationMinutes[i];const total=p.stages.reduce((a,s)=>a+s[1],0);p.stages.forEach(s=>s[1]=s[1]/total*p.minutes*60);});
const formatTime=seconds=>{const value=Math.max(0,Math.ceil(seconds));return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;};
const $=id=>document.getElementById(id);
let state;
function initial(){return {power:true,lidAligned:false,mode:-1,status:'idle',temperature:22,stageIndex:0,elapsed:0,selectLeft:0,delayLeft:0,presetHours:0,heater:false,motor:0,ground:0,message:'Rotate the lid so its tip points toward the handle.'};}
function current(){return programs[state.mode];}
function reset(){state=initial();render();}
function busy(){return ['running','scheduled'].includes(state.status);}
function selectMode(){
 if(!state.power){state.message='Plug in the machine before choosing a mode.';return render();}
 if(busy()){state.message='Cancel did not stop this cycle in your reported experience. Use Unplug to interrupt the simulation.';return render();}
 state.mode=(state.mode+1)%programs.length;state.status='selecting';state.selectLeft=2;state.stageIndex=0;state.elapsed=0;state.ground=0;state.message='Mode selected. Tap Function again to cycle; wait 2 seconds to start.';makeParticles();render();
}
function begin(){
 if(!state.lidAligned){state.status='blocked';state.message='Start blocked: align the lid tip with the handle, then use Function to choose a mode again.';return;}
 if(state.presetHours){state.status='scheduled';state.delayLeft=state.presetHours*3600;state.message='Preset delay is counting down on the accelerated clock. Cooking begins when the delay ends.';}
 else startCycle();
}
function startCycle(){state.status='running';state.stageIndex=0;state.elapsed=0;state.message='The controller is running an illustrative heating and blending sequence.';}
function align(){
 state.lidAligned=!state.lidAligned;
 if(busy()&&!state.lidAligned){state.status='interrupted';state.heater=false;state.motor=0;state.message='Lid alignment lost. This model stops the cycle; real interlock behavior is unverified.';}
 else state.message=state.lidAligned?'Lid aligned. Use Function to choose a mode.':'Lid misaligned. The simulated interlock blocks starting.';
 render();
}
function power(){state.power=!state.power;state.heater=false;state.motor=0;state.selectLeft=0;state.delayLeft=0;state.status=state.power?'idle':'off';state.mode=-1;state.presetHours=0;state.message=state.power?'Power restored. Choose a mode to begin a new cycle.':'Power disconnected. Motor and heater are off; contents cool gradually.';render();}
function preset(){if(!state.power||busy()){state.message='Set Preset while plugged in, before a cycle starts.';return render();}const options=[0,1,2,4];state.presetHours=options[(options.indexOf(state.presetHours)+1)%options.length];if(state.status==='selecting')state.selectLeft=2;state.message=state.presetHours?`Preset: ${state.presetHours} hour delay (accelerated for this demo). Choose a mode.`:'Preset off. The selected mode will start after 2 seconds.';render();}
function tick(realSeconds){
 const dt=realSeconds*Number($('speed').value);
 state.heater=false;state.motor=0;
 if(state.status==='selecting'){state.selectLeft-=realSeconds;if(state.selectLeft<=0)begin();}
 else if(state.status==='scheduled'){state.delayLeft-=dt;if(state.delayLeft<=0)startCycle();}
 else if(state.status==='running'){
  const s=current().stages[state.stageIndex];state.elapsed+=dt;
  state.heater=s[2]>22&&state.temperature<s[2];
  if(state.heater)state.temperature=Math.min(s[2],state.temperature+85*dt/s[1]);else state.temperature=Math.max(22,state.temperature-.0075*dt);
  state.motor=s[3]===1?(Math.floor(state.elapsed/30)%3<2?1:0):s[3];
  if(state.motor&&current().material!=='water')state.ground=Math.min(1,state.ground+dt/s[1]*.65);
  if(state.elapsed>=s[1]){state.elapsed=0;state.stageIndex++;if(state.stageIndex>=current().stages.length){state.status='complete';state.heater=false;state.motor=0;state.message='Demo program complete. This is not a measurement of real food doneness.';}}
 }else state.temperature=Math.max(22,state.temperature-.01*dt);
 render();
}
function makeParticles(){const p=current();$('particles').innerHTML='';if(!p||p.material==='water')return;for(let i=0;i<22;i++){const el=document.createElement('i');el.className='particle';el.style.left=(12+(i*37)%76)+'%';el.style.top=(15+(i*23)%65)+'%';el.style.animationDelay=(-i*.13)+'s';$('particles').appendChild(el);}}
function render(){
 const p=current(),running=state.status==='running';
 $('machine').className='machine'+(state.lidAligned?' aligned':'')+(state.heater?' heating':'')+(state.motor?' blending':'')+(!state.power?' unplugged':'');
 $('water').className='water '+(p?p.material:'');
 $('lidStatus').textContent=state.lidAligned?'Aligned · interlock satisfied':'Misaligned · start blocked';$('align').textContent=state.lidAligned?'Misalign lid ↻':'Align lid ↻';$('lid').setAttribute('aria-pressed',String(state.lidAligned));
 $('powerStatus').textContent=state.power?'Connected':'Disconnected';$('power').textContent=state.power?'Unplug':'Plug in';
 $('modeLabels').innerHTML=programs.map((x,i)=>`<span class="${i===state.mode?'active':''}">${x.name}</span>`).join('');
 const labels={idle:'Idle',selecting:'Selecting',blocked:'Lid check',scheduled:'Scheduled',running:'Running',complete:'Complete',off:'Unplugged',interrupted:'Interrupted'};$('status').textContent=labels[state.status];
 let title='Ready when you are.';if(p)title=p.name+' · '+(running?p.stages[state.stageIndex][0]:labels[state.status]);if(state.status==='off')title='Power disconnected.';
 $('stageTitle').textContent=title;$('message').textContent=state.message;$('temperature').textContent=Math.round(state.temperature)+'°';
 let left=0,total=p?p.stages.reduce((a,s)=>a+s[1],0):0,done=0;
 if(p){done=state.status==='complete'?total:p.stages.slice(0,state.stageIndex).reduce((a,s)=>a+s[1],0)+state.elapsed;left=Math.max(0,total-done);}
 $('remaining').textContent=state.status==='scheduled'?formatTime(state.delayLeft):p?formatTime(left):'—';
 $('timeLabel').textContent=state.status==='scheduled'?'DELAY LEFT · MIN:SEC':'PROGRAM LEFT · MIN:SEC';
 $('durationInfo').textContent=p?`${p.name}: ${p.minutes} min · illustrative, unverified. At ${$('speed').value}×, a full cycle takes ${formatTime(p.minutes*60/Number($('speed').value))} of viewing time.`:'Choose a mode to see its duration. Timings are illustrative until confirmed from your machine.';
 $('progress').style.width=(total?Math.min(100,done/total*100):0)+'%';
 $('stages').innerHTML=p?p.stages.map((s,i)=>`<span class="${running&&i===state.stageIndex?'active':''}">${i+1}. ${s[0]}</span>`).join(''):'';
 $('digits').textContent=!state.power?'':state.status==='blocked'?'E1':state.status==='complete'?'End':state.status==='scheduled'?state.presetHours+'h':p?String(Math.ceil(left/60)).padStart(2,'0'):'--';
 $('preset').textContent=state.presetHours?'Preset '+state.presetHours+'h':'Preset';
 $('sensorValue').textContent=state.power?Math.round(state.temperature)+'°C · simulated':'Off';$('heaterValue').textContent=state.heater?'Heating':'Off';$('motorValue').textContent=state.motor===2?'High':state.motor===1?'Pulsing':'Off';$('controllerValue').textContent=state.power?(running?'Executing program':labels[state.status]):'Off';
 for(const [id,on]of [['sensorDot',state.power],['heaterDot',state.heater],['motorDot',state.motor],['controllerDot',state.power]])$(id).className='component-dot'+(on?' active':'');
 document.querySelectorAll('.particle').forEach(el=>{el.style.scale=String(1-state.ground*.75);});
}
$('function').addEventListener('click',selectMode);$('preset').addEventListener('click',preset);$('lid').addEventListener('click',align);$('align').addEventListener('click',align);$('power').addEventListener('click',power);$('reset').addEventListener('click',()=>{reset();makeParticles();});
reset();setInterval(()=>tick(.1),100);
