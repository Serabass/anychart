import {NodeBase} from './node-base';

export class TextNode extends NodeBase<any, any> {

  public disableIn = true;

  public color = 'gray';

  public params: {
    value: string
  };

  process() {
    return this.params.value;
  }
}
