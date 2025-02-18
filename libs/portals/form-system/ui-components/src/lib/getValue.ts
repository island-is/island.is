import { FormSystemField } from "@island.is/api/schema"

export const getValue = (field: FormSystemField, property: string) => {
  return (field?.values?.[0]?.json as Record<string, any>)[property]
}