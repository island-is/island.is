import { z, ZodIssueCode } from 'zod'
import type { Schema } from '@island.is/application/types'
import type { ValidationMessageDescriptorInfo } from '@island.is/application/types'

const NAMESPACE_REGEX = /^[\w.]+:\w+(\.\w+)*$/

/**
 * Generates "invalid" skeleton data for a zod schema to trigger refinement errors.
 * Uses empty strings, zeros, and false to maximize validation failures.
 */
const generateInvalidSkeleton = (schema: z.ZodType): unknown => {
  if (schema instanceof z.ZodString) return ''
  if (schema instanceof z.ZodNumber) return 0
  if (schema instanceof z.ZodBoolean) return false
  if (schema instanceof z.ZodDate) return ''
  if (schema instanceof z.ZodEnum) return ''
  if (schema instanceof z.ZodNativeEnum) return ''
  if (schema instanceof z.ZodLiteral) return ''
  if (schema instanceof z.ZodArray) return []
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(shape)) {
      result[key] = generateInvalidSkeleton(value as z.ZodType)
    }
    return result
  }
  if (schema instanceof z.ZodOptional)
    return generateInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodNullable)
    return generateInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodDefault)
    return generateInvalidSkeleton(schema._def.innerType)
  if (schema instanceof z.ZodUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0 ? generateInvalidSkeleton(options[0]) : undefined
  }
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0 ? generateInvalidSkeleton(options[0]) : undefined
  }
  if (schema instanceof z.ZodRecord) return {}
  if (schema instanceof z.ZodTuple) {
    return (schema.items as z.ZodType[]).map((item) =>
      generateInvalidSkeleton(item),
    )
  }
  if (schema instanceof z.ZodEffects)
    return generateInvalidSkeleton(schema.innerType())
  if (schema instanceof z.ZodLazy) {
    try {
      return generateInvalidSkeleton(schema.schema)
    } catch {
      return undefined
    }
  }
  if (schema instanceof z.ZodIntersection) {
    const left = generateInvalidSkeleton(schema._def.left)
    const right = generateInvalidSkeleton(schema._def.right)
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
  return undefined
}

/**
 * Generates alternative invalid data (non-empty strings that fail format validations).
 */
const generateAlternativeInvalidSkeleton = (schema: z.ZodType): unknown => {
  if (schema instanceof z.ZodString) return 'x'
  if (schema instanceof z.ZodNumber) return -1
  if (schema instanceof z.ZodBoolean) return false
  if (schema instanceof z.ZodDate) return 'invalid-date'
  if (schema instanceof z.ZodEnum) return '__invalid__'
  if (schema instanceof z.ZodNativeEnum) return '__invalid__'
  if (schema instanceof z.ZodLiteral) return '__invalid__'
  if (schema instanceof z.ZodArray) return ['']
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(shape)) {
      result[key] = generateAlternativeInvalidSkeleton(value as z.ZodType)
    }
    return result
  }
  if (schema instanceof z.ZodOptional)
    return generateAlternativeInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodNullable)
    return generateAlternativeInvalidSkeleton(schema.unwrap())
  if (schema instanceof z.ZodDefault)
    return generateAlternativeInvalidSkeleton(schema._def.innerType)
  if (schema instanceof z.ZodUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0
      ? generateAlternativeInvalidSkeleton(options[0])
      : undefined
  }
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema.options as z.ZodType[]
    return options.length > 0
      ? generateAlternativeInvalidSkeleton(options[0])
      : undefined
  }
  if (schema instanceof z.ZodRecord) return {}
  if (schema instanceof z.ZodTuple) {
    return (schema.items as z.ZodType[]).map((item) =>
      generateAlternativeInvalidSkeleton(item),
    )
  }
  if (schema instanceof z.ZodEffects)
    return generateAlternativeInvalidSkeleton(schema.innerType())
  if (schema instanceof z.ZodLazy) {
    try {
      return generateAlternativeInvalidSkeleton(schema.schema)
    } catch {
      return undefined
    }
  }
  if (schema instanceof z.ZodIntersection) {
    const left = generateAlternativeInvalidSkeleton(schema._def.left)
    const right = generateAlternativeInvalidSkeleton(schema._def.right)
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
  return undefined
}

const collectDescriptorsFromIssues = (
  issues: z.ZodIssue[],
  seen: Set<string>,
  result: ValidationMessageDescriptorInfo[],
): void => {
  for (const issue of issues) {
    if (issue.code !== ZodIssueCode.custom) continue
    const params = issue.params as Record<string, unknown> | undefined
    if (!params || typeof params.id !== 'string') continue
    if (!NAMESPACE_REGEX.test(params.id)) continue
    if (seen.has(params.id)) continue
    seen.add(params.id)
    result.push({
      id: params.id,
      defaultMessage:
        typeof params.defaultMessage === 'string'
          ? params.defaultMessage
          : undefined,
      description:
        typeof params.description === 'string' ? params.description : undefined,
      fieldPath: issue.path.join('.'),
    })
  }
}

/**
 * Extracts validation message descriptors from a zod dataSchema by running
 * safeParse with multiple invalid inputs and collecting the params from
 * resulting ZodIssues that contain message descriptors.
 */
export const extractValidationDescriptors = (
  schema: Schema | z.ZodEffects<any, any, any>,
): ValidationMessageDescriptorInfo[] => {
  const result: ValidationMessageDescriptorInfo[] = []
  const seen = new Set<string>()

  const testInputs = [
    {},
    generateInvalidSkeleton(schema),
    generateAlternativeInvalidSkeleton(schema),
  ]

  for (const input of testInputs) {
    const parseResult = schema.safeParse(input)
    if (!parseResult.success) {
      collectDescriptorsFromIssues(parseResult.error.issues, seen, result)
    }
  }

  // Also try parsing sub-schemas individually for nested objects with refinements
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as Record<string, z.ZodType>
    for (const [key, subSchema] of Object.entries(shape)) {
      const subInputs = [
        generateInvalidSkeleton(subSchema),
        generateAlternativeInvalidSkeleton(subSchema),
      ]
      for (const input of subInputs) {
        const parseResult = subSchema.safeParse(input)
        if (!parseResult.success) {
          for (const issue of parseResult.error.issues) {
            if (issue.code !== ZodIssueCode.custom) continue
            const params = issue.params as Record<string, unknown> | undefined
            if (!params || typeof params.id !== 'string') continue
            if (!NAMESPACE_REGEX.test(params.id)) continue
            if (seen.has(params.id)) continue
            seen.add(params.id)
            result.push({
              id: params.id,
              defaultMessage:
                typeof params.defaultMessage === 'string'
                  ? params.defaultMessage
                  : undefined,
              description:
                typeof params.description === 'string'
                  ? params.description
                  : undefined,
              fieldPath: [key, ...issue.path].join('.'),
            })
          }
        }
      }
    }
  }

  return result
}
