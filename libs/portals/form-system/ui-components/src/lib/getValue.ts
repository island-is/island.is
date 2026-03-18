import { FormSystemField } from '@island.is/api/schema'

export const getValue = (
  field: FormSystemField,
  property: string,
  valueIndex?: number,
) => {
  if (!field?.values?.[valueIndex ?? 0]) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (field?.values?.[valueIndex ?? 0]?.json as any)[property] ?? undefined
}

export const getValues = (
  field: FormSystemField,
  properties: string[],
  valueIndex?: number,
) => {
  if (!field?.values?.[valueIndex ?? 0]) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = field?.values?.[valueIndex ?? 0]?.json as any
  return properties.reduce<Record<string, unknown>>((acc, prop) => {
    acc[prop] = json?.[prop] ?? undefined
    return acc
  }, {})
}
