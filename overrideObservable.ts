import { noop, UnaryFunction, OperatorFunction, Observable, Subject, combineLatest, merge } from 'rxjs';
import { tap, map, share, delay } from 'rxjs/operators';
//import { pipeFromArray } from "rxjs/internal/util/pipe";

let spiedObservables:Subject<any>[] = [];
let operators:string[] = [];
let pipedData$:Observable<any>;

//this function overrides pipeFromArray, so any piped operation is tracked
function customPipeFromArray<T, R>(fns: Array<UnaryFunction<T, R>>): UnaryFunction<T, R> {
  if (!fns) {
    return noop as UnaryFunction<any, any>;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return function piped(input: T): R {
    console.log("----operators detected----");

    let reduce = fns.reduce((prev: any, fn: UnaryFunction<T, R>) => {
      let result: any =  fn(prev);
      let operator = result.operator.constructor.name;
      console.log(result.operator);

      //push result observable data into the subjects array, and use
      //subject as a proxy to spy each pipe operator
      let id = operators.push(operator);
      let subject = new Subject<any>();
      spiedObservables.push(subject);
      result.subscribe(data => subject.next({id, operator, data}))

      //reduced is expected to return the observable
      return result.pipe(delay(1000));
    }, input as any);

    console.log("----end operators----");


    //create observable with all the spy flows
    pipedData$ = merge(...spiedObservables);
    //and subscribe to show results on console
    pipedData$.subscribe(
      data => console.log("pipes flow: ", data)
    )    

    return reduce;
  };
}

let oldPipe = Observable.prototype.pipe;

Observable.prototype.pipe = function(...operations: OperatorFunction<any, any>[]): Observable<any> {
    if (operations.length === 0) {
      return this as any;
    }
    //return oldPipe.apply(this, operations);
    let retValue = customPipeFromArray(operations)(this);

    return retValue;
  }