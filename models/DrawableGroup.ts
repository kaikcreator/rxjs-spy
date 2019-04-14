import { Drawable } from './Drawable';
import { DrawableSource } from './DrawableSource';
import { DrawableDataStream } from './DrawableDataStream';

export class DrawableGroup extends Drawable{
  public width:number;
  public height:number;
  public source:Drawable;
  private drawableDataStream:Drawable[] = [];

  constructor(x, y, width, height, name){
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.setSource(name);
  }

  private setSource(name){
    this.source = new DrawableSource(this.x, this.height/2, name);
  }

  public pushData(data){
    let item = new DrawableDataStream(this.x, this.height/2, data)
    this.drawableDataStream.push(item);
  }

  public drawInternals(context:any){
    //paint stream of data belonging to the group
    this.drawableDataStream
    .filter(item => item.x < this.x + this.width)
    .forEach(item => item.draw(context));    
    //paint source of the group
    this.source.draw(context);
  }

  public updatePosition(progress:number){
    this.drawableDataStream
    .filter(item => item.x < this.x + this.width)
    .forEach(item => {item.updatePosition(progress)});
  }  

}