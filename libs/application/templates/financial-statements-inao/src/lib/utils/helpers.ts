
export const getTotal = (values: Record<string, string>, key: string) => {
  const total = Object.values(values[key])
  .filter((val) => val !== undefined)
  .map((val) => Number(val))
  .reduce((prev, current) => {
    return (prev += current)
  }, 0)
  return total
}