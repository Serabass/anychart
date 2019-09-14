import {NodeBase} from './node-base';

export class TimeoutNode extends NodeBase <any, any, any> {

  public color = '#8888ff';

  public params: {
    interval: number,
  };

  process(): any {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.input), this.params.interval);
    });
  }
}
