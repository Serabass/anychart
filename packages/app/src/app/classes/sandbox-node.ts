import {NodeBase} from './node-base';

export class SandboxNode extends NodeBase<any, any, any> {
  process(): any {
    return [this.input, this.input].join('::');
  }
}

