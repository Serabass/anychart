import {NodeBase} from './node-base';
import * as chroma from 'chroma-js';

export class SandboxNode extends NodeBase {
  public color = chroma('red').brighten().hex();

  process(): any {
    return [this.input, this.input].join('::');
  }
}

