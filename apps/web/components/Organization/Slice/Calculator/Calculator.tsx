import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useLazyQuery, useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type { CalculatorConfig } from '@island.is/tax-calculators'
import {
  calculatorConfigSchema,
  collectInputSectionToggles,
} from '@island.is/tax-calculators'
import {
  Calculator as CalculatorSlice,
  GetTaxCalculatorCalculationQuery,
  GetTaxCalculatorCalculationQueryVariables,
  GetTaxCalculatorQuery,
  GetTaxCalculatorQueryVariables,
  TaxCalculatorCalculationErrorCode,
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import {
  GET_TAX_CALCULATOR,
  GET_TAX_CALCULATOR_CALCULATION,
} from '@island.is/web/screens/queries/TaxCalculators'

import { canSubmit, collectApplicableFields, isInPlay } from './applicability'
import { CalculatorResults, collectVisibleSections } from './CalculatorResults'
import { CalculatorSection } from './CalculatorSection'
import { CalculatorTotal, resolveTotal } from './CalculatorTotal'
import { toInputFieldContract, toOutputFieldContract } from './contract'
import {
  reportCalculationErrors,
  reportConfigParseIssues,
  reportContractDiagnostics,
} from './diagnostics'
import { toOutputValues } from './outputValues'
import { toInputFieldValues } from './serialize'
import { CALCULATOR_MESSAGES, localized } from './text'

interface CalculatorProps {
  slice: CalculatorSlice
}

interface FormProps {
  calculatorType: TaxCalculatorType
  config: CalculatorConfig
}

type CalculationResponse = NonNullable<
  GetTaxCalculatorCalculationQuery['taxCalculatorCalculate']
>

const errorText = (code: TaxCalculatorCalculationErrorCode) => {
  switch (code) {
    case TaxCalculatorCalculationErrorCode.InvalidValue:
    case TaxCalculatorCalculationErrorCode.MissingRequiredValue:
    case TaxCalculatorCalculationErrorCode.InapplicableValue:
    case TaxCalculatorCalculationErrorCode.UnknownField:
    case TaxCalculatorCalculationErrorCode.DuplicateField:
      return CALCULATOR_MESSAGES.invalidValue
    case TaxCalculatorCalculationErrorCode.CalculationFailed:
      return CALCULATOR_MESSAGES.calculationError
    case TaxCalculatorCalculationErrorCode.EmptyResult:
      return CALCULATOR_MESSAGES.emptyResult
    default: {
      const unhandled: never = code
      return unhandled
    }
  }
}

const CalculatorForm = ({ calculatorType, config }: FormProps) => {
  const { activeLocale } = useI18n()
  const methods = useForm({ shouldUnregister: true })

  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      collectInputSectionToggles(config).map((toggle) => [toggle.key, false]),
    ),
  )

  const [submitted, setSubmitted] = useState<string>()
  const [response, setResponse] = useState<CalculationResponse>()
  const [transportFailed, setTransportFailed] = useState(false)

  const { data, loading, error } = useQuery<
    GetTaxCalculatorQuery,
    GetTaxCalculatorQueryVariables
  >(GET_TAX_CALCULATOR, { variables: { type: calculatorType } })

  const inputContract = useMemo(
    () => toInputFieldContract(data?.taxCalculator.inputFields ?? []),
    [data],
  )

  const outputContract = useMemo(
    () => toOutputFieldContract(data?.taxCalculator.outputFields ?? []),
    [data],
  )

  const values = useWatch({ control: methods.control })

  const applicable = useMemo(
    () =>
      collectApplicableFields(
        config,
        inputContract,
        toggles,
        values,
        activeLocale,
      ),
    [config, inputContract, toggles, values, activeLocale],
  )

  const payload = useMemo(
    () => toInputFieldValues(applicable, values),
    [applicable, values],
  )

  const snapshot = useMemo(() => JSON.stringify(payload), [payload])

  /* `network-only`: the response carries no `id`, so the default policy would
   * normalize it under ROOT_QUERY and replay an errored response on retry. */
  const [calculate, { loading: calculating }] = useLazyQuery<
    GetTaxCalculatorCalculationQuery,
    GetTaxCalculatorCalculationQueryVariables
  >(GET_TAX_CALCULATOR_CALCULATION, { fetchPolicy: 'network-only' })

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
        title={localized(CALCULATOR_MESSAGES.loadError, activeLocale) ?? ''}
      />
    )
  }

  const onSubmit = async () => {
    setSubmitted(snapshot)
    setResponse(undefined)
    setTransportFailed(false)

    try {
      const result = await calculate({
        variables: { input: { type: calculatorType, values: payload } },
      })

      if (result.error || !result.data?.taxCalculatorCalculate) {
        setTransportFailed(true)
        return
      }

      reportCalculationErrors(
        calculatorType,
        result.data.taxCalculatorCalculate.errors,
      )
      setResponse(result.data.taxCalculatorCalculate)
    } catch {
      setTransportFailed(true)
    }
  }

  const isCurrent = submitted === snapshot
  const shown = isCurrent ? response : undefined
  const failed = isCurrent && transportFailed

  const fieldErrors = new Map<string, string>()
  const alerts: string[] = failed
    ? [localized(CALCULATOR_MESSAGES.calculationError, activeLocale) ?? '']
    : []

  for (const returned of shown?.errors ?? []) {
    const text = localized(errorText(returned.code), activeLocale) ?? ''
    const entry = returned.key ? applicable.get(returned.key) : undefined

    if (returned.key && entry && isInPlay(entry)) {
      fieldErrors.set(returned.key, text)
    } else if (!alerts.includes(text)) {
      alerts.push(text)
    }
  }

  const calculation =
    shown && shown.errors.length === 0 ? shown.calculation : undefined
  const outputValues = calculation ? toOutputValues(calculation) : undefined

  const hasResults =
    outputValues !== undefined &&
    (resolveTotal(config, outputContract, outputValues, activeLocale) !==
      undefined ||
      collectVisibleSections(config, outputContract, outputValues, activeLocale)
        .length > 0)

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Box background="blue100" borderRadius="large" padding={[3, 3, 5]}>
          <Stack space={5}>
            {config.inputSections.map((section) => (
              <CalculatorSection
                key={section.key}
                section={section}
                applicable={applicable}
                locale={activeLocale}
                toggles={toggles}
                errors={fieldErrors}
                onToggle={(key, checked) =>
                  setToggles((current) => ({ ...current, [key]: checked }))
                }
              />
            ))}
            <Box>
              <Button
                type="submit"
                loading={calculating}
                disabled={!canSubmit(applicable, values)}
              >
                {localized(CALCULATOR_MESSAGES.submit, activeLocale)}
              </Button>
            </Box>

            {alerts.map((title) => (
              <AlertMessage key={title} type="error" title={title} />
            ))}

            {shown && shown.errors.length === 0 && !hasResults && (
              <AlertMessage
                type="info"
                title={
                  localized(CALCULATOR_MESSAGES.emptyResult, activeLocale) ?? ''
                }
              />
            )}

            {hasResults && outputValues && (
              <Box background="white" borderRadius="large" padding={[3, 3, 4]}>
                <Stack space={3}>
                  <CalculatorTotal
                    config={config}
                    contract={outputContract}
                    values={outputValues}
                    locale={activeLocale}
                  />
                  <CalculatorResults
                    config={config}
                    contract={outputContract}
                    values={outputValues}
                    locale={activeLocale}
                  />
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </form>
    </FormProvider>
  )
}

const Calculator = ({ slice }: CalculatorProps) => {
  const parsed = useMemo(
    () => calculatorConfigSchema.safeParse(slice.configJson),
    [slice.configJson],
  )

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
