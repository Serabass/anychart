import {NodeBase} from './node-base';
import * as chroma from 'chroma-js';
import {Param} from '../decorators/param';

export class ScriptNode extends NodeBase {
  public color = chroma('gray').brighten().hex();

  @Param({
    name: 'Script',
    type: 'bigtext'
  })
  public script: string;

  process(): any {
    return eval(this.script);
  }
}

