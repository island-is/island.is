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
import { OutputTotalEditor } from './components/OutputTotalEditor'
import { useCalculatorConfig } from './hooks/useCalculatorConfig'
import { GET_TAX_CALCULATOR_FIELDS, toApiCalculatorType } from './constants'
import {
  InputFieldContract,
  OutputFieldContract,
  toInputContractField,
  toOutputContractField,
} from './types'

export const CalculatorConfigEditor = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [calculatorTypeValue, setCalculatorTypeValue] = useState<string>(
    sdk.entry.fields.type?.getValue() ?? '',
  )
  const [activeTab, setActiveTab] = useState('input')
  const [isDisabled, setIsDisabled] = useState(false)
  const [schemaErrors, setSchemaErrors] = useState<ValidationError[]>([])

  /* Transformed drag previews loop with absoluteElements enabled. */
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

  /* Contentful change subscriptions provide the initial value. */
  useEffect(() => sdk.field.onIsDisabledChanged(setIsDisabled), [sdk.field])
  useEffect(() => sdk.field.onSchemaErrorsChanged(setSchemaErrors), [sdk.field])

  const apiCalculatorType = toApiCalculatorType(calculatorTypeValue)

  const { data, loading, error, refetch } = useQuery<
    GetTaxCalculatorFieldsForContentfulAppQuery,
    GetTaxCalculatorFieldsForContentfulAppQueryVariables
  >(GET_TAX_CALCULATOR_FIELDS, {
    variables: apiCalculatorType ? { type: apiCalculatorType } : undefined,
    skip: !apiCalculatorType,
  })

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

  /* Unverified metadata blocks publishing but not saving. */
  const metadataUnverified =
    Boolean(calculatorTypeValue) &&
    (!apiCalculatorType || !data || loading || Boolean(error))

  /* Validates the config currently being persisted. */
  const validateMetadata = useCallback(
    (config: CalculatorConfig) => {
      if (metadataUnverified) return true
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
          if (field.kind !== 'value' || !field.key) return false
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
    /* Enables keyboard reordering. */
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

    /* Item fields reorder only within their parent array. */
    for (let s = 0; s < state.outputSections.length; s += 1) {
      const fields = state.outputSections[s].fields
      for (let f = 0; f < fields.length; f += 1) {
        const field = fields[f]
        const items = (field.kind === 'value' && field.itemFields) || []
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
    state.moveOutputField(
      from.section,
      from.index,
      target.section,
      target.index,
    )
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

      {metadataChecked && state.metadataInvalid && (
        <Note variant="warning">
          Some fields do not match this calculator. Your work is saved, but
          publishing stays blocked until they are resolved.
        </Note>
      )}

      <Tabs currentTab={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab panelId="input">
            Input form ({state.inputSections.length} sections)
          </Tabs.Tab>
          <Tabs.Tab panelId="output">
            Result ({state.outputSections.length} sections)
          </Tabs.Tab>
        </Tabs.List>

        {/* Preserves markdown undo history across tab switches. */}
        <Tabs.Panel
          id="input"
          forceMount
          style={{ display: activeTab === 'input' ? undefined : 'none' }}
        >
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

        <Tabs.Panel
          id="output"
          forceMount
          style={{ display: activeTab === 'output' ? undefined : 'none' }}
        >
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
              <OutputTotalEditor
                total={state.outputTotal}
                contract={outputContract}
                isLoading={loading}
                isDisabled={isDisabled}
                issues={state.rowIssues.get(state.outputTotal.uid)}
                onChange={state.outputTotalActions.update}
              />

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
