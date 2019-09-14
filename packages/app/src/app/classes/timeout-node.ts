import {NodeBase} from './node-base';
import {Param} from '../decorators/param';

export class TimeoutNode extends NodeBase <any, any, any> {

  public color = '#8888ff';

  @Param({
    name: 'Interval',
    type: 'number'
  })
  public interval: number;

  process(): any {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.input), this.interval);
    });
  }
}
