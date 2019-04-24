import { interval, fromEvent } from 'rxjs'; 
import { map, delay, mapTo, scan, bufferCount } from 'rxjs/operators';

//import rxjsSpyConfig
import { rxjsSpyConfig } from './overrideObservable';

//optionally, annotate description of operators
rxjsSpyConfig.operatorDescriptions.push("() => 1");
rxjsSpyConfig.operatorDescriptions.push("(s,c) => s+c");
rxjsSpyConfig.operatorDescriptions.push("x => x*2");
rxjsSpyConfig.operatorDescriptions.push("i == 2");

//and that's all, create your observable pipe!
const btn = document.getElementById('button');
fromEvent(btn, 'click').pipe(
  mapTo(1),
  scan((state, current) => state + current),
  map(x => 2*x),
  bufferCount(2),
)
.subscribe();