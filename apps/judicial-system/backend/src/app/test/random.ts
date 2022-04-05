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
  const enumValues = (Object.keys(anEnum) as unknown) as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue
}
