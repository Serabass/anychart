import {NodeBase} from './node-base';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable()
export class TextNode extends NodeBase {

  public disableIn = true;

  @JsonProperty()
  public id: string;

  @JsonProperty()
  public name: string;

  @JsonProperty()
  public constructorName: string;

  @JsonProperty()
  public color = 'rgb(216, 93, 226)';

  process() {
    return this.params.value;
  }
}
