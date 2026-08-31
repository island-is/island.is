import { z } from 'zod'

// Conditional visibility is a pure authoring concept: every gate points at a
// toggle switch the editor declared in Contentful, never at a form field's
// value. That keeps it independent of what any calculator's backend field
// list happens to contain, and of how a value stringifies.
const sectionGateSchema = z.object({
  // `key` of a toggle declared on some other section in the same config.
  toggle: z.string().min(1),
  // While the toggle is on, the section is removed. Set this instead to keep
  // it visible with its fields greyed out (Bílnúmer under "Slá inn þyngd og
  // losun", in the vehicle-tax design).
  disableOnly: z.boolean().optional(),
})

// Every piece of editor-authored display text is a bilingual pair, authored
// directly here rather than through a linked translation namespace -- the
// backend has no opinion on this text at all, it only ever deals in
// normalized keys, so there's no reason for the two languages to live in
// different places. `configJson` itself stays a single, non-localized,
// shared-across-locales blob so section/field structure is authored once.
const localizedTextSchema = z.object({
  is: z.string(),
  en: z.string().optional(),
})

const sectionFieldSchema = z.object({
  key: z.string().min(1),
  // Editor-controlled display label. Falls back to the backend's own
  // (Icelandic-only) default label from taxCalculatorFields when unset.
  label: localizedTextSchema.optional(),
  placeholder: localizedTextSchema.optional(),
  span: z.number().int().min(1).max(12),
})

// A switch rendered above the section that declares it. The section is
// hidden until the switch is turned on; other sections react to the same
// switch by referencing its `key` in their own `gate`.
const sectionToggleSchema = z.object({
  key: z.string().min(1),
  label: localizedTextSchema,
})

const calculatorFieldSectionSchema = z.object({
  key: z.string().min(1),
  title: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  toggle: sectionToggleSchema.optional(),
  // Reacts to a toggle declared on a different section. Conditional
  // behaviour lives at the section level, not per-field -- a field that
  // needs its own gate gets its own single-field section instead.
  gate: sectionGateSchema.optional(),
  fields: z.array(sectionFieldSchema),
})

export const calculatorConfigSchema = z.object({
  sections: z.array(calculatorFieldSectionSchema),
})

export type CalculatorLocalizedText = z.infer<typeof localizedTextSchema>
export type CalculatorSectionToggle = z.infer<typeof sectionToggleSchema>
export type CalculatorSectionField = z.infer<typeof sectionFieldSchema>
export type CalculatorFieldSection = z.infer<
  typeof calculatorFieldSectionSchema
>
export type CalculatorConfig = z.infer<typeof calculatorConfigSchema>

// Every toggle declared anywhere in the config, so a section's `gate` can be
// resolved (and the widget can offer the editor a list to pick from).
export const collectSectionToggles = (
  config: CalculatorConfig,
): CalculatorSectionToggle[] =>
  config.sections
    .map((section) => section.toggle)
    .filter((toggle): toggle is CalculatorSectionToggle => Boolean(toggle))
