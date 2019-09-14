import {NodeBase} from './node-base';
import * as chroma from 'chroma-js';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable()
export class SandboxNode extends NodeBase {
  @JsonProperty()
  public color = chroma('red').brighten().hex();

  @JsonProperty()
  public id: string;

  @JsonProperty()
  public name: string;

  @JsonProperty()
  public constructorName: string;

  process(): any {
    return [this.input, this.input].join('::');
  }
}

