import {DragInfo, NodeBase} from './node-base';
import * as chroma from 'chroma-js';

export class Drawable {
  public x = 0;
  public y = 0;

  public width = 150;
  public height = 70;

  public lineWidth = 1;

  private hoverFillColor: string;

  public constructor(public ctx: CanvasRenderingContext2D,
                     public node: NodeBase) {

  }

  public draw(time: number) {
    let {ctx, node} = this;

    if (node.hovered) {
      ctx.fillStyle = chroma(node.color).brighten().hex();
    } else {
      ctx.fillStyle = node.color;
    }

    if (node.processing) {
      ctx.fillStyle = chroma(ctx.fillStyle).alpha(Math.sin(time / 30)).hex();
    }

    // ctx.strokeStyle = 'white';
    ctx.lineWidth = this.lineWidth;

    let offset = 0;

    if (node.dragInfo.dragging) {
      offset = 2.5;
    }

    ctx.fillRect(this.x - offset, this.y - offset, this.width + offset * 2, this.height + offset * 2);
    ctx.strokeRect(this.x - offset, this.y - offset, this.width + offset * 2, this.height + offset * 2);

    ctx.font = '24px serif';
    ctx.fillStyle = 'black';
    if (!node.disableIn) {
      ctx.fillText(node.inNodes.length.toString(), this.x + 10, this.y + 40);

      node.inNodes.forEach((inNode, i) => {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        let x = this.x - 5;
        let y = this.y + 20 * (i + 1);

        ctx.fillRect(x, y, 10, 10);
        ctx.strokeRect(x, y, 10, 10);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 20 * (i + 1));
        ctx.lineTo(inNode.drawObject.right, inNode.drawObject.y + 20 * (i + 1));
        // ctx.bezierCurveTo(1, 1, 1, 1, inNode.drawObject.right, inNode.drawObject.y + 20 * (i + 1));
        ctx.stroke();
        ctx.closePath();
      });
    }

    if (!node.disableOut) {
      ctx.fillText(node.outNodes.length.toString(), this.x + this.width - 30, this.y + 40);

      node.outNodes.forEach((outNode, i) => {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        let x = this.right - 5;
        let y = this.y + 20 * (i + 1);

        ctx.fillRect(x, y, 10, 10);
        ctx.strokeRect(x, y, 10, 10);
      });
    }

    if (node.hasParams) {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;

      ctx.fillRect(this.x + 10, this.bottom, this.width - 20, node.paramsCount * 20);
      ctx.strokeRect(this.x + 10, this.bottom, this.width - 20, node.paramsCount * 20);

      let i = 0;
      Object.entries(node.params).forEach(([key, value]) => {
        i++;
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(key, this.left + this.width / 2 - 5, this.bottom + i * 15);

        // ctx.font = '12px serif';
        // ctx.textAlign = 'left';
        // ctx.fillStyle = 'black';
        // ctx.fillText(JSON.stringify(value), this.left + this.width / 2 + 5, this.bottom + i * 15);
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

