import {NodeBase} from './node-base';

export class TextNode extends NodeBase {

  public disableIn = true;

  public color = 'rgb(216, 93, 226)';

  process() {
    return this.params.value;
  }
}
