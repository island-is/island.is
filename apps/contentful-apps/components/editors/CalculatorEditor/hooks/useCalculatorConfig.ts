import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'

import type {
  CalculatorConfig,
  CalculatorInputSection,
  CalculatorInputSectionField,
  CalculatorOutputItemField,
  CalculatorOutputSection,
  CalculatorOutputSectionField,
  CalculatorOutputTotal,
  CalculatorOutputValueField,
  CalculatorSectionToggle,
} from '@island.is/tax-calculators'
import {
  calculatorConfigSchema,
  collectInputSectionToggles,
} from '@island.is/tax-calculators'

import { DEBOUNCE_TIME } from './constants'
import type { OutputContractItemField } from '../contract'
import { resolveIssuePath, type RowIdentity } from '../issueIdentity'
import type {
  InputSectionActions,
  OutputSectionActions,
} from '../types'
import {
  createEmptyConfig,
  emptyOutputTotal,
  filterConfigForPersistence,
  generateKey,
} from '../utils'

const moveWithin = <T>(items: T[], from: number, to: number): T[] => {
  const next = items.slice()
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

const emptyInputSection = (): CalculatorInputSection => ({
  key: generateKey(),
  fields: [],
})

const emptyOutputSection = (): CalculatorOutputSection => ({
  key: generateKey(),
  fields: [],
})

/* Narrows output rows that support item fields. */
const atValueField = (
  fields: CalculatorOutputSectionField[],
  fieldIndex: number,
  mapper: (field: CalculatorOutputValueField) => CalculatorOutputValueField,
): CalculatorOutputSectionField[] =>
  fields.map((field, i) =>
    i === fieldIndex && field.kind === 'value' ? mapper(field) : field,
  )

export const useCalculatorConfig = (
  sdk: FieldExtensionSDK,
  calculatorTypeValue: string,
  {
    validateMetadata,
    isDisabled,
  }: {
    /* Validates the debounced config. */
    validateMetadata: (config: CalculatorConfig) => boolean
    isDisabled: boolean
  },
) => {
  /* Backfills identifiers required by the editor schema. */
  const [config, setConfig] = useState<CalculatorConfig>(() => {
    const stored = sdk.field.getValue()
    if (!stored) return createEmptyConfig()

    const withKeys = <T extends { key?: string }>(section: T) => ({
      ...section,
      key: section.key || generateKey(),
    })
    const withUid = <T extends { uid?: string }>(row: T) => ({
      ...row,
      uid: row.uid || generateKey(),
    })

    return {
      inputSections: Array.isArray(stored.inputSections)
        ? stored.inputSections.map((section: CalculatorInputSection) => ({
            ...withKeys(section),
            fields: (section.fields ?? []).map(withUid),
          }))
        : [],
      outputTotal: stored.outputTotal
        ? { ...withUid(stored.outputTotal) }
        : emptyOutputTotal(),
      outputSections: Array.isArray(stored.outputSections)
        ? stored.outputSections.map((section: CalculatorOutputSection) => ({
            ...withKeys(section),
            fields: (section.fields ?? []).map(
              (field: CalculatorOutputSectionField) => ({
                ...withUid(field),
                kind: field.kind ?? 'value',
                ...(field.kind !== 'content'
                  ? { itemFields: field.itemFields?.map(withUid) }
                  : {}),
              }),
            ),
          }))
        : [],
    }
  })

  /* Prevents auto-creation after a later type change. */
  const hadStoredValueAtMount = useRef(Boolean(sdk.field.getValue()))

  const [saveError, setSaveError] = useState(false)
  const [metadataInvalid, setMetadataInvalid] = useState(false)
  const [rowIssues, setRowIssues] = useState<Map<string, string[]>>(new Map())
  const [topLevelIssues, setTopLevelIssues] = useState<string[]>([])

  const inputSections = config.inputSections ?? []
  const outputSections = config.outputSections ?? []

  /* Detects duplicate keys before draft rows are filtered. */
  const duplicateUids = useMemo(() => {
    const seen = new Map<string, string>()
    const duplicates = new Set<string>()
    inputSections.forEach((section) =>
      section.fields.forEach((field) => {
        if (!field.key) return
        const first = seen.get(field.key)
        if (first) {
          duplicates.add(first)
          duplicates.add(field.uid)
          return
        }
        seen.set(field.key, field.uid)
      }),
    )
    return duplicates
  }, [inputSections])

  useDebounce(
    () => {
      const { payload, identity } = filterConfigForPersistence(config)
      const result = calculatorConfigSchema.safeParse(payload)
      /* Contentful's non-strict TypeScript config does not narrow Zod results. */
      const schemaInvalid = 'error' in result
      const metadataMismatch = validateMetadata(config)
      setMetadataInvalid(metadataMismatch)

      /* Combines all publish-blocking conditions. */
      sdk.field.setInvalid(
        schemaInvalid || metadataMismatch || duplicateUids.size > 0,
      )
      setSaveError(schemaInvalid)

      if (schemaInvalid) {
        const rows = new Map<string, string[]>()
        const top: string[] = []
        result.error.issues.forEach((issue) => {
          const owner: RowIdentity | undefined = resolveIssuePath(
            issue.path,
            identity,
          )
          const id = owner?.itemUid ?? owner?.fieldUid ?? owner?.sectionKey
          if (!id) {
            top.push(issue.message)
            return
          }
          rows.set(id, [...(rows.get(id) ?? []), issue.message])
        })
        setRowIssues(rows)
        setTopLevelIssues([...new Set(top)])
        return
      }

      setRowIssues(new Map())
      setTopLevelIssues([])

      /* Avoids writes to read-only fields. */
      if (isDisabled) return

      /* Avoids saving unchanged normalized values. */
      if (JSON.stringify(sdk.field.getValue()) === JSON.stringify(result.data))
        return

      /* Surfaces failed saves. */
      sdk.field.setValue(result.data).catch(() => {
        sdk.notifier.error('Could not save the calculator configuration.')
      })
    },
    DEBOUNCE_TIME,
    /* Revalidates metadata and duplicate identifiers. */
    [config, validateMetadata, duplicateUids, isDisabled],
  )

  useEffect(() => {
    if (!calculatorTypeValue || isDisabled) return
    if (hadStoredValueAtMount.current) return
    setConfig((prev) =>
      (prev.inputSections ?? []).length === 0 &&
      (prev.outputSections ?? []).length === 0
        ? {
            inputSections: [emptyInputSection()],
            outputSections: [emptyOutputSection()],
          }
        : prev,
    )
  }, [calculatorTypeValue, isDisabled])

  const mapInput = (
    mapper: (sections: CalculatorInputSection[]) => CalculatorInputSection[],
  ) =>
    setConfig((prev) => ({
      ...prev,
      inputSections: mapper(prev.inputSections ?? []),
    }))

  const mapOutput = (
    mapper: (sections: CalculatorOutputSection[]) => CalculatorOutputSection[],
  ) =>
    setConfig((prev) => ({
      ...prev,
      outputSections: mapper(prev.outputSections ?? []),
    }))

  const mapInputFields = (
    index: number,
    mapper: (
      fields: CalculatorInputSectionField[],
    ) => CalculatorInputSectionField[],
  ) =>
    mapInput((current) =>
      current.map((section, i) =>
        i === index ? { ...section, fields: mapper(section.fields) } : section,
      ),
    )

  const mapOutputFields = (
    index: number,
    mapper: (
      fields: CalculatorOutputSectionField[],
    ) => CalculatorOutputSectionField[],
  ) =>
    mapOutput((current) =>
      current.map((section, i) =>
        i === index ? { ...section, fields: mapper(section.fields) } : section,
      ),
    )

  const otherToggles = (index: number): CalculatorSectionToggle[] =>
    collectInputSectionToggles(config).filter(
      (toggle) => toggle.key !== inputSections[index]?.toggle?.key,
    )

  const newToggle = (): CalculatorSectionToggle => ({
    key: generateKey(),
    label: { is: '' },
  })

  const inputSectionActions = (index: number): InputSectionActions => ({
    update: (patch) =>
      mapInput((current) =>
        current.map((section, i) =>
          i === index ? { ...section, ...patch } : section,
        ),
      ),
    remove: () => mapInput((current) => current.filter((_, i) => i !== index)),
    addField: () =>
      mapInputFields(index, (fields) =>
        fields.concat({ uid: generateKey(), key: '', span: 12 }),
      ),
    updateField: (fieldIndex, patch) =>
      mapInputFields(index, (fields) =>
        fields.map((field, i) =>
          i === fieldIndex ? { ...field, ...patch } : field,
        ),
      ),
    removeField: (fieldIndex) =>
      mapInputFields(index, (fields) =>
        fields.filter((_, i) => i !== fieldIndex),
      ),
    enableToggle: () =>
      mapInput((current) =>
        current.map((section, i) =>
          i === index ? { ...section, toggle: newToggle() } : section,
        ),
      ),
    disableToggle: () =>
      mapInput((current) =>
        current.map((section, i) =>
          i === index
            ? { ...section, toggle: undefined, gate: undefined }
            : section,
        ),
      ),
    setGate: (toggleKey) =>
      mapInput((current) =>
        current.map((section, i) =>
          i === index
            ? toggleKey
              ? { ...section, toggle: undefined, gate: { toggle: toggleKey } }
              : { ...section, toggle: newToggle(), gate: undefined }
            : section,
        ),
      ),
    setToggleLabel: (label) =>
      mapInput((current) =>
        current.map((section, i) =>
          i === index
            ? {
                ...section,
                toggle: {
                  // Section gates reference keys, not labels.
                  key: section.toggle?.key ?? generateKey(),
                  label: label ?? { is: '' },
                },
              }
            : section,
        ),
      ),
    toggleGateDisableOnly: () =>
      mapInput((current) =>
        current.map((section, i) =>
          i === index && section.gate
            ? {
                ...section,
                gate: {
                  toggle: section.gate.toggle,
                  disableOnly: !section.gate.disableOnly,
                },
              }
            : section,
        ),
      ),
  })

  const outputSectionActions = (index: number): OutputSectionActions => ({
    update: (patch) =>
      mapOutput((current) =>
        current.map((section, i) =>
          i === index ? { ...section, ...patch } : section,
        ),
      ),
    remove: () => mapOutput((current) => current.filter((_, i) => i !== index)),
    addValueField: () =>
      mapOutputFields(index, (fields) =>
        fields.concat({ uid: generateKey(), kind: 'value', key: '' }),
      ),
    addContentField: () =>
      mapOutputFields(index, (fields) =>
        fields.concat({
          uid: generateKey(),
          kind: 'content',
          content: { is: '' },
        }),
      ),
    updateField: (fieldIndex, patch) =>
      mapOutputFields(index, (fields) =>
        fields.map((field, i) => {
          if (i !== fieldIndex) return field
          const next = { ...field, ...patch }
          /* Item fields belong to the selected array. */
          if (
            next.kind === 'value' &&
            field.kind === 'value' &&
            'key' in patch &&
            patch.key !== field.key
          ) {
            delete next.itemFields
          }
          return next
        }),
      ),
    removeField: (fieldIndex) =>
      mapOutputFields(index, (fields) =>
        fields.filter((_, i) => i !== fieldIndex),
      ),
    addItemField: (fieldIndex) =>
      mapOutputFields(index, (fields) =>
        atValueField(fields, fieldIndex, (field) => ({
          ...field,
          itemFields: (field.itemFields ?? []).concat({
            uid: generateKey(),
            key: '',
          }),
        })),
      ),
    addAllItemFields: (fieldIndex, available: OutputContractItemField[]) =>
      mapOutputFields(index, (fields) =>
        atValueField(fields, fieldIndex, (field) => {
          const used = new Set((field.itemFields ?? []).map((item) => item.key))
          return {
            ...field,
            itemFields: (field.itemFields ?? []).concat(
              available
                .filter((item) => !used.has(item.key))
                .map((item) => ({ uid: generateKey(), key: item.key })),
            ),
          }
        }),
      ),
    updateItemField: (fieldIndex, itemIndex, patch) =>
      mapOutputFields(index, (fields) =>
        atValueField(fields, fieldIndex, (field) => ({
          ...field,
          itemFields: (field.itemFields ?? []).map((item, j) =>
            j === itemIndex ? { ...item, ...patch } : item,
          ),
        })),
      ),
    removeItemField: (fieldIndex, itemIndex) =>
      mapOutputFields(index, (fields) =>
        atValueField(fields, fieldIndex, (field) => ({
          ...field,
          itemFields: (field.itemFields ?? []).filter(
            (_, j) => j !== itemIndex,
          ),
        })),
      ),
  })

  const reorder = {
    inputSection: (from: number, to: number) =>
      mapInput((current) => moveWithin(current, from, to)),
    outputSection: (from: number, to: number) =>
      mapOutput((current) => moveWithin(current, from, to)),
    outputItemField: (
      sectionIndex: number,
      fieldIndex: number,
      from: number,
      to: number,
    ) =>
      mapOutputFields(sectionIndex, (fields) =>
        atValueField(fields, fieldIndex, (field) => ({
          ...field,
          itemFields: moveWithin(field.itemFields ?? [], from, to),
        })),
      ),
  }

  /* Moves fields between sections atomically. */
  const moveInputField = (
    fromSection: number,
    fromIndex: number,
    toSection: number,
    toIndex: number,
  ) =>
    mapInput((current) => {
      const moved = current[fromSection]?.fields[fromIndex]
      if (!moved) return current
      return current.map((section, i) => {
        let fields = section.fields
        if (i === fromSection) fields = fields.filter((_, j) => j !== fromIndex)
        if (i === toSection) {
          const at =
            fromSection === toSection && fromIndex < toIndex
              ? toIndex - 1
              : toIndex
          fields = [...fields.slice(0, at), moved, ...fields.slice(at)]
        }
        return fields === section.fields ? section : { ...section, fields }
      })
    })

  const moveOutputField = (
    fromSection: number,
    fromIndex: number,
    toSection: number,
    toIndex: number,
  ) =>
    mapOutput((current) => {
      const moved = current[fromSection]?.fields[fromIndex]
      if (!moved) return current
      return current.map((section, i) => {
        let fields = section.fields
        if (i === fromSection) fields = fields.filter((_, j) => j !== fromIndex)
        if (i === toSection) {
          const at =
            fromSection === toSection && fromIndex < toIndex
              ? toIndex - 1
              : toIndex
          fields = [...fields.slice(0, at), moved, ...fields.slice(at)]
        }
        return fields === section.fields ? section : { ...section, fields }
      })
    })

  return {
    inputSections,
    outputSections,
    saveError,
    metadataInvalid,
    rowIssues,
    topLevelIssues,
    duplicateUids,
    addInputSection: () =>
      mapInput((current) => current.concat(emptyInputSection())),
    addOutputSection: () =>
      mapOutput((current) => current.concat(emptyOutputSection())),
    outputTotal: config.outputTotal ?? emptyOutputTotal(),
    outputTotalActions: {
      update: (patch: Partial<CalculatorOutputTotal>) =>
        setConfig((prev) => ({
          ...prev,
          outputTotal: {
            ...(prev.outputTotal ?? emptyOutputTotal()),
            ...patch,
          },
        })),
    },
    otherToggles,
    inputSectionActions,
    outputSectionActions,
    reorder,
    moveInputField,
    moveOutputField,
  }
}
