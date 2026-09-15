import { useEffect, useMemo, useState } from 'react'
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
  collectInputSectionToggles,
} from '@island.is/tax-calculators'
import {
  Calculator as CalculatorSlice,
  GetTaxCalculatorQuery,
  GetTaxCalculatorQueryVariables,
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { GET_TAX_CALCULATOR } from '@island.is/web/screens/queries/TaxCalculators'

import { CalculatorSection } from './CalculatorSection'
import { toInputFieldContract, toOutputFieldContract } from './contract'
import {
  reportConfigParseIssues,
  reportContractDiagnostics,
} from './diagnostics'
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
      collectInputSectionToggles(config).map((toggle) => [toggle.key, false]),
    ),
  )

  const { data, loading, error } = useQuery<
    GetTaxCalculatorQuery,
    GetTaxCalculatorQueryVariables
  >(GET_TAX_CALCULATOR, { variables: { type: calculatorType } })

  /* The raw per-`__typename` unions never leave `contract.ts`. */
  const inputContract = useMemo(
    () => toInputFieldContract(data?.taxCalculator.inputFields ?? []),
    [data],
  )

  const outputContract = useMemo(
    () => toOutputFieldContract(data?.taxCalculator.outputFields ?? []),
    [data],
  )

  /* Above the early returns below, and guarded on `data` instead: a hook placed
   * after a conditional return is a rules-of-hooks violation that `nx lint web`
   * fails on. */
  useEffect(() => {
    if (!data) return

    reportContractDiagnostics({
      calculatorType,
      config,
      inputContract,
      outputContract,
      locale: activeLocale,
    })
  }, [
    data,
    calculatorType,
    config,
    inputContract,
    outputContract,
    activeLocale,
  ])

  if (loading) return <SkeletonLoader height={64} repeat={4} space={2} />

  if (error || !data?.taxCalculator) {
    return (
      <AlertMessage
        type="error"
        title={localized(CHROME_TEXT.loadError, activeLocale) ?? ''}
      />
    )
  }

  return (
    <FormProvider {...methods}>
      <Box background="blue100" borderRadius="large" padding={[3, 3, 5]}>
        <Stack space={5}>
          {config.inputSections.map((section) => (
            <CalculatorSection
              key={section.key}
              section={section}
              contract={inputContract}
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
  /* Memoized so the effect below fires once per config rather than once per
   * render -- and twice per render under StrictMode. */
  const parsed = useMemo(
    () => calculatorConfigSchema.safeParse(slice.configJson),
    [slice.configJson],
  )

  /* The form component never mounts when the config is invalid, so its own
   * diagnostics effect cannot be where this is reported. */
  useEffect(() => {
    if (parsed.success) return
    reportConfigParseIssues(slice.id, parsed.error.issues)
  }, [parsed, slice.id])

  if (!slice.calculatorType || !parsed.success) return null

  return (
    <CalculatorForm
      calculatorType={slice.calculatorType}
      config={parsed.data}
    />
  )
}

export default Calculator
