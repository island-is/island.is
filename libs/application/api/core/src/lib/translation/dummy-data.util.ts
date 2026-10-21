import { z } from 'zod'

export function generateDummyData(schema: z.ZodType): unknown {
  return generateForType(schema)
}

function generateForType(schema: z.ZodType): unknown {
  if (schema instanceof z.ZodString) {
    return 'Lorem ipsum'
  }

  if (schema instanceof z.ZodNumber) {
    return 12345
  }

  if (schema instanceof z.ZodBoolean) {
    return true
  }

  if (schema instanceof z.ZodDate) {
    return new Date().toISOString()
  }

  if (schema instanceof z.ZodEnum) {
    const values = schema.options
    return values.length > 0 ? values[0] : ''
  }

  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema.enum)
    return values.length > 0 ? values[0] : ''
  }

  if (schema instanceof z.ZodLiteral) {
    return schema.value
  }

  if (schema instanceof z.ZodArray) {
    const itemData = generateForType(schema.element)
    return [itemData]
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(shape)) {
      result[key] = generateForType(value as z.ZodType)
    }
    return result
  }

  if (schema instanceof z.ZodOptional) {
    return generateForType(schema.unwrap())
  }

  if (schema instanceof z.ZodNullable) {
    return generateForType(schema.unwrap())
  }

  if (schema instanceof z.ZodDefault) {
    return schema._def.defaultValue()
  }

  if (schema instanceof z.ZodUnion) {
    const options = schema.options as z.ZodType[]
    if (options.length > 0) {
      return generateForType(options[0])
    }
    return undefined
  }

  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema.options as z.ZodType[]
    if (options.length > 0) {
      return generateForType(options[0])
    }
    return undefined
  }

  if (schema instanceof z.ZodRecord) {
    return {}
  }

  if (schema instanceof z.ZodTuple) {
    return schema.items.map((item: z.ZodType) => generateForType(item))
  }

  if (schema instanceof z.ZodEffects) {
    return generateForType(schema.innerType())
  }

  if (schema instanceof z.ZodLazy) {
    try {
      return generateForType(schema.schema)
    } catch {
      return undefined
    }
  }

  if (schema instanceof z.ZodIntersection) {
    const left = generateForType(schema._def.left)
    const right = generateForType(schema._def.right)
    if (
      typeof left === 'object' &&
      typeof right === 'object' &&
      left !== null &&
      right !== null
    ) {
      return { ...left, ...right }
    }
    return left
  }

  if (schema instanceof z.ZodAny || schema instanceof z.ZodUnknown) {
    return {}
  }

  if (schema instanceof z.ZodVoid || schema instanceof z.ZodUndefined) {
    return undefined
  }

  if (schema instanceof z.ZodNull) {
    return null
  }

  return undefined
}
