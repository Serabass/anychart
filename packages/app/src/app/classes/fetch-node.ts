import {NodeBase} from './node-base';
import 'reflect-metadata';

function Param(opts = {}) {
  return (target, propertyKey) => {
    let type = Reflect.getMetadata('design:type', target, propertyKey);

    if (!target.__params ) {
      target.__params  = {};
    }

    target.__params[propertyKey] = opts;
  };
}

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

  public params: {
    url?: string,
    method?: string,
  } = {
    method: 'GET'
  };

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
  public method: HttpMethod;

  process(): any {
    return fetch(this.params.url, {
      method: this.params.method,
    })
      .then((res) => res.json())
      .then((r) => r.name);
  }
}
