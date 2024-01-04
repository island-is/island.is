export function makeArrayEven<T>(data: Array<T>, toAddIfOdd: T) {
  if (data.length % 2 !== 0) {
    data.push(toAddIfOdd)
  }
  return data
}
