export abstract class NodeBase<TInput, TOutput, TParams = any> {
  public input: TInput;

  public inNodes: NodeBase<any, any, any>[] = [];
  public outNodes: NodeBase<any, any, any>[] = [];

  public params: {[key: string]: any} = {};

  public abstract process(): any;

  public constructor(public name: string) {
  }

  public async run() {
    let result = await Promise.resolve(this.process());

    for (let node of this.outNodes) {
      node.input = result;
      await node.run();
    }
  }
}
