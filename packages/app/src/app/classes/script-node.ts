import {NodeBase} from './node-base';
import * as chroma from 'chroma-js';
import {Param} from '../decorators/param';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable('NodeBase')
export class ScriptNode extends NodeBase {
  @JsonProperty()
  public color = '#DE4AAD';

  @Param({
    name: 'Script',
    type: 'bigtext'
  })
  @JsonProperty()
  public script: string;

  process(): any {
    return Promise.resolve(eval(this.script));
  }
}

