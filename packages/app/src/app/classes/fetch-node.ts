import {NodeBase} from './node-base';
import 'reflect-metadata';
import {Param} from '../decorators/param';
import {JsonProperty, Serializable} from 'typescript-json-serializer';

export enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE,
  HEAD,
  PATCH,
}

@Serializable()
export class FetchNode extends NodeBase <any, any, any> {

  public disableIn = true;

  @JsonProperty()
  public color = 'yellowgreen';

  @JsonProperty()
  public id: string;

  @JsonProperty()
  public name: string;

  @JsonProperty()
  public constructorName: string;

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
    return fetch(this.url, {
      method: this.method as any,
    })
      .then((res) => res.json())
      .then((r) => r.name);
  }
}
