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
import { CHROME_TEXT, localized } from './text'

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

/* Five of the seven codes collapse to one string beside the control -- they
 * differ in ways a visitor cannot act on. Closed with a `never` guard. */
const errorText = (code: TaxCalculatorCalculationErrorCode) => {
  switch (code) {
    case TaxCalculatorCalculationErrorCode.InvalidValue:
    case TaxCalculatorCalculationErrorCode.MissingRequiredValue:
    case TaxCalculatorCalculationErrorCode.InapplicableValue:
    case TaxCalculatorCalculationErrorCode.UnknownField:
    case TaxCalculatorCalculationErrorCode.DuplicateField:
      return CHROME_TEXT.invalidValue
    case TaxCalculatorCalculationErrorCode.CalculationFailed:
      return CHROME_TEXT.calculationError
    case TaxCalculatorCalculationErrorCode.EmptyResult:
      return CHROME_TEXT.emptyResult
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

  /* Compared against the serialized payload rather than raw form values:
   * `useWatch` returns a fresh object every render, and toggles live outside
   * form state yet change the payload. */
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

  /* Computed once and passed down -- deciding visibility and payload
   * separately lets a field render enabled and then be dropped. */
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

  /* Above the early returns, guarded on `data`: a hook after a conditional
   * return is a rules-of-hooks violation. */
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

  const onSubmit = async () => {
    setSubmitted(snapshot)
    setResponse(undefined)
    setTransportFailed(false)

    try {
      const result = await calculate({
        variables: { input: { type: calculatorType, values: payload } },
      })

      /* Null means the transport failed -- every consumer-caused failure comes
       * back as a populated wrapper. */
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
      /* `useLazyQuery` rejects when the network fails, and the thrown error
       * carries nothing the visitor can act on. */
      setTransportFailed(true)
    }
  }

  /* The visible result must not drift from the visible inputs. */
  const isCurrent = submitted === snapshot
  const shown = isCurrent ? response : undefined
  const failed = isCurrent && transportFailed

  /* An error keyed to a field that was not submitted has no live control to
   * land on, so it falls back to the result-area alert. */
  const fieldErrors = new Map<string, string>()
  const alerts: string[] = failed
    ? [localized(CHROME_TEXT.calculationError, activeLocale) ?? '']
    : []

  for (const returned of shown?.errors ?? []) {
    const text = localized(errorText(returned.code), activeLocale) ?? ''
    const entry = returned.key ? applicable.get(returned.key) : undefined

    if (returned.key && entry && isInPlay(entry)) {
      fieldErrors.set(returned.key, text)
    } else if (!alerts.includes(text)) {
      /* One alert per distinct reason: validation reports every failing field
       * at once, so the same code arrives repeatedly. */
      alerts.push(text)
    }
  }

  /* The domain never sends both today; this restores the contract rather than
   * handling a case that arises. */
  const calculation =
    shown && shown.errors.length === 0 ? shown.calculation : undefined
  const outputValues = calculation ? toOutputValues(calculation) : undefined

  /* Asked before the box renders: both halves legitimately render nothing when
   * the config places only keys the calculation returned no value for. */
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
                {localized(CHROME_TEXT.submit, activeLocale)}
              </Button>
            </Box>

            {alerts.map((title) => (
              <AlertMessage key={title} type="error" title={title} />
            ))}

            {/* A response that carried neither a result nor a reason is still
             * an answer, and must not read as a silent no-op. */}
            {shown && shown.errors.length === 0 && !hasResults && (
              <AlertMessage
                type="info"
                title={localized(CHROME_TEXT.emptyResult, activeLocale) ?? ''}
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

/* Split from the form so its hooks never run against a half-configured slice;
 * `configJson` crosses a JSON scalar and regains its type here. */
const Calculator = ({ slice }: CalculatorProps) => {
  /* Memoized so the effect below fires once per config, not per render. */
  const parsed = useMemo(
    () => calculatorConfigSchema.safeParse(slice.configJson),
    [slice.configJson],
  )

  /* The form never mounts when the config is invalid, so its own diagnostics
   * effect cannot report this. */
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
