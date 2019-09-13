import {NodeBase} from './node-base';
import {GridInfo} from '../pages/main/main.component';
import * as _ from 'underscore';

export class Workspace {
  public width = 1200;
  public height = 600;

  public nodes: NodeBase[] = [];
  public times: any = [];
  public fps: any;
  public fpsDisplay: any;

  public hoveredNode: NodeBase;

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

  private drawGrid() {
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
  }

  public draw() {
    this.ctx.fillStyle = 'grey';
    this.ctx.strokeStyle = 'transparent';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawGrid();

    for (let node of this.nodes) {
      node.drawObject.draw();
    }

    this.calculateFPS();
    requestAnimationFrame(() => this.draw());
  }

  public constructor(public ctx: CanvasRenderingContext2D) {
    let {canvas} = this.ctx;

    canvas.width = this.width;
    canvas.height = this.height;
    canvas.addEventListener('mousemove', (e) => this.mousemove(e));
    canvas.addEventListener('mousedown', (e) => this.mousedown(e));
    canvas.addEventListener('mouseup', (e) => this.mouseup(e));
  }

  public mousemove(e: MouseEvent) {
    _.debounce(() => {
      let x = e.offsetX;
      let y = e.offsetY;

      this.hoveredNode = null;
      for (let i = this.nodes.length - 1; i >= 0; i--) {
        let node = this.nodes[i];
        let {dragInfo} = node;
        if (node.hasPointIn(x, y)) {
          this.hoveredNode = node;
        }

        if (dragInfo.dragging) {
          node.drawObject.x = dragInfo.dragStartX - dragInfo.dragStartMouseX + x;
          node.drawObject.y = dragInfo.dragStartY - dragInfo.dragStartMouseY + y;

          if (this.gridInfo.snap) {
            node.drawObject.x = node.drawObject.x - node.drawObject.x % this.gridInfo.x;
            node.drawObject.y = node.drawObject.y - node.drawObject.y % this.gridInfo.y;
          }
        }
      }
    }, 20)();
  }

  public mousedown(e: MouseEvent) {
    let x = e.offsetX;
    let y = e.offsetY;

    for (let node of this.nodes) {
      let {dragInfo} = node;
      if (e.button === 0) {
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
  }

  public mouseup(e: MouseEvent) {
    for (let node of this.nodes) {
      node.dragInfo.dragging = false;
    }
  }
}
