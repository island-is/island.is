import { z } from 'zod'

const leafCondition = z.object({
  field: z.string().min(1),
  equals: z.string(),
})

// Recursive condition tree: a leaf field/equals check, or an AND/OR
// combination of further conditions. z.lazy is required since TS can't
// infer a self-referential type from the schema alone.
export type CalculatorCondition =
  | { field: string; equals: string }
  | { all: CalculatorCondition[] }
  | { any: CalculatorCondition[] }

export const conditionSchema: z.ZodType<CalculatorCondition> = z.lazy(() =>
  z.union([
    leafCondition,
    z.object({ all: z.array(conditionSchema).min(1) }),
    z.object({ any: z.array(conditionSchema).min(1) }),
  ]),
)

const sectionFieldSchema = z.object({
  key: z.string().min(1),
  span: z.number().int().min(1).max(12),
  visibleWhen: conditionSchema.optional(),
})

const calculatorFieldSectionSchema = z.object({
  key: z.string().min(1),
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(sectionFieldSchema),
})

export const calculatorConfigSchema = z.object({
  calculatorType: z.string().optional(),
  sections: z.array(calculatorFieldSectionSchema),
})

export type CalculatorSectionField = z.infer<typeof sectionFieldSchema>
export type CalculatorFieldSection = z.infer<
  typeof calculatorFieldSectionSchema
>
export type CalculatorConfig = z.infer<typeof calculatorConfigSchema>

const isLeafCondition = (
  condition: CalculatorCondition,
): condition is { field: string; equals: string } => 'field' in condition

export const evaluateCondition = (
  condition: CalculatorCondition,
  values: Record<string, string>,
): boolean => {
  if (isLeafCondition(condition)) {
    return String(values[condition.field] ?? '') === condition.equals
  }
  if ('all' in condition) {
    return condition.all.every((child) => evaluateCondition(child, values))
  }
  return condition.any.some((child) => evaluateCondition(child, values))
}
