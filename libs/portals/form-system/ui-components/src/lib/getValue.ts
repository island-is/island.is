import { FormSystemField } from '@island.is/api/schema'

export const getValue = (field: FormSystemField, property: string) => {
  if (!field?.values?.[0]) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((field?.values?.[0]?.json as any)[property] ?? undefined)
}
