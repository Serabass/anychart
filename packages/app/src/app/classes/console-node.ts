import {NodeBase} from './node-base';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable()
export class ConsoleNode extends NodeBase <any, any, any> {

  public disableOut = true;

  @JsonProperty()
  public id: string;

  @JsonProperty()
  public name: string;

  @JsonProperty()
  public constructorName: string;

  @JsonProperty()
  public color = 'green';

  process(): any {
    console.log(this.input);
  }
}
