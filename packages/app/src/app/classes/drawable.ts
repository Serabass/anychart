import {NodeBase} from './node-base';

export class Drawable {
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
    if (!this.node.disableIn) {
      ctx.fillText(this.node.inNodes.length.toString(), this.x + 10, this.y + 40);

      this.node.inNodes.forEach((node, i) => {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        ctx.fillRect(this.x - 5, this.y + 20 * (i + 1), 10, 10);
        ctx.strokeRect(this.x - 5, this.y + 20 * (i + 1), 10, 10);
      });
    }

    if (!this.node.disableOut) {
      ctx.fillText(this.node.outNodes.length.toString(), this.x + this.width - 30, this.y + 40);

      this.node.outNodes.forEach((node, i) => {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        ctx.fillRect(this.x + this.width - 5, this.y + 20 * (i + 1), 10, 10);
        ctx.strokeRect(this.x + this.width - 5, this.y + 20 * (i + 1), 10, 10);
      });
    }

  }
}

