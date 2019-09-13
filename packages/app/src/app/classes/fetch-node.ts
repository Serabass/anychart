import {NodeBase} from './node-base';

export class FetchNode extends NodeBase <any, any, any> {

  public disableIn = true;

  public color = 'yellowgreen';

  public params: {
    url: string,
  };

  process(): any {
    return fetch(this.params.url)
      .then((res) => res.json())
      .then((r) => r.name);
  }
}
