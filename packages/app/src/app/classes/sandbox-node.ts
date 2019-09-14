import {NodeBase} from './node-base';
import * as chroma from 'chroma-js';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable()
export class SandboxNode extends NodeBase {
  @JsonProperty()
  public color = chroma('red').brighten().hex();

  process(): any {
    return [this.input, this.input].join('::');
  }
}

