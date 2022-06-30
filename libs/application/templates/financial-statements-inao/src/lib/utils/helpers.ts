export const getTotal = (values: Record<string, string>, key: string) => {
  if(!values[key]) {
    return 0
  }
  const total = Object.values(values[key])
    .filter((val) => !isNaN(Number(val)))
    .map((val) => Number(val))
    .reduce((prev, current) => {
      return (prev += current)
    }, 0)
  return total
}
