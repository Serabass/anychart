import {
  deserialize,
  serialize,
  JsonProperty,
  Serializable
} from 'typescript-json-serializer';

@Serializable()
export class Entity {
  public deserialize<T>(data: T): T {
    return deserialize(data, this.constructor as new(...params: any[]) => T) as unknown as T;
  }

  public serialize() {
    return serialize(this, false);
  }
}
