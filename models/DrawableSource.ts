import { Drawable } from './Drawable';

export class DrawableSource extends Drawable{
  public name:string;

  constructor(x, y, name){
    super();
    this.x = x;
    this.y = y;
    this.name = name;  
  }

  drawInternals(context:CanvasRenderingContext2D){
    context.font = "11px verdana";
    context.textAlign = "center";
    context.fillStyle = "white";
    //const minWidth = context.measureText(this.name).width;
    let width = 50;
    let height = 50;
    let xOrigin = this.x - width / 2;
    let yOrigin = this.y - 30;
    context.strokeRect(xOrigin, yOrigin, width, height);
    context.fillRect(xOrigin, yOrigin, width, height);
    context.fillStyle = "black";
    context.fillText(this.name, this.x, this.y, width - 2);
  }

}
