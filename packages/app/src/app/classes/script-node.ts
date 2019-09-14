import {NodeBase} from './node-base';
import * as chroma from 'chroma-js';

export class ScriptNode extends NodeBase {
  public color = chroma('gray').brighten().hex();

  process(): any {
    return [this.input, this.input].join('::');
  }
}

