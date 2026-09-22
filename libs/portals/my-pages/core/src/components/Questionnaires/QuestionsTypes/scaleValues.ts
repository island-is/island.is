const MAX_VALUES = 20

/** Ranges wider than MAX_VALUES are sampled down, the end point always kept */
export const getScaleValues = (
  min: string | number,
  max: string | number,
  step = 1,
): string[] => {
  const minNum = Number(min)
  const maxNum = Number(max)

  if (isNaN(minNum) || isNaN(maxNum) || minNum >= maxNum) {
    return []
  }

  const increment = typeof step === 'number' && step > 0 ? step : 1
  const values: string[] = []

  for (let i = minNum; i <= maxNum; i += increment) {
    values.push(i.toString())
    if (i + increment > maxNum) break
  }

  if (values.length <= MAX_VALUES) {
    return values
  }

  const interval = Math.ceil(values.length / MAX_VALUES)
  const sampled = values.filter((_, index) => index % interval === 0)
  const lastValue = values[values.length - 1]

  if (sampled[sampled.length - 1] !== lastValue) {
    sampled.push(lastValue)
  }

  return sampled
}
