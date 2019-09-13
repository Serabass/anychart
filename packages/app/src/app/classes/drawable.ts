import {NodeBase} from './node-base';

export class Drawable {
  public x = 0;
  public y = 0;

  public width = 150;
  public height = 70;

  public lineWidth = 2;

  public constructor(public ctx: CanvasRenderingContext2D,
                     public node: NodeBase<any, any, any>) {

  }

  public draw() {
    let ctx = this.ctx;

    ctx.fillStyle = this.node.color;
    if (!this.node.hovered) {
      ctx.strokeStyle = 'white';
    } else {
      ctx.strokeStyle = 'blue';
    }
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

        let x = this.x - 5;
        let y = this.y + 20 * (i + 1);

        ctx.fillRect(x, y, 10, 10);
        ctx.strokeRect(x, y, 10, 10);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 20 * (i + 1));
        ctx.lineTo(node.drawObject.right, node.drawObject.y + 20 * (i + 1));
        ctx.stroke();
        ctx.closePath();
      });
    }

    if (!this.node.disableOut) {
      ctx.fillText(this.node.outNodes.length.toString(), this.x + this.width - 30, this.y + 40);

      this.node.outNodes.forEach((node, i) => {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        let x = this.right - 5;
        let y = this.y + 20 * (i + 1);

        ctx.fillRect(x, y, 10, 10);
        ctx.strokeRect(x, y, 10, 10);
      });
    }
  }

  public get left() {
    return this.x;
  }

  public get top() {
    return this.y;
  }

  public get right() {
    return this.x + this.width;
  }

  public get bottom() {
    return this.y + this.height;
  }
}

