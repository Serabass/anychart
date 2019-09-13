import {Drawable} from './drawable';
import {Workspace} from './workspace';

export interface DragInfo {
  dragging?: boolean;
  dragStartX?: number;
  dragStartY?: number;
  dragStartMouseX?: number;
  dragStartMouseY?: number;
}

export abstract class NodeBase<TInput = any, TOutput = any, TParams = any> {
  public input: TInput;

  public inNodes: NodeBase<any, any, any>[] = [];
  public outNodes: NodeBase<any, any, any>[] = [];

  public disableIn = false;
  public disableOut = false;

  public params: { [key: string]: any } = {};

  public drawObject: Drawable;

  public dragInfo: DragInfo = {dragging: false};

  public color: string;

  public abstract process(): any;

  public constructor(public name: string,
                     public workspace: Workspace) {
    this.drawObject = new Drawable(this.workspace.ctx, this);
  }

  public async run() {
    let result = await Promise.resolve(this.process());

    for (let node of this.outNodes) {
      node.input = result;
      await node.run();
    }
  }

  public addOut(node: NodeBase) {
    this.outNodes.push(node);
    node.inNodes.push(this);
  }

  public hasPointIn(x: number, y: number) {
    if (x > this.drawObject.left && x < this.drawObject.right) {
      if (y > this.drawObject.top && y < this.drawObject.bottom) {
        return true;
      }
    }
    return false;
  }


  public get hasParams() {
    return this.paramsCount > 0;
  }

  public get paramsCount() {
    return Object.keys(this.params).length;
  }

  public get hovered() {
    return this.workspace.hoveredNode === this;
  }
}
