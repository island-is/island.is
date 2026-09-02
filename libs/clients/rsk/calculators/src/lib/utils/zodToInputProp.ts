import { z } from 'zod'

import type { InputProp } from '../calculatorTypes/inputProps'

export const propFromZodType = (
  name: string,
  zodType: z.ZodTypeAny,
  dependsOn?: InputProp['dependsOn'],
): InputProp => {
  let type = zodType
  let required = true
  if (type instanceof z.ZodOptional) {
    required = false
    type = type.unwrap()
  }

  let dataType: InputProp['dataType']
  let options: string[] | undefined
  if (type instanceof z.ZodEnum) {
    dataType = 'enum'
    options = type.options
  } else if (type instanceof z.ZodLiteral) {
    dataType = 'enum'
    options = [String(type.value)]
  } else if (type instanceof z.ZodNumber) {
    dataType = 'number'
  } else if (type instanceof z.ZodBoolean) {
    dataType = 'boolean'
  } else if (type instanceof z.ZodDate) {
    dataType = 'date'
  } else {
    dataType = 'string'
  }

  return {
    name,
    dataType,
    required,
    ...(options ? { options } : {}),
    ...(dependsOn ? { dependsOn } : {}),
  }
}

export const propsFromDiscriminatedUnion = (
  schema: z.ZodDiscriminatedUnion<string, z.ZodObject<z.ZodRawShape>[]>,
): InputProp[] => {
  const discriminatorKey = schema._def.discriminator
  const options = schema._def.options
  const props: InputProp[] = []
  const seen = new Set<string>()

  // The discriminant itself, e.g. splitCustody.
  props.push(propFromZodType(discriminatorKey, z.boolean()))
  seen.add(discriminatorKey)

  for (const option of options) {
    const discriminantType = option.shape[discriminatorKey]
    const discriminantValue =
      discriminantType instanceof z.ZodLiteral
        ? discriminantType.value
        : undefined

    for (const [fieldName, fieldType] of Object.entries(option.shape)) {
      if (fieldName === discriminatorKey || seen.has(fieldName)) continue
      seen.add(fieldName)

      const presentInAllOptions = options.every((o) => fieldName in o.shape)
      props.push(
        propFromZodType(
          fieldName,
          fieldType as z.ZodTypeAny,
          presentInAllOptions
            ? undefined
            : { field: discriminatorKey, value: discriminantValue },
        ),
      )
    }
  }

  return props
}
