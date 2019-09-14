import {NodeBase} from './node-base';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable('NodeBase')
export class ConsoleNode extends NodeBase <any, any, any> {

  public disableOut = true;

  @JsonProperty()
  public color = '#006AC1';

  process(): any {
    console.log(this.input);
  }
}
