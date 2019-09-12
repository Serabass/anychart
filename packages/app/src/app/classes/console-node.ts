import {NodeBase} from './node-base';

export class ConsoleNode extends NodeBase <any, any, any> {
  process(): any {
    console.log(this.input);
  }
}
