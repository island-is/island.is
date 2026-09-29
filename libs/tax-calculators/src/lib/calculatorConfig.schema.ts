import { z } from 'zod'

const sectionGateSchema = z.object({
  toggle: z.string().min(1),
  disableOnly: z.boolean().optional(),
})

const localizedTextSchema = z.object({
  is: z.string().min(1),
  en: z.string().min(1).optional(),
})

const localizedMarkdownSchema = z.object({
  is: z.string().min(1),
  en: z.string().min(1).optional(),
})

// Stable row identity while `key` is still empty in the editor draft state.
const rowUidSchema = z.string().min(1)

const inputSectionFieldSchema = z.object({
  uid: rowUidSchema,
  key: z.string().min(1),
  label: localizedTextSchema.optional(),
  placeholder: localizedTextSchema.optional(),
  span: z.number().int().min(1).max(12),
})

const sectionToggleSchema = z.object({
  key: z.string().min(1),
  label: localizedTextSchema,
})

const inputSectionSchema = z.object({
  key: z.string().min(1),
  title: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  toggle: sectionToggleSchema.optional(),
  gate: sectionGateSchema.optional(),
  fields: z.array(inputSectionFieldSchema),
})

const outputItemFieldSchema = z.object({
  uid: rowUidSchema,
  key: z.string().min(1),
  label: localizedTextSchema.optional(),
})

const outputValueFieldSchema = z.object({
  uid: rowUidSchema,
  kind: z.literal('value'),
  key: z.string().min(1),
  label: localizedTextSchema.optional(),
  variant: z.enum(['default', 'emphasis']).optional(),
  itemFields: z.array(outputItemFieldSchema).optional(),
})

const outputContentFieldSchema = z.object({
  uid: rowUidSchema,
  kind: z.literal('content'),
  content: localizedMarkdownSchema,
})

const outputSectionFieldSchema = z.discriminatedUnion('kind', [
  outputValueFieldSchema,
  outputContentFieldSchema,
])

const outputTotalSchema = z.object({
  uid: rowUidSchema,
  key: z.string().min(1),
  label: localizedTextSchema,
})

const outputSectionSchema = z
  .object({
    key: z.string().min(1),
    title: localizedTextSchema.optional(),
    variant: z.enum(['default', 'accordion']).optional(),
    fields: z.array(outputSectionFieldSchema),
  })
  .superRefine((section, ctx) => {
    if (section.variant === 'accordion' && !section.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['title'],
        message: 'An accordion output section must have a title',
      })
    }
  })

export const calculatorConfigSchema = z
  .object({
    inputSections: z.array(inputSectionSchema),
    outputTotal: outputTotalSchema,
    outputSections: z.array(outputSectionSchema),
  })
  .superRefine((config, ctx) => {
    const declaringSectionIndexByToggleKey = new Map<string, number>()

    config.inputSections.forEach((section, sectionIndex) => {
      if (
        section.toggle &&
        !declaringSectionIndexByToggleKey.has(section.toggle.key)
      ) {
        declaringSectionIndexByToggleKey.set(section.toggle.key, sectionIndex)
      }
    })

    const seenInputSectionKeys = new Set<string>()
    const seenToggleKeys = new Set<string>()
    const seenInputFieldUids = new Set<string>()
    const seenInputFieldKeys = new Set<string>()

    config.inputSections.forEach((section, sectionIndex) => {
      if (seenInputSectionKeys.has(section.key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['inputSections', sectionIndex, 'key'],
          message: `Duplicate input section key "${section.key}"`,
        })
      }
      seenInputSectionKeys.add(section.key)

      if (section.toggle) {
        if (seenToggleKeys.has(section.toggle.key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['inputSections', sectionIndex, 'toggle', 'key'],
            message: `Duplicate toggle key "${section.toggle.key}"`,
          })
        }
        seenToggleKeys.add(section.toggle.key)
      }

      if (section.gate) {
        const declaringSectionIndex = declaringSectionIndexByToggleKey.get(
          section.gate.toggle,
        )

        if (declaringSectionIndex === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['inputSections', sectionIndex, 'gate', 'toggle'],
            message: `Gate references toggle "${section.gate.toggle}", which no input section declares`,
          })
        } else if (declaringSectionIndex === sectionIndex) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['inputSections', sectionIndex, 'gate', 'toggle'],
            message: `Gate references toggle "${section.gate.toggle}", which this same section declares`,
          })
        }
      }

      section.fields.forEach((field, fieldIndex) => {
        if (seenInputFieldUids.has(field.uid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['inputSections', sectionIndex, 'fields', fieldIndex, 'uid'],
            message: `Duplicate input field uid "${field.uid}"`,
          })
        }
        seenInputFieldUids.add(field.uid)

        if (seenInputFieldKeys.has(field.key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['inputSections', sectionIndex, 'fields', fieldIndex, 'key'],
            message: `Duplicate input field key "${field.key}"`,
          })
        }
        seenInputFieldKeys.add(field.key)
      })
    })

    const seenOutputSectionKeys = new Set<string>()
    const seenOutputFieldUids = new Set<string>([config.outputTotal.uid])

    config.outputSections.forEach((section, sectionIndex) => {
      if (seenOutputSectionKeys.has(section.key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['outputSections', sectionIndex, 'key'],
          message: `Duplicate output section key "${section.key}"`,
        })
      }
      seenOutputSectionKeys.add(section.key)

      section.fields.forEach((field, fieldIndex) => {
        const path = ['outputSections', sectionIndex, 'fields', fieldIndex]

        if (seenOutputFieldUids.has(field.uid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [...path, 'uid'],
            message: `Duplicate output field uid "${field.uid}"`,
          })
        }
        seenOutputFieldUids.add(field.uid)

        if (field.kind !== 'value') return

        const seenItemUids = new Set<string>()
        const seenItemKeys = new Set<string>()

        field.itemFields?.forEach((itemField, itemIndex) => {
          if (seenItemUids.has(itemField.uid)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [...path, 'itemFields', itemIndex, 'uid'],
              message: `Duplicate item field uid "${itemField.uid}"`,
            })
          }
          seenItemUids.add(itemField.uid)

          if (seenItemKeys.has(itemField.key)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [...path, 'itemFields', itemIndex, 'key'],
              message: `Duplicate item field key "${itemField.key}"`,
            })
          }
          seenItemKeys.add(itemField.key)
        })
      })
    })
  })

export type CalculatorLocalizedText = z.infer<typeof localizedTextSchema>
export type CalculatorLocalizedMarkdown = z.infer<
  typeof localizedMarkdownSchema
>
export type CalculatorSectionToggle = z.infer<typeof sectionToggleSchema>
export type CalculatorSectionGate = z.infer<typeof sectionGateSchema>
export type CalculatorInputSectionField = z.infer<
  typeof inputSectionFieldSchema
>
export type CalculatorInputSection = z.infer<typeof inputSectionSchema>
export type CalculatorOutputItemField = z.infer<typeof outputItemFieldSchema>
export type CalculatorOutputValueField = z.infer<typeof outputValueFieldSchema>
export type CalculatorOutputContentField = z.infer<
  typeof outputContentFieldSchema
>
export type CalculatorOutputSectionField = z.infer<
  typeof outputSectionFieldSchema
>
export type CalculatorOutputTotal = z.infer<typeof outputTotalSchema>
export type CalculatorOutputSection = z.infer<typeof outputSectionSchema>
export type CalculatorConfig = z.infer<typeof calculatorConfigSchema>

export const collectInputSectionToggles = (
  config: CalculatorConfig,
): CalculatorSectionToggle[] =>
  config.inputSections
    .map((section) => section.toggle)
    .filter((toggle): toggle is CalculatorSectionToggle => Boolean(toggle))

export const collectInputFieldKeys = (config: CalculatorConfig): string[] =>
  config.inputSections.flatMap((section) =>
    section.fields.map((field) => field.key),
  )

export const isOutputValueField = (
  field: CalculatorOutputSectionField,
): field is CalculatorOutputValueField => field.kind === 'value'

export const collectOutputFieldKeys = (config: CalculatorConfig): string[] => [
  ...new Set([
    config.outputTotal.key,
    ...config.outputSections.flatMap((section) =>
      section.fields.filter(isOutputValueField).map((field) => field.key),
    ),
  ]),
]

export const collectOutputItemFieldKeys = (
  field: CalculatorOutputValueField,
): string[] => (field.itemFields ?? []).map((itemField) => itemField.key)
