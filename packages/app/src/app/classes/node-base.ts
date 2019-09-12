import {DrawObject} from './draw-object';

export abstract class NodeBase<TInput = any, TOutput = any, TParams = any> {
  public input: TInput;

  public inNodes: NodeBase<any, any, any>[] = [];
  public outNodes: NodeBase<any, any, any>[] = [];

  public params: {[key: string]: any} = {};

  public drawObject: DrawObject;

  public color: string;

  public abstract process(): any;

  public constructor(public name: string, public ctx: CanvasRenderingContext2D) {
    this.drawObject = new DrawObject(this.ctx, this);
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
}
