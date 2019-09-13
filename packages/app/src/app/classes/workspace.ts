import {NodeBase} from './node-base';
import {GridInfo} from '../pages/main/main.component';

export class Workspace {
  public width = 1200;
  public height = 600;

  public nodes: NodeBase<any, any, any>[] = [];
  public times: any = [];
  private fps: any;
  public fpsDisplay: any;

  public gridInfo: GridInfo = {
    snap: true,
    x: 10,
    y: 10
  };

  private calculateFPS() {
    const now = performance.now();
    while (this.times.length > 0 && this.times[0] <= now - 1000) {
      this.times.shift();
    }
    this.times.push(now);
    this.fps = this.times.length;
  }

  public init() {
    this.draw();

    setInterval(() => this.fpsDisplay = this.fps, 1000);
  }

  public draw() {
    this.ctx.fillStyle = 'grey';
    this.ctx.strokeStyle = 'transparent';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.gridInfo.snap) {
      let xx = 0;
      let yy = 0;

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      while (xx < this.width) {
        this.ctx.beginPath();
        this.ctx.moveTo(xx, 0);
        this.ctx.lineTo(xx, this.height);
        this.ctx.stroke();
        this.ctx.closePath();
        xx += this.gridInfo.x;
      }

      while (yy < this.height) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, yy);
        this.ctx.lineTo(this.width, yy);
        this.ctx.stroke();
        this.ctx.closePath();
        yy += this.gridInfo.y;
      }
    }

    for (let node of this.nodes) {
      node.drawObject.draw();
    }

    this.calculateFPS();
    requestAnimationFrame(() => this.draw());
  }

  public constructor(public ctx: CanvasRenderingContext2D) {

  }

  public mousemove(e: MouseEvent) {
    let x = e.offsetX;
    let y = e.offsetY;
    for (let node of this.nodes) {
      let {dragInfo} = node;
      node.hovered = node.hasPointIn(x, y);

      if (dragInfo.dragging) {
        node.drawObject.x = dragInfo.dragStartX - dragInfo.dragStartMouseX + x;
        node.drawObject.y = dragInfo.dragStartY - dragInfo.dragStartMouseY + y;

        if (this.gridInfo.snap) {
          node.drawObject.x = node.drawObject.x - node.drawObject.x % this.gridInfo.x;
          node.drawObject.y = node.drawObject.y - node.drawObject.y % this.gridInfo.y;
        }
      }
    }
  }

  public mousedown(e: MouseEvent) {
    let x = e.offsetX;
    let y = e.offsetY;

    for (let node of this.nodes) {
      let {dragInfo} = node;
      if (node.hasPointIn(x, y)) {
        dragInfo.dragging = true;
        dragInfo.dragStartX = node.drawObject.x;
        dragInfo.dragStartY = node.drawObject.y;
        dragInfo.dragStartMouseX = x;
        dragInfo.dragStartMouseY = y;
      } else {
        dragInfo.dragging = false;
      }
    }
  }

  public mouseup(e: MouseEvent) {
    for (let node of this.nodes) {
      node.dragInfo.dragging = false;
    }
  }
}
