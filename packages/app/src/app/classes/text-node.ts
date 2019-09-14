import {NodeBase} from './node-base';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable('NodeBase')
export class TextNode extends NodeBase {

  public disableIn = true;

  @JsonProperty()
  public color = '#C69408';

  process() {
    return this.params.value;
  }
}
