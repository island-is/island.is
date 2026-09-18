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

import { DEBOUNCE_TIME } from '../constants'
import {
  InputSectionActions,
  OutputContractItemField,
  OutputSectionActions,
} from '../types'
import {
  createEmptyConfig,
  emptyOutputTotal,
  filterConfigForPersistence,
  generateKey,
  resolveIssuePath,
  RowIdentity,
} from '../utils'

const moveWithin = <T,>(items: T[], from: number, to: number): T[] => {
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

/* Item fields exist only on value rows, so every item action maps through this
 * rather than narrowing at each call site. */
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
    /* A function, not a boolean, so the verdict is computed from the config
     * being persisted inside the debounce that owns `setInvalid`. Taking a
     * value would mean computing it from state this hook returns. */
    validateMetadata: (config: CalculatorConfig) => boolean
    isDisabled: boolean
  },
) => {
  /* `uid` and `key` are backfilled on load: the editor has no way to type one
   * in, so an entry missing them would fail safeParse forever and never save.
   * Old `{ sections: [...] }` values are not migrated -- opening such an entry
   * overwrites it, which is accepted because dev entries are disposable. */
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
      /* Opens with an empty total rather than throwing; invalid until
       * authored. */
      outputTotal: stored.outputTotal
        ? { ...withUid(stored.outputTotal) }
        : emptyOutputTotal(),
      outputSections: Array.isArray(stored.outputSections)
        ? stored.outputSections.map((section: CalculatorOutputSection) => ({
            ...withKeys(section),
            fields: (section.fields ?? []).map(
              (field: CalculatorOutputSectionField) => ({
                ...withUid(field),
                /* Rows predating the union carry no `kind`; all were values. */
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

  /* Captured at mount: the auto-create effect keys on `calculatorTypeValue`,
   * which can change later, by which point the debounce has already written a
   * value and a live `getValue()` would report it present. */
  const hadStoredValueAtMount = useRef(Boolean(sdk.field.getValue()))

  const [saveError, setSaveError] = useState(false)
  const [metadataInvalid, setMetadataInvalid] = useState(false)
  const [rowIssues, setRowIssues] = useState<Map<string, string[]>>(new Map())
  const [topLevelIssues, setTopLevelIssues] = useState<string[]>([])

  const inputSections = config.inputSections ?? []
  const outputSections = config.outputSections ?? []

  /* Checked against the UNFILTERED state: the schema sees only the filtered
   * payload, so two on-screen rows sharing a key would raise nothing until the
   * second was complete. */
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
      /* This app sets `strict: false`, which defeats zod's narrowing on
       * `success` -- reach for `error` directly. */
      const schemaInvalid = 'error' in result
      const metadataMismatch = validateMetadata(config)
      setMetadataInvalid(metadataMismatch)

      /* Single owner: `setInvalid` is last-one-wins, so every input to
       * publish-blocking is combined here and it is called nowhere else. */
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

      /* A read-only field must not be written to, or the auto-create effect
       * fires `setValue`, fails, and shows a save error for nothing. */
      if (isDisabled) return

      /* The debounce fires on mount too, and the filtered payload routinely
       * differs from what is stored, so without this guard merely opening an
       * entry marks it changed. */
      if (JSON.stringify(sdk.field.getValue()) === JSON.stringify(result.data))
        return

      /* Unhandled, a failed `setValue` promise looks like a successful save. */
      sdk.field.setValue(result.data).catch(() => {
        sdk.notifier.error('Could not save the calculator configuration.')
      })
    },
    DEBOUNCE_TIME,
    /* `validateMetadata` and `duplicateUids` change independently of `config`,
     * so `[config]` alone goes stale. Safe to widen only because of the
     * equality guard above. */
    [config, validateMetadata, duplicateUids, isDisabled],
  )

  // Give the editor something to start from, rather than requiring an extra
  // "Add section" click on every new entry.
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

  // A section never gates itself -- its own toggle already controls it.
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
                  // `key` is what other sections reference, so it has to
                  // survive relabelling.
                  key: section.toggle?.key ?? generateKey(),
                  label: label ?? { is: '' },
                },
              }
            : section,
        ),
      ),
    /* No `?? ''` fallback: `sectionGateSchema` requires min(1), and a gate
     * always has a toggle by the time this control renders. */
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
          /* A changed key makes item fields meaningless, so clear them rather
           * than leave them looking valid against the wrong array. */
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
          itemFields: (field.itemFields ?? []).filter((_, j) => j !== itemIndex),
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

  /* Fields move between sections, which `arrayMove` cannot express -- both
   * halves in one state update so they cannot tear. */
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
    addInputSection: () => mapInput((current) => current.concat(emptyInputSection())),
    addOutputSection: () =>
      mapOutput((current) => current.concat(emptyOutputSection())),
    outputTotal: config.outputTotal ?? emptyOutputTotal(),
    outputTotalActions: {
      update: (patch: Partial<CalculatorOutputTotal>) =>
        setConfig((prev) => ({
          ...prev,
          outputTotal: { ...(prev.outputTotal ?? emptyOutputTotal()), ...patch },
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
