const MAX_VALUES = 20

const DECREASE_KEYS = ['ArrowLeft', 'ArrowDown']
const INCREASE_KEYS = ['ArrowRight', 'ArrowUp']

/**
 * Index a key press moves to, or undefined for keys that do not move. Both
 * orientations override native radio navigation, which ties the direction to
 * DOM order and so inverts one axis on each of them
 */
export const getScaleKeyIndex = (
  key: string,
  currentIndex: number,
  length: number,
): number | undefined => {
  if (key === 'Home') {
    return 0
  }
  if (key === 'End') {
    return length - 1
  }
  if (INCREASE_KEYS.includes(key)) {
    return Math.min(length - 1, currentIndex + 1)
  }
  if (DECREASE_KEYS.includes(key)) {
    return Math.max(0, currentIndex - 1)
  }
  return undefined
}

const toScaleValue = (value: number) => Number(value.toFixed(6)).toString()

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
  // Multiplied out rather than accumulated, which drifts on decimal steps
  const stepCount = Math.floor((maxNum - minNum) / increment + 1e-9)
  const values: string[] = []

  for (let i = 0; i <= stepCount; i++) {
    values.push(toScaleValue(minNum + i * increment))
  }

  // A step that does not divide the range would otherwise stop short of it
  const maxValue = toScaleValue(maxNum)
  if (values[values.length - 1] !== maxValue) {
    values.push(maxValue)
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
