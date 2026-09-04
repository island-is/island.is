import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Button, Note, Paragraph, Stack } from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

import type {
  GetTaxCalculatorFieldsForContentfulAppQuery,
  GetTaxCalculatorFieldsForContentfulAppQueryVariables,
} from '../../../graphql/schema'
import { ConfigSection } from './components/ConfigSection'
import { useCalculatorConfig } from './hooks/useCalculatorConfig'
import { GET_TAX_CALCULATOR_FIELDS, toApiCalculatorType } from './constants'
import { FieldContract } from './types'

// Every entry of the `calculator` content type IS a calculator, so -- unlike
// ConnectedComponent's shared configJson field, which also serves unrelated
// embed types -- no sibling `type` gate or plain-JSON fallback is needed.
export const CalculatorConfigEditor = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [calculatorTypeValue, setCalculatorTypeValue] = useState<string>(
    sdk.entry.fields.type?.getValue() ?? '',
  )

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

  const {
    sections,
    saveError,
    invalidPaths,
    addSection,
    otherToggles,
    sectionActions,
  } = useCalculatorConfig(sdk, calculatorTypeValue)

  const apiCalculatorType = toApiCalculatorType(calculatorTypeValue)

  const { data, loading, error } = useQuery<
    GetTaxCalculatorFieldsForContentfulAppQuery,
    GetTaxCalculatorFieldsForContentfulAppQueryVariables
  >(GET_TAX_CALCULATOR_FIELDS, {
    variables: apiCalculatorType
      ? { calculatorType: apiCalculatorType }
      : undefined,
    skip: !apiCalculatorType,
  })

  const contract: FieldContract = useMemo(
    () =>
      new Map(
        (data?.taxCalculatorFields ?? []).map((field) => [field.key, field]),
      ),
    [data],
  )

  return (
    <Stack flexDirection="column" alignItems="stretch" spacing="spacingM">
      {error && (
        <Note variant="negative">
          Could not load the field list for this calculator type:{' '}
          {error.message}
        </Note>
      )}

      {calculatorTypeValue && !apiCalculatorType && (
        <Note variant="warning">
          Unknown calculator type &quot;{calculatorTypeValue}&quot; -- no field
          list exists for it.
        </Note>
      )}

      {/* `taxCalculatorFields` is nullable, so a successful response can still
       * carry no fields. Without this the editor faces a dropdown holding
       * nothing but its own placeholder, and no way to tell that apart from a
       * query that is still in flight. */}
      {apiCalculatorType && !loading && !error && contract.size === 0 && (
        <Note variant="warning">
          This calculator type returned no fields, so there is nothing to place
          in a section yet.
        </Note>
      )}

      {saveError && (
        <Note variant="negative">
          This configuration is invalid and has not been saved.
          {invalidPaths.length > 0 && <> Check: {invalidPaths.join(', ')}</>}
        </Note>
      )}

      {calculatorTypeValue &&
        sections.map((section, sectionIndex) => (
          <ConfigSection
            key={section.key}
            section={section}
            position={sectionIndex + 1}
            contract={contract}
            isLoading={loading}
            otherToggles={otherToggles(sectionIndex)}
            actions={sectionActions(sectionIndex)}
          />
        ))}

      {calculatorTypeValue && (
        <Button startIcon={<PlusIcon />} onClick={addSection}>
          Add section
        </Button>
      )}

      {!calculatorTypeValue && (
        <Paragraph>
          Select a calculator type on this entry to configure sections.
        </Paragraph>
      )}
    </Stack>
  )
}
