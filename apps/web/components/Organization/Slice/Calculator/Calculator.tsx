import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import type { CalculatorConfig } from '@island.is/tax-calculators'
import {
  calculatorConfigSchema,
  collectSectionToggles,
} from '@island.is/tax-calculators'
import {
  Calculator as CalculatorSlice,
  GetTaxCalculatorFieldsQuery,
  GetTaxCalculatorFieldsQueryVariables,
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { GET_TAX_CALCULATOR_FIELDS } from '@island.is/web/screens/queries/TaxCalculators'

import { CalculatorSection } from './CalculatorSection'
import { CHROME_TEXT, localized } from './text'

interface CalculatorProps {
  slice: CalculatorSlice
}

interface FormProps {
  calculatorType: TaxCalculatorType
  config: CalculatorConfig
}

const CalculatorForm = ({ calculatorType, config }: FormProps) => {
  const { activeLocale } = useI18n()
  const methods = useForm({ shouldUnregister: true })

  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      collectSectionToggles(config).map((toggle) => [toggle.key, false]),
    ),
  )

  const { data, loading, error } = useQuery<
    GetTaxCalculatorFieldsQuery,
    GetTaxCalculatorFieldsQueryVariables
  >(GET_TAX_CALCULATOR_FIELDS, { variables: { calculatorType } })

  const contract = useMemo(
    () =>
      new Map(
        (data?.taxCalculator.fields ?? []).map((field) => [field.key, field]),
      ),
    [data],
  )

  if (loading) return <SkeletonLoader height={64} repeat={4} space={2} />

  if (error || !data?.taxCalculator) {
    return (
      <AlertMessage
        type="error"
        title={localized(CHROME_TEXT.loadError, activeLocale) ?? ''}
      />
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    const placed = new Set(
      config.sections.flatMap((section) =>
        section.fields.map((field) => field.key),
      ),
    )
    const unplaced = [...contract.values()]
      .filter((field) => field.required && !placed.has(field.key))
      .map((field) => field.key)

    if (unplaced.length > 0) {
      console.warn(
        `Calculator "${calculatorType}": required fields are in no section and will not render: ${unplaced.join(
          ', ',
        )}`,
      )
    }
  }

  return (
    <FormProvider {...methods}>
      <Box background="blue100" borderRadius="large" padding={[3, 3, 5]}>
        <Stack space={5}>
          {config.sections.map((section) => (
            <CalculatorSection
              key={section.key}
              section={section}
              contract={contract}
              locale={activeLocale}
              toggles={toggles}
              onToggle={(key, checked) =>
                setToggles((current) => ({ ...current, [key]: checked }))
              }
            />
          ))}
          <Box>
            {/* Wired to nothing: the calculation query is a later pass. */}
            <Button disabled>
              {localized(CHROME_TEXT.submit, activeLocale)}
            </Button>
          </Box>
        </Stack>
      </Box>
    </FormProvider>
  )
}

/* Split from the form so the hooks below never run against a half-configured
 * slice: `configJson` crosses a JSON scalar and regains its type here. */
const Calculator = ({ slice }: CalculatorProps) => {
  const parsed = calculatorConfigSchema.safeParse(slice.configJson)

  if (!slice.calculatorType || !parsed.success) return null

  return (
    <CalculatorForm
      calculatorType={slice.calculatorType}
      config={parsed.data}
    />
  )
}

export default Calculator
