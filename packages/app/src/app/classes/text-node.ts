import {NodeBase} from './node-base';

export class TextNode extends NodeBase<any, any> {

  public disableIn = true;

  public color = '#3d3d3d';

  public params: {
    value: string,
    value2: string,
  };

  process() {
    return this.params.value;
  }
}
