import { z } from 'zod'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/shared'

const language = z
  .object({ is: z.string(), en: z.string().optional() })
  .passthrough()
const node = z
  .object({ id: z.string().uuid(), identifier: z.string() })
  .passthrough()
const listItem = node.extend({ displayOrder: z.number().int() })
const field = node
  .extend({
    name: language,
    displayOrder: z.number().int(),
    fieldType: z
      .string()
      .refine((value) => Object.values(FieldTypesEnum).includes(value)),
    informationText: language.nullish(),
    tooltip: language.nullish(),
    description: language.nullish(),
    fieldSettings: z
      .object({
        subLabel: language.nullish(),
        hasDescription: z.boolean().nullish(),
      })
      .passthrough()
      .nullish(),
    list: z.array(listItem).nullish(),
  })
  .transform(({ description, fieldSettings, ...field }) => {
    const { hasDescription: _hasDescription, ...settings } = fieldSettings ?? {}
    if (description) {
      if (
        field.fieldType === FieldTypesEnum.TEXTBOX ||
        field.fieldType === FieldTypesEnum.NUMBERBOX
      ) {
        field.tooltip ??= description
      } else if (field.fieldType === FieldTypesEnum.CHECKBOX) {
        settings.subLabel ??= description
      } else {
        field.informationText ??= description
      }
    }
    if (
      field.fieldType === FieldTypesEnum.CHECKBOX &&
      (['is', 'en'] as const).some((lang) => settings.subLabel?.[lang]?.trim())
    ) {
      settings.isLarge = true
    }
    return { ...field, fieldSettings: settings }
  })
const screen = node.extend({
  name: language,
  displayOrder: z.number().int(),
  fields: z.array(field),
})
const section = node.extend({
  name: language,
  displayOrder: z.number().int(),
  sectionType: z
    .string()
    .refine((value) => Object.values(SectionTypes).includes(value)),
  screens: z.array(screen),
})

export const formExportSchema = z.object({
  format: z.literal('island.is/form-system'),
  version: z.literal(1),
  form: node.extend({
    name: language,
    slug: z.string().nullish(),
    sections: z.array(section),
    dependencies: z
      .array(
        z.object({
          parentProp: z.string().uuid(),
          childProps: z.array(z.string().uuid()),
          isSelected: z.boolean(),
        }),
      )
      .nullish(),
    formCertificationTypes: z
      .array(z.object({ certificationTypeId: z.string() }).passthrough())
      .optional(),
  }),
})
