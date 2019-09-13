import {DragInfo, NodeBase} from './node-base';
import {GridInfo} from '../pages/main/main.component';
import * as _ from 'underscore';
import {Point} from './point';

export class Workspace {
  public width = 1200;
  public height = 600;

  public nodes: NodeBase[] = [];
  public times: any = [];
  public fps: any;
  public fpsDisplay: any;

  public offsetDragInfo: DragInfo = {dragging: false, start: {x: 0, y: 0}, startMouse: {x: 0, y: 0}};

  public hoveredNode: NodeBase;

  public scrollOffset: Point = {
    x: 0,
    y: 0,
  };

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
      let {ctx} = this;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      while (xx < this.width) {
        ctx.beginPath();
        ctx.moveTo(xx, 0);
        ctx.lineTo(xx, this.height);
        ctx.stroke();
        ctx.closePath();
        xx += this.gridInfo.x;
      }

      while (yy < this.height) {
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(this.width, yy);
        ctx.stroke();
        ctx.closePath();
        yy += this.gridInfo.y;
      }
    }
  }

  public draw(time: number) {
    let {ctx} = this;
    ctx.fillStyle = 'grey';
    ctx.strokeStyle = 'transparent';
    ctx.fillRect(0, 0, this.width, this.height);

    this.drawGrid();

    for (let node of this.nodes) {
      node.drawObject.draw(time);
    }

    this.calculateFPS();
    requestAnimationFrame((t: number) => this.draw(t));
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
      if (e.button === 0) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
          let node = this.nodes[i];
          let {dragInfo} = node;

          if (node.hasPointIn(x, y)) {
            this.hoveredNode = node;
          }

          if (dragInfo.dragging) {
            node.drawObject.x = dragInfo.start.x - dragInfo.startMouse.x + x;
            node.drawObject.y = dragInfo.start.y - dragInfo.startMouse.y + y;

            if (this.gridInfo.snap) {
              node.drawObject.x = node.drawObject.x - node.drawObject.x % this.gridInfo.x;
              node.drawObject.y = node.drawObject.y - node.drawObject.y % this.gridInfo.y;
            }
          }
        }
      }
    }, 20)();
    let xx = e.offsetX;
    let yy = e.offsetY;
    if (e.button === 1) {
      if (this.offsetDragInfo.dragging) {
        this.scrollOffset.x = this.offsetDragInfo.start.x - this.offsetDragInfo.startMouse.x + xx;
        this.scrollOffset.y = this.offsetDragInfo.start.y - this.offsetDragInfo.startMouse.x + yy;
      }
    }
  }

  public mousedown(e: MouseEvent) {
    let x = e.offsetX;
    let y = e.offsetY;

    if (e.button === 0) {
      for (let node of this.nodes) {
        let {dragInfo} = node;
        if (node.hasPointIn(x, y)) {
          dragInfo.dragging = true;
          dragInfo.start = {
            x: node.drawObject.x,
            y: node.drawObject.y,
          };
          dragInfo.startMouse = {x, y};
        } else {
          dragInfo.dragging = false;
        }
      }
    } else if (e.button === 1) {
      e.preventDefault();
      this.offsetDragInfo.dragging = true;
      this.offsetDragInfo.start = {
        x: this.scrollOffset.x,
        y: this.scrollOffset.y,
      };
      this.offsetDragInfo.startMouse = {x, y};
    }
  }

  public mouseup(e: MouseEvent) {
    if (e.button === 0) {
      for (let node of this.nodes) {
        node.dragInfo.dragging = false;
      }
    } else if (e.button === 1) {
      this.offsetDragInfo.dragging = false;
    }
  }
}
