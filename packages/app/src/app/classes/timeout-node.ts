import {NodeBase} from './node-base';

export class TimeoutNode extends NodeBase <any, any, any> {

  public color = 'blue';

  public params: {
    interval: number,
  };

  process(): any {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), this.params.interval);
    });
  }
}
