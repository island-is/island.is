import type {
  CalculatorConfig,
  CalculatorInputSection,
  CalculatorLocalizedMarkdown,
  CalculatorLocalizedText,
  CalculatorOutputSection,
  CalculatorOutputTotal,
} from '@island.is/tax-calculators'

// Persisted: a section's `key` and a field's `uid` are written into the
// entry and referenced by other sections, so this needs real uniqueness,
// not just per-render distinctness.
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

/* Which on-screen row a zod issue path belongs to. Zod paths are POSITIONAL and
 * index the FILTERED payload, while the UI renders the unfiltered draft state,
 * so a draft row earlier in the same list shifts every later index. Resolving
 * by position alone lands the error on the wrong control -- silently, and only
 * when a draft happens to precede an error. */
export interface RowIdentity {
  tab: 'input' | 'output'
  sectionKey: string
  fieldUid?: string
  itemUid?: string
}

/* The total has no section of its own, so it borrows the section slot: nothing
 * else can claim this key, and the editor renders it above the section list. */
export const OUTPUT_TOTAL_SECTION_KEY = 'outputTotal'

export type IdentityMap = Map<string, RowIdentity>

export interface FilteredConfig {
  payload: CalculatorConfig
  identity: IdentityMap
}

const hasText = (value: string | undefined) => Boolean(value?.trim())

/* A localized value is persistable only once Icelandic is filled in: the shared
 * schema puts `min(1)` on `is`, so `{ is: '', en: 'x' }` -- what typing English
 * first produces -- would invalidate the whole document rather than just its
 * own row. */
const filterText = (
  value: CalculatorLocalizedText | undefined,
): CalculatorLocalizedText | undefined => {
  if (!hasText(value?.is)) return undefined
  return hasText(value?.en)
    ? { is: value!.is, en: value!.en }
    : { is: value!.is }
}

/* `serializeAndFormat` can return whitespace for an empty document, so emptiness
 * is tested after trimming rather than against `''`. */
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
  /* A toggle is persisted only once it carries a label -- `sectionToggleSchema`
   * requires one, so an unlabelled toggle cannot be rescued by omitting a
   * sub-field the way an optional localized value can. A gate pointing at a
   * toggle that did not survive is dropped too, or the schema's cross-section
   * refinement fires with "no input section declares it". */
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
      /* An accordion without a persistable title is rejected by the schema, so
       * the variant is dropped rather than allowed to invalidate the document.
       * The checkbox is disabled in that state too; this covers the author who
       * ticks it and then clears the title. */
      variant:
        section.variant === 'accordion' && !title ? undefined : section.variant,
      fields,
    }
  })

/* Removes only incomplete draft rows and unpersistable localized values. This is
 * a PASSTHROUGH, not a whitelist: a schema-valid key it knows nothing about
 * survives untouched. */
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
      /* Deliberately unfiltered: an incomplete total is an error the author has
       * to resolve, not a draft row to drop -- dropping it would make the
       * required field silently pass. */
      outputTotal: { ...outputTotal, label: filterText(outputTotal.label)! },
      outputSections: filterOutputSections(
        config.outputSections ?? [],
        identity,
      ),
    },
    identity,
  }
}

/* Longest matching prefix, so an issue on a nested property (`...fields.2.key`)
 * resolves to the row that owns it rather than missing entirely. */
export const resolveIssuePath = (
  path: (string | number)[],
  identity: IdentityMap,
): RowIdentity | undefined => {
  for (let length = path.length; length > 0; length -= 1) {
    const found = identity.get(path.slice(0, length).join('.'))
    if (found) return found
  }
  return undefined
}
