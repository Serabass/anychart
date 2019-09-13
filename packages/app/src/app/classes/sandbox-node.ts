import {NodeBase} from './node-base';

export class SandboxNode extends NodeBase {
  public color = 'yellow';

  process(): any {
    return [this.input, this.input].join('::');
  }
}

