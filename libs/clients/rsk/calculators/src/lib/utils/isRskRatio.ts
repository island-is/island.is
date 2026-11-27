import type { ZodTypeAny } from 'zod'
import {
  ZodDefault,
  ZodNull,
  ZodNullable,
  ZodNumber,
  ZodOptional,
  ZodUnion,
} from 'zod'

export const unwrap = (schema: ZodTypeAny): ZodTypeAny => {
  if (
    schema instanceof ZodOptional ||
    schema instanceof ZodDefault ||
    schema instanceof ZodNullable
  ) {
    return unwrap(schema._def.innerType)
  }
  if (schema instanceof ZodUnion) {
    const options: ZodTypeAny[] = schema.options.filter(
      (option: ZodTypeAny) => !(option instanceof ZodNull),
    )
    return options.length === 1 ? unwrap(options[0]) : schema
  }
  return schema
}

export const isRskRatio = (schema: ZodTypeAny) => {
  const inner = unwrap(schema)
  return (
    inner instanceof ZodNumber &&
    !inner.isInt &&
    inner.minValue === 0 &&
    inner.maxValue === 1
  )
}
