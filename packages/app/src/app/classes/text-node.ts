import {NodeBase} from './node-base';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable('NodeBase')
export class TextNode extends NodeBase {

  public disableIn = true;

  @JsonProperty()
  public color = 'rgb(216, 93, 226)';

  process() {
    return this.params.value;
  }
}
