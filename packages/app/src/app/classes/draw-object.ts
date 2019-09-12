import {NodeBase} from './node-base';

export class DrawObject {
  public x = 0;
  public y = 0;

  public width = 150;
  public height = 70;

  public lineWidth = 2;

  public constructor(public ctx: CanvasRenderingContext2D, public node: NodeBase<any, any, any>) {

  }

  public draw() {
    let ctx = this.ctx;

    ctx.fillStyle = this.node.color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = this.lineWidth;

    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.font = '24px serif';
    ctx.fillStyle = 'black';
    ctx.fillText(this.node.inNodes.length.toString(), this.x + 10, this.y + 40);
    ctx.fillText(this.node.outNodes.length.toString(), this.x + this.width - 30, this.y + 40);
  }
}

