export default function deepClone(value) {
  if (typeof value === 'undefined' || value === null) {
    return value
  }
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map(deepClone)
    }
    const result = {}
    for (const key in value) {
      result[key] = deepClone(value[key])
    }
    return result
  }
  return value
}
