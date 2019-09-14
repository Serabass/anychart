import {NodeBase} from './node-base';
import {Param} from '../decorators/param';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

@Serializable('NodeBase')
export class TimeoutNode extends NodeBase <any, any, any> {

  @JsonProperty()
  public color = '#00AAAA';

  @Param({
    name: 'Interval',
    type: 'number'
  })
  @JsonProperty()
  public interval: number;

  process(): any {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.input), this.interval);
    });
  }
}
