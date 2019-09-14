import {NodeBase} from './node-base';

export class TextNode extends NodeBase {

  public disableIn = true;

  public color = 'rgb(216, 93, 226)';

  public params: {
    value: string,
    value2: string,
  };

  process() {
    return this.params.value;
  }
}
