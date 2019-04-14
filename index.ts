import './overrideObservable';
 
import { interval, fromEvent } from 'rxjs'; 
import { map, delay, mapTo, scan, bufferCount } from 'rxjs/operators';

const btn = document.getElementById('button');


fromEvent(btn, 'click').pipe(
  mapTo(1),
  scan((state, current) => state + current),
  map(x => 2*x),
  bufferCount(2),
//  delay(200),
)
.subscribe(x => {
  console.log(x); 
});