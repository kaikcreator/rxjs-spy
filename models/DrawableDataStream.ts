import { Drawable } from './Drawable';

export class DrawableDataStream extends Drawable{
  public content:string;

  constructor(x, y, content){
    super();
    this.x = x;
    this.y = y;
    this.content = content;  
  }

  updatePosition(incX:number){
    this.x += incX;
  }

  drawInternals(context:CanvasRenderingContext2D){
    context.font = "12px verdana";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.beginPath();
    context.arc(this.x, this.y-4, 20, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
    context.fillStyle = "black";
    context.fillText(this.content, this.x, this.y);
  }
}