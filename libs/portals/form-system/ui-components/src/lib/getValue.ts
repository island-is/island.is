import { FormSystemField } from '@island.is/api/schema'

export const getValue = (field: FormSystemField, property: string) => {
  if (!field?.values?.[0]) return undefined
  return (
    (field?.values?.[0]?.json as Record<string, any>)[property] ?? undefined
  )
}
