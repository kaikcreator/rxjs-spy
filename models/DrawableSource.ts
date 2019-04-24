import { Drawable } from './Drawable';

export class DrawableSource extends Drawable{
  public name:string;
  public description:string;

  constructor(x, y, name, description=null){
    super();
    this.x = x;
    this.y = y;
    this.name = name;  
    this.description = description;
  }

  drawInternals(context:CanvasRenderingContext2D){
    context.font = "11px verdana";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.lineWidth = 3;
    //const minWidth = context.measureText(this.name).width;
    let width = 50;
    let height = 50;
    let xOrigin = this.x - width / 2;
    let yOrigin = this.y - 26;
    context.strokeRect(xOrigin, yOrigin, width, height);
    context.fillRect(xOrigin, yOrigin, width, height);
    context.fillStyle = "black";
    context.fillText(this.name, this.x, this.y, width - 2);
    if(this.description){
      context.font = "8px verdana";
      context.fillText(this.description, this.x, this.y+12, width - 2);
    }

  }

}
