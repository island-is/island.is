import type {
  CalculatorConfig,
  CalculatorInputSection,
  CalculatorLocalizedMarkdown,
  CalculatorLocalizedText,
  CalculatorOutputSection,
  CalculatorOutputTotal,
} from '@island.is/tax-calculators'

import type { IdentityMap } from './issueIdentity'
import { OUTPUT_TOTAL_SECTION_KEY } from './issueIdentity'

export { OUTPUT_TOTAL_SECTION_KEY }

// Creates persisted identifiers.
export const generateKey = () => crypto.randomUUID()

export const emptyOutputTotal = (): CalculatorOutputTotal => ({
  uid: generateKey(),
  key: '',
  label: { is: '' },
})

export const createEmptyConfig = (): CalculatorConfig => ({
  inputSections: [],
  outputTotal: emptyOutputTotal(),
  outputSections: [],
})

export interface FilteredConfig {
  payload: CalculatorConfig
  identity: IdentityMap
}

const hasText = (value: string | undefined) => Boolean(value?.trim())

/* Icelandic text is required for persisted localized values. */
const filterText = (
  value: CalculatorLocalizedText | undefined,
): CalculatorLocalizedText | undefined => {
  if (!hasText(value?.is)) return undefined
  return hasText(value?.en)
    ? { is: value!.is, en: value!.en }
    : { is: value!.is }
}

/* Treats whitespace-only rich text as empty. */
const filterMarkdown = (
  value: CalculatorLocalizedMarkdown | undefined,
): CalculatorLocalizedMarkdown | undefined => {
  if (!hasText(value?.is)) return undefined
  return hasText(value?.en)
    ? { is: value!.is, en: value!.en }
    : { is: value!.is }
}

const filterInputSections = (
  sections: CalculatorInputSection[],
  identity: IdentityMap,
) => {
  /* Drops unlabelled toggles and their gates. */
  const persistedToggleKeys = new Set(
    sections
      .filter((section) => hasText(section.toggle?.label?.is))
      .map((section) => section.toggle!.key),
  )

  return sections.map((section, sectionIndex) => {
    identity.set(`inputSections.${sectionIndex}`, {
      tab: 'input',
      sectionKey: section.key,
    })

    const toggle = persistedToggleKeys.has(section.toggle?.key ?? '')
      ? { key: section.toggle!.key, label: filterText(section.toggle!.label)! }
      : undefined

    const gate =
      section.gate && persistedToggleKeys.has(section.gate.toggle)
        ? section.gate
        : undefined

    const fields = section.fields
      .filter((field) => hasText(field.key))
      .map((field, fieldIndex) => {
        identity.set(`inputSections.${sectionIndex}.fields.${fieldIndex}`, {
          tab: 'input',
          sectionKey: section.key,
          fieldUid: field.uid,
        })
        return {
          ...field,
          label: filterText(field.label),
          placeholder: filterText(field.placeholder),
        }
      })

    return { ...section, toggle, gate, fields }
  })
}

const filterOutputSections = (
  sections: CalculatorOutputSection[],
  identity: IdentityMap,
) =>
  sections.map((section, sectionIndex) => {
    identity.set(`outputSections.${sectionIndex}`, {
      tab: 'output',
      sectionKey: section.key,
    })

    const title = filterText(section.title)

    const fields = section.fields
      .filter((field) =>
        field.kind === 'content'
          ? hasText(field.content?.is)
          : hasText(field.key),
      )
      .map((field, fieldIndex) => {
        identity.set(`outputSections.${sectionIndex}.fields.${fieldIndex}`, {
          tab: 'output',
          sectionKey: section.key,
          fieldUid: field.uid,
        })

        if (field.kind === 'content') {
          return { ...field, content: filterMarkdown(field.content)! }
        }

        const itemFields = field.itemFields
          ?.filter((item) => hasText(item.key))
          .map((item, itemIndex) => {
            identity.set(
              `outputSections.${sectionIndex}.fields.${fieldIndex}.itemFields.${itemIndex}`,
              {
                tab: 'output',
                sectionKey: section.key,
                fieldUid: field.uid,
                itemUid: item.uid,
              },
            )
            return { ...item, label: filterText(item.label) }
          })

        return {
          ...field,
          label: filterText(field.label),
          itemFields,
        }
      })

    return {
      ...section,
      title,
      /* Drops accordions without titles. */
      variant:
        section.variant === 'accordion' && !title ? undefined : section.variant,
      fields,
    }
  })

/* Removes incomplete drafts while preserving unknown valid fields. */
export const filterConfigForPersistence = (
  config: CalculatorConfig,
): FilteredConfig => {
  const identity: IdentityMap = new Map()

  const outputTotal = config.outputTotal ?? emptyOutputTotal()
  identity.set('outputTotal', {
    tab: 'output',
    sectionKey: OUTPUT_TOTAL_SECTION_KEY,
    fieldUid: outputTotal.uid,
  })

  return {
    payload: {
      inputSections: filterInputSections(config.inputSections ?? [], identity),
      /* Keeps incomplete totals invalid. */
      outputTotal: { ...outputTotal, label: filterText(outputTotal.label)! },
      outputSections: filterOutputSections(
        config.outputSections ?? [],
        identity,
      ),
    },
    identity,
  }
}
