import { useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import isEqual from 'lodash/isEqual'

import {
  Box,
  Button,
  Icon,
  Stack,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { formatCurrency } from '@island.is/web/utils/currency'

import * as styles from './GrindavikResidentialPropertyPurchaseCalculator.css'

interface ResultState {
  thorkatlaPayment: number
  purchaseAgreementPayment: number
  closingPayment: number
  inputState: InputState
}

interface InputState {
  fireInsuranceValue: number
  loans: { value: number | undefined }[]
}

interface GrindavikResidentialPropertyPurchaseCalculatorProps {
  slice: ConnectedComponent
}

const isElementInView = (element: HTMLDivElement | null) => {
  if (!element) {
    return true
  }

  const rect = element.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

const calculateResultState = (
  inputState: InputState,
  thorkatlaPurchasePrice: number,
) => {
  let thorkatlaPayment = thorkatlaPurchasePrice

  for (const loan of inputState.loans) {
    if (loan.value) {
      thorkatlaPayment -= Number(loan.value)
    }
  }

  const closingPayment = 0.05 * thorkatlaPurchasePrice

  const purchaseAgreementPayment = thorkatlaPayment - closingPayment

  return {
    thorkatlaPayment,
    purchaseAgreementPayment,
    closingPayment,
    inputState,
  }
}

const focusLoanInput = (index: number, delay = 100) => {
  setTimeout(() => {
    const appendedElement = document
      .getElementsByName(`loans[${index}].value`)
      .item(0)
    if (appendedElement) {
      appendedElement.focus()
    }
  }, delay)
}

const GrindavikResidentialPropertyPurchaseCalculator = ({
  slice,
}: GrindavikResidentialPropertyPurchaseCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
  const methods = useForm<InputState>({
    defaultValues: { loans: [{ value: undefined }] },
  })
  const loansFieldArray = useFieldArray({
    name: 'loans',
    control: methods.control,
  })
  const { activeLocale } = useI18n()
  const resultContainerRef = useRef<HTMLDivElement>(null)

  const fireInsuranceValue = methods.watch('fireInsuranceValue')

  const loans = useWatch({
    control: methods.control,
    name: 'loans',
  })

  const inputState: InputState = {
    fireInsuranceValue,
    loans,
  }

  const [resultState, setResultState] = useState<ResultState | null>(null)

  const thorkatlaPurchasePrice = (fireInsuranceValue ?? 0) * 0.95

  const onSubmit = (inputState: InputState) => {
    setTimeout(() => {
      // Only scroll results container into view if it isn't already in view
      if (!isElementInView(resultContainerRef.current)) {
        resultContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }
    }, 0)
    setResultState(calculateResultState(inputState, thorkatlaPurchasePrice))
  }

  const mainHeading = n(
    'mainHeading',
    'Útreikningur vegna uppkaupa fasteigna í Grindavík',
  )
  const currencySuffix = n('currencySuffix', ' krónur') as string

  const canCalculate = !isEqual(resultState?.inputState, inputState)

  const maxLength = (slice.configJson?.maxLength ?? 11) + currencySuffix.length

  const thorkatlaPaymentDisclaimer = n(
    'thorkatlaPaymentDisclaimer',
    'Seljandi getur valið afhendingardagsetningu minnst 1 mánuði frá kaupsamningi og mest 3 mánuðum frá kaupsamningi. Afsal fer fram einum mánuði frá afhendingu.',
  )
  const purchaseAgreementPaymentDisclaimer = n(
    'purchaseAgreementPaymentDisclaimer',
    '*Greiðslur frá félaginu fara til eigenda í samræmi við eignarhlutfall.',
  )
  const closingResultDisclaimer = n(
    'closingResultDisclaimer',
    '**Í afsalsgreiðslu fer fram lögskilauppgjör sem kemur til hækkunar eða lækkunar á afsalsgreiðslu.',
  )
  const loanDisclaimer = n(
    'loanDisclaimer',
    'Samtal er enn í gangi við lífeyrissjóði um þátttöku þeirra í úrræðinu. Vonast er til þess að niðurstaða liggi fyrir fljótlega',
  )

  return (
    <Stack space={5}>
      <Box
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack space={5}>
              {mainHeading && <Text variant="h3">{mainHeading}</Text>}
              <Stack space={3}>
                <Text variant="h4">
                  {n('fireInsuranceValueHeading', 'Brunabótamat eignar')}
                </Text>
                <InputController
                  id="fireInsuranceValue"
                  name="fireInsuranceValue"
                  label={n('fireInsuranceValueLabel', 'Brunabótamat')}
                  placeholder={n('currencyInputPlaceholder', 'kr.')}
                  currency={true}
                  maxLength={maxLength}
                  type="number"
                  size="sm"
                  suffix={currencySuffix}
                  inputMode="numeric"
                />
              </Stack>

              <Stack space={2}>
                <Text>
                  {n(
                    'thorkatlaPurchasePriceLabel',
                    'Kaupverð Þórkötlu (95% af brunabótamati)',
                  )}
                </Text>
                <Text variant="h4" color="blue400">
                  {formatCurrency(thorkatlaPurchasePrice, currencySuffix)}
                </Text>
              </Stack>

              <Stack space={3}>
                <Text variant="h4">{n('loanHeading', 'Áhvílandi lán')}</Text>
                <Stack space={2}>
                  {loansFieldArray.fields.map((field, index) => {
                    const name = `loans[${index}].value`
                    return (
                      <Box
                        width="full"
                        display="flex"
                        flexDirection="row"
                        flexWrap="nowrap"
                        alignItems="center"
                        columnGap={2}
                      >
                        <Box className={styles.fullWidth}>
                          <InputController
                            key={field.id}
                            id={name}
                            name={name}
                            label={`${n('loanLabel', 'Lán')} ${index + 1}`}
                            currency={true}
                            maxLength={maxLength}
                            placeholder={n('currencyInputPlaceholder', 'kr.')}
                            type="number"
                            size="sm"
                            inputMode="numeric"
                            suffix={currencySuffix}
                          />
                        </Box>
                        <Box
                          role="button"
                          userSelect="none"
                          onKeyDown={(ev) => {
                            if (ev.key === ' ' || ev.key === 'Enter') {
                              loansFieldArray.remove(index)
                              ev.preventDefault()
                            }
                          }}
                          tabIndex={0}
                          cursor="pointer"
                          onClick={() => {
                            loansFieldArray.remove(index)
                          }}
                        >
                          <VisuallyHidden>
                            {n(
                              'removeLoan',
                              activeLocale === 'is'
                                ? 'Eyða láni'
                                : 'Remove loan',
                            )}
                          </VisuallyHidden>
                          <Icon
                            icon="removeCircle"
                            type="outline"
                            color="dark200"
                          />
                        </Box>
                      </Box>
                    )
                  })}
                  <Box display="flex" justifyContent="center">
                    <Button
                      disabled={
                        typeof slice.configJson?.maxLoanCount === 'number' &&
                        loans.length >= slice.configJson.maxLoanCount
                      }
                      onClick={() => {
                        loansFieldArray.append({
                          value: undefined,
                        })
                        focusLoanInput(loansFieldArray.fields.length)
                      }}
                      icon="add"
                      size="small"
                      variant="utility"
                    >
                      {n('appendLoan', 'Bæta við láni')}
                    </Button>
                  </Box>
                </Stack>
              </Stack>

              <Button disabled={!canCalculate} type="submit">
                {n('calculate', 'Reikna')}
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </Box>
      <Box
        ref={resultContainerRef}
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
        style={{
          visibility:
            resultState !== null && !canCalculate ? 'visible' : 'hidden',
        }}
      >
        <Stack space={[5, 5, 8]}>
          <Stack space={3}>
            <Text variant="h3">{n('resultsHeading', 'Niðurstöður')}</Text>
            <Stack space={5}>
              <Box
                columnGap={2}
                rowGap={1}
                justifyContent="spaceBetween"
                display="flex"
                flexDirection={['column', 'row']}
              >
                <Text variant="h4">
                  {n('thorkatlaPaymentLabel', 'Greitt úr af Þórkötlu*')}
                </Text>
                <Text variant="h4" color="blue400" whiteSpace="nowrap">
                  {formatCurrency(
                    resultState?.thorkatlaPayment,
                    currencySuffix,
                  )}
                </Text>
              </Box>
              <Stack space={1}>
                <Text variant="eyebrow">{n('breakdown', 'Sundurliðun')}</Text>
                <Stack space={2}>
                  <Box
                    columnGap={2}
                    rowGap={1}
                    justifyContent="spaceBetween"
                    display="flex"
                    flexDirection={['column', 'row']}
                  >
                    <Text>
                      {n(
                        'purchaseAgreementPaymentLabel',
                        'Greitt við kaupsamning',
                      )}
                    </Text>
                    <Text whiteSpace="nowrap">
                      {formatCurrency(
                        resultState?.purchaseAgreementPayment,
                        currencySuffix,
                      )}
                    </Text>
                  </Box>
                  <Box
                    columnGap={2}
                    rowGap={1}
                    justifyContent="spaceBetween"
                    display="flex"
                    flexDirection={['column', 'row']}
                  >
                    <Text>
                      {n(
                        'closingPaymentLabel',
                        'Greitt við afsal (5% af kaupvirði)**',
                      )}
                    </Text>
                    <Text whiteSpace="nowrap">
                      {formatCurrency(
                        resultState?.closingPayment,
                        currencySuffix,
                      )}
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack space={2}>
            {thorkatlaPaymentDisclaimer && (
              <Text variant="small">{thorkatlaPaymentDisclaimer}</Text>
            )}
            {purchaseAgreementPaymentDisclaimer && (
              <Text variant="small">{purchaseAgreementPaymentDisclaimer}</Text>
            )}
            {closingResultDisclaimer && (
              <Text variant="small">{closingResultDisclaimer}</Text>
            )}
            {loanDisclaimer && <Text variant="small">{loanDisclaimer}</Text>}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

export default GrindavikResidentialPropertyPurchaseCalculator
