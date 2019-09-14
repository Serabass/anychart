export function Param(opts = {}) {
  return (target, propertyKey) => {
    let type = Reflect.getMetadata('design:type', target, propertyKey);

    if (!target.__params) {
      target.__params = {};
    }

    target.__params[propertyKey] = opts;
  };
}
