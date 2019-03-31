import { interval } from 'rxjs';

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
    context.font = "12px verdana";
    context.textAlign = "center";
    context.fillStyle = "black";
    const minWidth = context.measureText(this.name).width;
    let width = minWidth + 10;
    let height = width;
    context.strokeRect(this.x, this.y, width, height);
    context.fillText(this.name, this.x, this.y);
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
  public drawableItems:Drawable[] = [];

  private speed = 120; //px per second
  private frameRate = 60; //frames per second

  constructor(canvasElementId:string='rxjs-display'){
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);
    this.context = this.canvas.getContext('2d');
    interval(1000/this.frameRate).subscribe(()=>{
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
    if(this.drawableItems)
      this.drawableItems.forEach(item => item.updatePosition(this.speed/this.frameRate));
  }

  //draws empty board
  private update(){
    this.updatePosition();
    this.clearCanvas();
    this.drawBackground();
    if(this.drawableItems){
      this.drawableItems.forEach(item => item.draw(this.context));
    }
  }

  public pushValue(data:any){
      this.drawableItems.push(new drawableDataStream(50, 50, data));
  }

  public pushOperator(name:string){
    this.drawableItems.push(new drawableDataStream(10, 50, name));
  }  

}