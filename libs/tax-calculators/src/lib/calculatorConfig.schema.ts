import { z } from 'zod'

// Conditional visibility is a pure authoring concept: every gate points at a
// toggle switch the editor declared in Contentful, never at a form field's
// value. That keeps it independent of what any calculator's backend field
// list happens to contain, and of how a value stringifies.
const sectionGateSchema = z.object({
  // `key` of a toggle declared on some other input section in the same config.
  toggle: z.string().min(1),
  // While the toggle is on, the section is removed. Set this instead to keep
  // it visible with its fields greyed out (Bílnúmer under "Slá inn þyngd og
  // losun", in the vehicle-tax design).
  disableOnly: z.boolean().optional(),
})

/* Every piece of editor-authored display text is a bilingual pair, authored
 * directly here rather than through a linked translation namespace -- the
 * backend has no opinion on this text at all, it only ever deals in
 * normalized keys, so there's no reason for the two languages to live in
 * different places. `configJson` itself stays a single, non-localized,
 * shared-across-locales blob so section/field structure is authored once.
 *
 * Neither language may be an empty string: an empty label renders as a blank
 * where a label belongs, which is the same silent failure that forbidding raw
 * keys as public labels exists to prevent. Omit the text instead. */
const localizedTextSchema = z.object({
  is: z.string().min(1),
  en: z.string().min(1).optional(),
})

/* Structurally identical to localizedTextSchema, and deliberately its own
 * object rather than an alias: the two can then diverge (a markdown length
 * cap, a stricter rule on plain text) without a rename, and the exported type
 * names say which of the two a consumer is holding. */
const localizedMarkdownSchema = z.object({
  is: z.string().min(1),
  en: z.string().min(1).optional(),
})

/* Row identity, for input, output and array item rows alike. `key` can't
 * serve: it is empty while the editor is drafting a row, before a backend
 * field has been picked -- even though a saved row always carries a non-empty
 * key. */
const rowUidSchema = z.string().min(1)

const inputSectionFieldSchema = z.object({
  // See rowUidSchema.
  uid: rowUidSchema,
  key: z.string().min(1),
  // Editor-authored display label. The backend supplies no label of its own --
  // TaxCalculator.inputFields publishes only the input contract (key, type,
  // required, dependsOn, and options on select fields), so an unset label
  // means the field renders without one.
  label: localizedTextSchema.optional(),
  placeholder: localizedTextSchema.optional(),
  span: z.number().int().min(1).max(12),
})

// A switch rendered above the input section that declares it. The section is
// hidden until the switch is turned on; other sections react to the same
// switch by referencing its `key` in their own `gate`.
const sectionToggleSchema = z.object({
  key: z.string().min(1),
  label: localizedTextSchema,
})

const inputSectionSchema = z.object({
  key: z.string().min(1),
  title: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  toggle: sectionToggleSchema.optional(),
  // Reacts to a toggle declared on a different section. Conditional
  // behaviour lives at the section level, not per-field -- a field that
  // needs its own gate gets its own single-field section instead.
  gate: sectionGateSchema.optional(),
  fields: z.array(inputSectionFieldSchema),
})

// One scalar inside an array output's repeating group, placed explicitly so an
// item field the editor did not place is not rendered.
const outputItemFieldSchema = z.object({
  // See rowUidSchema.
  uid: rowUidSchema,
  key: z.string().min(1),
  label: localizedTextSchema.optional(),
})

/* Unlike an input field, the same output `key` may be placed more than once:
 * there is nothing to submit, and the result designs repeat a value
 * deliberately -- a total shown prominently at the top and again inside an
 * accordion breakdown. `uid` is what tells the two placements apart, so it is
 * the only identity that has to be unique. */
const outputSectionFieldSchema = z
  .object({
    // See rowUidSchema.
    uid: rowUidSchema,
    key: z.string().min(1),
    label: localizedTextSchema.optional(),
    // 'emphasis' is for a prominent result value.
    variant: z.enum(['default', 'emphasis']).optional(),
    // Only ever set for an array output: which scalars of each item to render,
    // in order. Whether the output field actually is an array needs live
    // domain metadata, so that join is the editor's and the renderer's to
    // check, not this schema's.
    itemFields: z.array(outputItemFieldSchema).optional(),
  })
  .superRefine((field, ctx) => {
    const seenUids = new Set<string>()
    const seenKeys = new Set<string>()

    field.itemFields?.forEach((itemField, itemIndex) => {
      if (seenUids.has(itemField.uid)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['itemFields', itemIndex, 'uid'],
          message: `Duplicate item field uid "${itemField.uid}"`,
        })
      }
      seenUids.add(itemField.uid)

      if (seenKeys.has(itemField.key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['itemFields', itemIndex, 'key'],
          message: `Duplicate item field key "${itemField.key}"`,
        })
      }
      seenKeys.add(itemField.key)
    })
  })

/* An accordion is a disclosure control, so it needs something to click: with
 * no title there is no label to render, and a raw key is not an acceptable
 * public one. */
const outputSectionSchema = z
  .object({
    key: z.string().min(1),
    title: localizedTextSchema.optional(),
    // Section-level explanatory copy: paragraphs, lists and links.
    content: localizedMarkdownSchema.optional(),
    variant: z.enum(['default', 'accordion']).optional(),
    // Dividers are section-level presentation rather than standalone blocks,
    // so a rule between two sections is authored on one of them.
    divider: z.enum(['none', 'before', 'after', 'both']).optional(),
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

/* Cross-section rules only; anything decidable from a single object is
 * refined on that object's own schema above.
 *
 * A gate naming a toggle that no longer exists reads as "off" on the web side,
 * so the section renders unconditionally -- a conditional section silently
 * becoming always-visible. Deleting the section that owned a toggle is all it
 * takes, so the reference has to be checked here rather than trusted. A
 * section gating on its own toggle is the same failure in a different guise:
 * the toggle resolves, but the section can never show the switch that reveals
 * it. */
export const calculatorConfigSchema = z
  .object({
    inputSections: z.array(inputSectionSchema),
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
    const seenOutputFieldUids = new Set<string>()

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
        if (seenOutputFieldUids.has(field.uid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['outputSections', sectionIndex, 'fields', fieldIndex, 'uid'],
            message: `Duplicate output field uid "${field.uid}"`,
          })
        }
        seenOutputFieldUids.add(field.uid)
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
export type CalculatorOutputSectionField = z.infer<
  typeof outputSectionFieldSchema
>
export type CalculatorOutputSection = z.infer<typeof outputSectionSchema>
export type CalculatorConfig = z.infer<typeof calculatorConfigSchema>

// Every toggle declared anywhere in the config, so a section's `gate` can be
// resolved (and the widget can offer the editor a list to pick from).
export const collectInputSectionToggles = (
  config: CalculatorConfig,
): CalculatorSectionToggle[] =>
  config.inputSections
    .map((section) => section.toggle)
    .filter((toggle): toggle is CalculatorSectionToggle => Boolean(toggle))

// In document order, and never deduped: input keys are unique by validation.
export const collectInputFieldKeys = (config: CalculatorConfig): string[] =>
  config.inputSections.flatMap((section) =>
    section.fields.map((field) => field.key),
  )

/* Which outputs are placed, rather than how many times -- a key placed in two
 * sections is one placed output, and every caller of this is asking whether a
 * key is placed at all (stale-key warnings, unplaced-output hints). */
export const collectOutputFieldKeys = (config: CalculatorConfig): string[] => [
  ...new Set(
    config.outputSections.flatMap((section) =>
      section.fields.map((field) => field.key),
    ),
  ),
]

// Empty for a scalar output, which carries no `itemFields` at all.
export const collectOutputItemFieldKeys = (
  field: CalculatorOutputSectionField,
): string[] => (field.itemFields ?? []).map((itemField) => itemField.key)
