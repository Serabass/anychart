import {NodeBase} from './node-base';

export class ConsoleNode extends NodeBase <any, any, any> {

  public disableOut = true;

  public color = 'green';

  process(): any {
    console.log(this.input);
  }
}
