import {NodeBase} from './node-base';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable('NodeBase')
export class SandboxNode extends NodeBase {
  @JsonProperty()
  public color = '#FF981D';

  process(): any {
    return [this.input, this.input].join('::');
  }
}

