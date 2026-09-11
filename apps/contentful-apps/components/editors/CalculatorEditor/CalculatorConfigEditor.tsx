import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { FieldExtensionSDK, ValidationError } from '@contentful/app-sdk'
import {
  Button,
  Note,
  Paragraph,
  Stack,
  Tabs,
} from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import type { CalculatorConfig } from '@island.is/tax-calculators'

import type {
  GetTaxCalculatorFieldsForContentfulAppQuery,
  GetTaxCalculatorFieldsForContentfulAppQueryVariables,
} from '../../../graphql/schema'
import { TaxCalculatorOutputFieldType } from '../../../graphql/schema'
import { InputSection } from './components/InputSection'
import { OutputSection } from './components/OutputSection'
import { useCalculatorConfig } from './hooks/useCalculatorConfig'
import { GET_TAX_CALCULATOR_FIELDS, toApiCalculatorType } from './constants'
import {
  InputFieldContract,
  OutputFieldContract,
  toInputContractField,
  toOutputContractField,
} from './types'

// Every entry of the `calculator` content type IS a calculator, so -- unlike
// ConnectedComponent's shared configJson field, which also serves unrelated
// embed types -- no sibling `type` gate or plain-JSON fallback is needed.
export const CalculatorConfigEditor = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [calculatorTypeValue, setCalculatorTypeValue] = useState<string>(
    sdk.entry.fields.type?.getValue() ?? '',
  )
  const [isDisabled, setIsDisabled] = useState(false)
  const [schemaErrors, setSchemaErrors] = useState<ValidationError[]>([])

  /* Plain `startAutoResizer()`, deliberately not `{ absoluteElements: true }`:
   * the SDK documents an infinite resize loop for that option with transformed
   * children, which is exactly what a drag preview is. */
  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => sdk.window.stopAutoResizer()
  }, [sdk.window])

  useEffect(
    () =>
      sdk.entry.fields.type?.onValueChanged((value: string | undefined) =>
        setCalculatorTypeValue(value ?? ''),
      ),
    [sdk.entry.fields.type],
  )

  /* Both `on*Changed` callbacks fire immediately with the current value, so no
   * separate `getIsDisabled()` / `getSchemaErrors()` read is needed. Both
   * return an unsubscribe, returned here as the effect cleanup. */
  useEffect(() => sdk.field.onIsDisabledChanged(setIsDisabled), [sdk.field])
  useEffect(
    () => sdk.field.onSchemaErrorsChanged(setSchemaErrors),
    [sdk.field],
  )

  const apiCalculatorType = toApiCalculatorType(calculatorTypeValue)

  const { data, loading, error, refetch } = useQuery<
    GetTaxCalculatorFieldsForContentfulAppQuery,
    GetTaxCalculatorFieldsForContentfulAppQueryVariables
  >(GET_TAX_CALCULATOR_FIELDS, {
    variables: apiCalculatorType ? { type: apiCalculatorType } : undefined,
    skip: !apiCalculatorType,
  })

  /* The raw selections are unions keyed on `__typename`; the normalizers in
   * types.ts are the only code that touches them. */
  const inputContract: InputFieldContract = useMemo(
    () =>
      new Map(
        (data?.taxCalculator.inputFields ?? []).map((field) => {
          const normalized = toInputContractField(field)
          return [normalized.key, normalized]
        }),
      ),
    [data],
  )

  const outputContract: OutputFieldContract = useMemo(
    () =>
      new Map(
        (data?.taxCalculator.outputFields ?? []).map((field) => {
          const normalized = toOutputContractField(field)
          return [normalized.key, normalized]
        }),
      ),
    [data],
  )

  const metadataChecked = Boolean(data) && !loading && !error

  /* Publishing is a release to production, so it must never be possible for
   * content that is unfinished OR unverified. "We could not check" is therefore
   * treated exactly like "we found a problem": both block publish. Saving is
   * unaffected either way -- the draft keeps the editor's work.
   *
   * This covers an unknown calculator type too: the query is skipped there, so
   * nothing is ever verified and publish must stay blocked rather than fall
   * through as if checked.
   *
   * Note this only ever BLOCKS. Nothing in this widget calls publish() --
   * releasing stays a human action, and clearing the flag merely permits it. */
  const metadataUnverified =
    Boolean(calculatorTypeValue) &&
    (!apiCalculatorType || !data || loading || Boolean(error))

  /* Computed over whichever config is being persisted, so the hook can call it
   * inside the one debounce that owns `setInvalid`. Memoized on the contracts
   * rather than rebuilt per render, since it walks every section in both tabs. */
  const validateMetadata = useCallback(
    (config: CalculatorConfig) => {
      if (metadataUnverified) return true
      /* Reached only when no calculator type is selected at all -- the entry's
       * own required-field validation covers that case. */
      if (!metadataChecked) return false

      const inputSections = config.inputSections ?? []
      const outputSections = config.outputSections ?? []

      const placedInputKeys = new Set(
        inputSections.flatMap((section) =>
          section.fields.map((field) => field.key).filter(Boolean),
        ),
      )

      const missingRequired = [...inputContract.values()].some(
        (field) => field.required && !placedInputKeys.has(field.key),
      )
      if (missingRequired) return true

      const staleInput = inputSections.some((section) =>
        section.fields.some(
          (field) => field.key && !inputContract.has(field.key),
        ),
      )
      if (staleInput) return true

      return outputSections.some((section) =>
        section.fields.some((field) => {
          if (!field.key) return false
          const meta = outputContract.get(field.key)
          if (!meta) return true
          const items = field.itemFields ?? []
          if (items.length === 0) return false
          if (meta.type !== TaxCalculatorOutputFieldType.Array) return true
          const allowed = new Set(
            (meta.itemFields ?? []).map((item) => item.key),
          )
          return items.some((item) => item.key && !allowed.has(item.key))
        }),
      )
    },
    [metadataUnverified, metadataChecked, inputContract, outputContract],
  )

  const state = useCalculatorConfig(sdk, calculatorTypeValue, {
    validateMetadata,
    isDisabled,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    /* Without this, reordering is mouse-only -- and drag is the only
     * reordering affordance this editor offers. */
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const usedInputKeys = useMemo(
    () =>
      new Set(
        state.inputSections.flatMap((section) =>
          section.fields.map((field) => field.key).filter(Boolean),
        ),
      ),
    [state.inputSections],
  )

  const findInput = (uid: string) => {
    for (let s = 0; s < state.inputSections.length; s += 1) {
      const index = state.inputSections[s].fields.findIndex(
        (field) => field.uid === uid,
      )
      if (index !== -1) return { section: s, index }
    }
    return undefined
  }

  const findOutput = (uid: string) => {
    for (let s = 0; s < state.outputSections.length; s += 1) {
      const index = state.outputSections[s].fields.findIndex(
        (field) => field.uid === uid,
      )
      if (index !== -1) return { section: s, index }
    }
    return undefined
  }

  const onInputDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = findInput(String(active.id))
    if (!from) return

    const emptyTarget = String(over.id).startsWith('input-empty-')
    if (emptyTarget) {
      const sectionKey = String(over.id).replace('input-empty-', '')
      const to = state.inputSections.findIndex(
        (section) => section.key === sectionKey,
      )
      if (to === -1) return
      state.moveInputField(from.section, from.index, to, 0)
      return
    }

    const target = findInput(String(over.id))
    if (!target) return
    state.moveInputField(from.section, from.index, target.section, target.index)
  }

  const onOutputDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    /* Item fields reorder within their own array only, never across fields. */
    for (let s = 0; s < state.outputSections.length; s += 1) {
      const fields = state.outputSections[s].fields
      for (let f = 0; f < fields.length; f += 1) {
        const items = fields[f].itemFields ?? []
        const fromItem = items.findIndex((item) => item.uid === active.id)
        const toItem = items.findIndex((item) => item.uid === over.id)
        if (fromItem !== -1 && toItem !== -1) {
          state.reorder.outputItemField(s, f, fromItem, toItem)
          return
        }
        if (fromItem !== -1) return
      }
    }

    const from = findOutput(String(active.id))
    if (!from) return

    const emptyTarget = String(over.id).startsWith('output-empty-')
    if (emptyTarget) {
      const sectionKey = String(over.id).replace('output-empty-', '')
      const to = state.outputSections.findIndex(
        (section) => section.key === sectionKey,
      )
      if (to === -1) return
      state.moveOutputField(from.section, from.index, to, 0)
      return
    }

    const target = findOutput(String(over.id))
    if (!target) return
    state.moveOutputField(from.section, from.index, target.section, target.index)
  }

  if (!calculatorTypeValue) {
    return (
      <Paragraph>
        Select a calculator type on this entry to configure sections.
      </Paragraph>
    )
  }

  return (
    <Stack flexDirection="column" alignItems="stretch" spacing="spacingM">
      {error && (
        <Note variant="warning">
          Could not load the field list for this calculator type:{' '}
          {error.message} Your work is still saved, but publishing stays blocked
          until the field metadata loads and the configuration can be checked
          against it.{' '}
          <Button size="small" variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        </Note>
      )}

      {!error && loading && (
        <Note variant="neutral">
          Checking the configuration against this calculator&apos;s fields.
          Publishing stays blocked until that finishes; your work is saved
          meanwhile.
        </Note>
      )}

      {!apiCalculatorType && (
        <Note variant="warning">
          Unknown calculator type &quot;{calculatorTypeValue}&quot; -- no field
          list exists for it, so the configuration cannot be checked and
          publishing stays blocked.
        </Note>
      )}

      {/* A successful response can still carry empty lists. Without this the
       * editor faces a dropdown holding nothing but its own placeholder, and no
       * way to tell that apart from a query still in flight. */}
      {metadataChecked && inputContract.size === 0 && (
        <Note variant="warning">
          This calculator returned no input fields, so there is nothing to place
          in an input section yet.
        </Note>
      )}
      {metadataChecked && outputContract.size === 0 && (
        <Note variant="warning">
          This calculator returned no output fields, so there is nothing to
          place in an output section yet.
        </Note>
      )}

      {schemaErrors.length > 0 && (
        <Note variant="negative">
          Contentful rejects this field&apos;s value. Publishing stays blocked
          until it is resolved.
        </Note>
      )}

      {state.saveError && (
        <Note variant="negative">
          This configuration is invalid and has not been saved.
          {state.topLevelIssues.length > 0 && (
            <> Check: {state.topLevelIssues.join(', ')}</>
          )}
        </Note>
      )}

      {/* Only the CONFIRMED-mismatch case: the unverified cases have their own
        * notes above, and `metadataInvalid` is true for those too. */}
      {metadataChecked && state.metadataInvalid && (
        <Note variant="warning">
          Some fields do not match this calculator. Your work is saved, but
          publishing stays blocked until they are resolved.
        </Note>
      )}

      <Tabs defaultTab="input">
        <Tabs.List>
          <Tabs.Tab panelId="input">
            Input sections ({state.inputSections.length})
          </Tabs.Tab>
          <Tabs.Tab panelId="output">
            Output sections ({state.outputSections.length})
          </Tabs.Tab>
        </Tabs.List>

        {/* `forceMount`: Forma 36's panel is Radix `Tabs.Content`, which
         * unmounts the inactive panel by default -- that would reset every
         * uncontrolled markdown editor's undo history and remount the DnD
         * context on each tab switch. */}
        <Tabs.Panel id="input" forceMount>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onInputDragEnd}
          >
            <Stack
              flexDirection="column"
              alignItems="stretch"
              spacing="spacingM"
              marginTop="spacingM"
            >
              {state.inputSections.map((section, sectionIndex) => (
                <InputSection
                  key={section.key}
                  section={section}
                  position={sectionIndex + 1}
                  contract={inputContract}
                  usedKeys={usedInputKeys}
                  isLoading={loading}
                  isDisabled={isDisabled}
                  rowIssues={state.rowIssues}
                  duplicateUids={state.duplicateUids}
                  otherToggles={state.otherToggles(sectionIndex)}
                  actions={state.inputSectionActions(sectionIndex)}
                />
              ))}
              <Button
                startIcon={<PlusIcon />}
                isDisabled={isDisabled}
                onClick={state.addInputSection}
              >
                Add input section
              </Button>
            </Stack>
          </DndContext>
        </Tabs.Panel>

        <Tabs.Panel id="output" forceMount>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onOutputDragEnd}
          >
            <Stack
              flexDirection="column"
              alignItems="stretch"
              spacing="spacingM"
              marginTop="spacingM"
            >
              {state.outputSections.map((section, sectionIndex) => (
                <OutputSection
                  key={section.key}
                  section={section}
                  position={sectionIndex + 1}
                  contract={outputContract}
                  isLoading={loading}
                  isDisabled={isDisabled}
                  rowIssues={state.rowIssues}
                  dialogs={sdk.dialogs}
                  actions={state.outputSectionActions(sectionIndex)}
                />
              ))}
              <Button
                startIcon={<PlusIcon />}
                isDisabled={isDisabled}
                onClick={state.addOutputSection}
              >
                Add output section
              </Button>
            </Stack>
          </DndContext>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
