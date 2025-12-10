import { FormSystemField } from '@island.is/api/schema'

export const getValue = (field: FormSystemField, property: string) => {
  if (!field?.values?.[0]) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (field?.values?.[0]?.json as any)[property] ?? undefined
}

export const getValues = (field: FormSystemField, properties: string[]) => {
  if (!field?.values?.[0]) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = field?.values?.[0]?.json as any
  return properties.reduce<Record<string, unknown>>((acc, prop) => {
    acc[prop] = json?.[prop] ?? undefined
    return acc
  }, {})
}
