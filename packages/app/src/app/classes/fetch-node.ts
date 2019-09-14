import {NodeBase} from './node-base';
import 'reflect-metadata';
import {Param} from '../decorators/param';

export enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE,
  HEAD,
  PATCH,
}

export class FetchNode extends NodeBase <any, any, any> {

  public disableIn = true;

  public color = 'yellowgreen';

  @Param({
    name: 'URL',
    type: 'string'
  })
  public url: string;

  @Param({
    name: 'HTTP Method',
    type: 'enum',
    options: HttpMethod
  })
  public method: HttpMethod = 'GET';

  process(): any {
    return fetch(this.url, {
      method: this.method,
    })
      .then((res) => res.json())
      .then((r) => r.name);
  }
}
