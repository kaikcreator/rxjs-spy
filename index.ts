import './overrideObservable';
 
import { interval } from 'rxjs'; 
import { map, delay, take, scan, bufferCount } from 'rxjs/operators';

const source = interval(500).pipe(
  take(6),
  map(x => 2*x),
  bufferCount(2),
  delay(200),
  scan((state, current) => [state[0]+current[0], state[1]+current[1]], [0,0]),
);



source.subscribe(x => {
  console.log(x); 
});