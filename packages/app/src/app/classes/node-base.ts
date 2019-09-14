import {Drawable} from './drawable';
import {Workspace} from './workspace';
import {Point} from './point';
import Konva from 'konva';

export interface DragInfo {
  dragging?: boolean;

  start: Point;
  startMouse: Point;
}

export abstract class NodeBase<TInput = any, TOutput = any, TParams = any> {

  public constructor(public name: string,
                     public workspace: Workspace) {
    this.drawObject = new Drawable(this);
    this.workspace.nodes.push(this);
  }

  public get shape() {
    if (this._shape) {
      return this._shape;
    }

    this._shape = new Konva.Rect({
      x: this.drawObject.x,
      y: this.drawObject.y,
      draggable: true,
      width: 120,
      height: 60,
      fill: this.color,
      startScale: 1,
      shadowColor: 'black',
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,

      node: this
    });

    return this._shape;
  }

  public get hasParams() {
    return this.paramsCount > 0;
  }

  public get paramsCount() {
    return Object.keys(this.params).length;
  }

  public lines: Konva.Line[] = [];

  public input: TInput;

  public inNodes: NodeBase[] = [];
  public outNodes: NodeBase[] = [];

  public disableIn = false;
  public disableOut = false;

  public params: { [key: string]: any } = {};

  public drawObject: Drawable;

  public color: string;

  public processing = false;

  private _shape: Konva.Shape;

  public init() {
    if (this.outNodes.length > 0) {
      for (let node of this.outNodes) {
        let line = new Konva.Arrow({
          stroke: 'black',
          fill: 'black',
          points: [],
        });

        let updateLine = () => {
          let numbers = [
            this.shape.x(),
            this.shape.y(),
            node.shape.x(),
            node.shape.y()
          ];
          line.points(numbers);
          this.workspace.layer.batchDraw();
        };

        this.shape.on('dragmove', updateLine);
        node.shape.on('dragmove', updateLine);
        updateLine();
        this.workspace.layer.add(line);
        this.lines.push(line);
      }
    }
  }

  public abstract process(): any;

  public async run() {
    this.processing = true;
    let result = await Promise.resolve(this.process());
    this.processing = false;

    for (let node of this.outNodes) {
      node.input = result;
      await node.run();
    }
  }

  public addOut(node: NodeBase) {
    this.outNodes.push(node);
    node.inNodes.push(this);
  }

  /**
   * @deprecated
   * TODO Rename to containsPoint
   *
   * @param x x
   * @param y y
   */
  public hasPointIn(x: number, y: number) {
    if (x > this.drawObject.left && x < this.drawObject.right) {
      if (y > this.drawObject.top && y < this.drawObject.bottom) {
        return true;
      }
    }
    return false;
  }
}
