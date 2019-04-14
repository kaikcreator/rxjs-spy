export abstract class Drawable{
  public x:number;
  public y:number;  

  protected abstract drawInternals(context:any);

  public draw(context:any){
    context.save();
    this.drawInternals(context);
    context.restore();
  };

  public updatePosition(incX:number){}
  
}