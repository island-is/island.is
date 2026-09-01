import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'

import {
  calculatorConfigSchema,
  collectSectionToggles,
} from '@island.is/tax-calculators'
import type {
  CalculatorConfig,
  CalculatorFieldSection,
  CalculatorSectionField,
  CalculatorSectionToggle,
} from '@island.is/tax-calculators'

import { DEBOUNCE_TIME } from '../constants'
import { SectionActions } from '../types'
import { createEmptyConfig, generateKey } from '../utils'

type SectionMapper = (
  sections: CalculatorFieldSection[],
) => CalculatorFieldSection[]

export const useCalculatorConfig = (
  sdk: FieldExtensionSDK,
  calculatorTypeValue: string,
) => {
  /* `uid` became required after the first configs were authored, and the
   * editor has no way to type one in -- an entry missing it would fail
   * safeParse forever, so setValue would never fire and the widget would be
   * permanently unsaveable. Backfill on load instead. */
  const [config, setConfig] = useState<CalculatorConfig>(() => {
    const stored = sdk.field.getValue()
    if (!Array.isArray(stored?.sections)) return createEmptyConfig()
    return {
      ...stored,
      sections: stored.sections.map((section: CalculatorFieldSection) => ({
        ...section,
        key: section.key || generateKey(),
        fields: (section.fields ?? []).map((field: CalculatorSectionField) => ({
          ...field,
          uid: field.uid || generateKey(),
        })),
      })),
    }
  })
  const [saveError, setSaveError] = useState(false)
  const [invalidPaths, setInvalidPaths] = useState<string[]>([])

  useDebounce(
    () => {
      const result = calculatorConfigSchema.safeParse(config)
      /* This app sets `strict: false`, which defeats zod's discriminated-union
       * narrowing on `success` -- reach for the `error` key directly, and do it
       * once so the two consumers below cannot drift apart. */
      const isInvalid = 'error' in result
      sdk.field.setInvalid(isInvalid)
      setSaveError(isInvalid)
      if (isInvalid) {
        /* A root-level issue has an empty path, which would render as a blank
         * bullet; two issues on one field would render it twice. */
        setInvalidPaths([
          ...new Set(
            result.error.issues
              .map((issue) => issue.path.join('.'))
              .filter(Boolean),
          ),
        ])
        return
      }
      setInvalidPaths([])
      sdk.field.setValue(result.data)
    },
    DEBOUNCE_TIME,
    [config],
  )

  const sections = config.sections ?? []

  // Give the editor a section to start from, rather than requiring an extra
  // "Add section" click on every new entry.
  useEffect(() => {
    if (calculatorTypeValue && sections.length === 0) {
      setConfig((prev) => ({
        ...prev,
        sections: [{ key: generateKey(), fields: [] }],
      }))
    }
  }, [calculatorTypeValue])

  const mapSections = (mapper: SectionMapper) => {
    setConfig((prev) => ({ ...prev, sections: mapper(prev.sections ?? []) }))
  }

  const patchSection = (
    index: number,
    patch: Partial<CalculatorFieldSection>,
  ) => {
    mapSections((current) =>
      current.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    )
  }

  const mapFields = (
    index: number,
    mapper: (fields: CalculatorSectionField[]) => CalculatorSectionField[],
  ) => {
    mapSections((current) =>
      current.map((section, i) =>
        i === index ? { ...section, fields: mapper(section.fields) } : section,
      ),
    )
  }

  const addSection = () => {
    mapSections((current) => current.concat({ key: generateKey(), fields: [] }))
  }

  // Toggles are pure authoring constructs the editor names here, so a gate can
  // always be authored no matter what the calculator's backend field list
  // contains. A section never gates itself -- its own toggle already controls
  // it.
  const otherToggles = (index: number): CalculatorSectionToggle[] =>
    collectSectionToggles(config).filter(
      (toggle) => toggle.key !== sections[index]?.toggle?.key,
    )

  const newToggle = () => ({ key: generateKey(), label: { is: '' } })

  const sectionActions = (index: number): SectionActions => ({
    update: (patch) => patchSection(index, patch),
    remove: () =>
      mapSections((current) => current.filter((_, i) => i !== index)),
    addField: () =>
      mapFields(index, (fields) =>
        fields.concat({ uid: generateKey(), key: '', span: 12 }),
      ),
    updateField: (fieldIndex, patch) =>
      mapFields(index, (fields) =>
        fields.map((field, i) =>
          i === fieldIndex ? { ...field, ...patch } : field,
        ),
      ),
    removeField: (fieldIndex) =>
      mapFields(index, (fields) => fields.filter((_, i) => i !== fieldIndex)),
    enableToggle: () => patchSection(index, { toggle: newToggle() }),
    disableToggle: () =>
      patchSection(index, { toggle: undefined, gate: undefined }),
    setGate: (toggleKey) =>
      patchSection(
        index,
        toggleKey
          ? { toggle: undefined, gate: { toggle: toggleKey } }
          : { toggle: newToggle(), gate: undefined },
      ),
    setToggleLabel: (label) =>
      mapSections((current) =>
        current.map((section, i) =>
          i === index
            ? {
                ...section,
                toggle: {
                  // `key` is what other sections reference, so it has to
                  // survive relabelling.
                  key: section.toggle?.key ?? generateKey(),
                  label: label ?? { is: '' },
                },
              }
            : section,
        ),
      ),
    toggleGateDisableOnly: () =>
      mapSections((current) =>
        current.map((section, i) =>
          i === index
            ? {
                ...section,
                gate: {
                  toggle: section.gate?.toggle ?? '',
                  disableOnly: !section.gate?.disableOnly,
                },
              }
            : section,
        ),
      ),
  })

  return {
    sections,
    saveError,
    invalidPaths,
    addSection,
    otherToggles,
    sectionActions,
  }
}
