import { RecordObject } from '../types/Fields'

const containsArray = (obj: RecordObject) => {
  let contains = false

  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      Array.isArray(obj[key])
    ) {
      contains = true
    }
  }

  return contains
}

export function getValueViaPath<T = unknown>(
  obj: RecordObject,
  path: string,
  defaultValue?: T,
): T | undefined {
  // Errors from dataSchema with array of object looks like e.g. `{ 'periods[1].startDate': 'error message' }`
  if (path.match(/.\[\d\]\../g) && !containsArray(obj)) {
    return (obj?.[path] ?? defaultValue) as T
  }

  // For the rest of the case, we are into e.g. `personalAllowance.usePersonalAllowance`
  try {
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (res, key) => (res !== null && res !== undefined ? res[key] : res),
          obj,
        ) as RecordObject | string

    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

    return result === undefined || result === obj ? defaultValue : (result as T)
  } catch (e) {
    return undefined
  }
}
