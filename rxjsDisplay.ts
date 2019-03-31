import { interval, animationFrameScheduler } from 'rxjs';

abstract class Drawable{
  protected abstract drawInternals(context:any);

  public draw(context:any){
    context.save();
    this.drawInternals(context);
    context.restore();
  };

  public updatePosition(incX:number){}
  
}

class drawableOperator extends Drawable{
  public x:number;
  public y:number; 
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

class drawableDataStream extends Drawable{
  public x:number;
  public y:number; 
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

export class RxjsDisplay{
  public canvas:HTMLCanvasElement;
  private context:CanvasRenderingContext2D;
  public drawableOperators:Drawable[] = [];
  public drawableDataStream:Drawable[] = [];

  private speed = 120; //px per second
  private frameRate = 60; //frames per second
  private yPosition = 0;
  private xOrigin = 36;

  constructor(canvasElementId:string='rxjs-display', yPosition?){
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);
    if(!yPosition){
      this.yPosition = this.canvas.height / 2;
    }

    this.context = this.canvas.getContext('2d');
    interval(1000/this.frameRate, animationFrameScheduler).subscribe(()=>{
      this.update();
    })
  }

  private clearCanvas = () =>{
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }  

  private drawLine = (initCoords, endCoords) => {
    this.context.beginPath();
    this.context.moveTo(initCoords.x, initCoords.y);
    this.context.lineTo(endCoords.x, endCoords.y);
    this.context.strokeStyle = "#1976D2";
    this.context.lineWidth = 12;
    this.context.stroke();
  }

  //draws this.canvas background
  private drawBackground = () =>{
      //paint board background
      this.context.beginPath();
      this.context.rect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = "#2196F3";
      this.context.fill();
  }

  private updatePosition(){
      this.drawableDataStream.forEach(item => item.updatePosition(this.speed/this.frameRate));
  }

  //draws empty board
  private update(){
    this.updatePosition();
    this.clearCanvas();
    this.drawBackground();
    this.drawableDataStream.forEach(item => item.draw(this.context));
    this.drawableOperators.forEach(item => item.draw(this.context));
  }

  public pushValue(data:any){
      this.drawableDataStream.push(new drawableDataStream(this.xOrigin, this.yPosition, data));
  }

  public pushOperator(name:string){
    let xPosition = this.xOrigin + this.drawableOperators.length * 160;
    this.drawableOperators.push(new drawableOperator(xPosition, this.yPosition, name));
  }  

}