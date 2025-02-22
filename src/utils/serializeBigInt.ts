export function serializeBigInt(value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  } else if (value !== null && typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = serializeBigInt(value[key]);
      }
    }
    return result;
  }
  return value;
}
