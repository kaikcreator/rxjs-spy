import { interval, animationFrameScheduler } from 'rxjs';
import { DrawableGroup } from './models/DrawableGroup';

export interface DataStream{
  id:number;
  operator:string;
  data:any
}

export class RxjsDisplay{
  public canvas:HTMLCanvasElement;
  private context:CanvasRenderingContext2D;
  public drawableGroups:DrawableGroup[] = [];

  private distanceBetweenSources = 200;
  private speed = 100; //px per second
  private frameRate = 60; //frames per second
  private yPosition = 0;
  private xOrigin = 36;

  constructor(canvasElementId:string='rxjs-display', yPosition?){
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);
    if(!yPosition){
      this.yPosition = this.canvas.height / 2;
    }
    this.context = this.canvas.getContext('2d');
    //update board using defined frameRate
    interval(1000/this.frameRate, animationFrameScheduler).subscribe(()=>{
      this.update();
    })
  }

  //internal method to clear canvas
  private clearCanvas = () =>{
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }  

  //unused method to draw a line
  private drawLine = (initCoords, endCoords) => {
    this.context.beginPath();
    this.context.moveTo(initCoords.x, initCoords.y);
    this.context.lineTo(endCoords.x, endCoords.y);
    this.context.strokeStyle = "#1976D2";
    this.context.lineWidth = 12;
    this.context.stroke();
  }

  //internal method to paint board background
  private drawBackground = () =>{
      this.context.beginPath();
      this.context.rect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = "#2196F3";
      this.context.fill();
  }

  //internal method to update coordinates samples
  private updatePosition(){
      this.drawableGroups.forEach(item => item.updatePosition(this.speed/this.frameRate));
  }

  //internal method to update screen
  private update(){
    this.updatePosition();
    this.clearCanvas();
    this.drawBackground();
    this.drawableGroups.forEach(item => item.draw(this.context));
  }

  public getDelayBetweenSamples(){
    return this.distanceBetweenSources / this.speed * 1000;
  }

  //Method to add data streamed through the flow
  public pushStreamedData(dataStream:DataStream){
    this.drawableGroups[dataStream.id].pushData(dataStream.data);
  }

  //Method to add an operator
  public pushOperator(name:string){
    let xPosition = this.drawableGroups.length * this.distanceBetweenSources + this.xOrigin;
    let group = new DrawableGroup(xPosition, 0, this.distanceBetweenSources, this.canvas.height, name);
    this.drawableGroups.push(group);
  }  

}