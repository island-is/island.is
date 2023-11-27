export const randomDate = () => {
  const earliest = new Date()
  const latest = new Date(2999, 11, 31)
  return new Date(
    earliest.getTime() +
      Math.random() * (latest.getTime() - earliest.getTime()),
  )
}

export const randomBoolean = () => Math.random() >= 0.5

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum as never) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue
}

export function randomEnumSplit<T>(anEnum: T): [T[keyof T][], T[keyof T][]] {
  const selected = []
  const keys = Object.keys(anEnum as never) as unknown as T[keyof T][]
  let remaining = keys
  for (let i = Math.floor(Math.random() * (keys.length - 2)) + 1; i > 0; i--) {
    const index = Math.floor(Math.random() * remaining.length)
    selected.push(remaining[index])
    remaining = remaining.slice(0, index).concat(remaining.slice(index + 1))
  }
  return [selected, remaining]
}
