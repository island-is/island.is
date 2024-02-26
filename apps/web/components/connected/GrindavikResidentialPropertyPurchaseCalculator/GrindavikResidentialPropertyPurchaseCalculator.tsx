import { useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import isEqual from 'lodash/isEqual'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { formatCurrency } from '@island.is/web/utils/currency'

interface ResultState {
  thorkatlaPayment: number
  purchaseAgreementPayment: number
  closingPayment: number
  inputState: InputState
}

interface InputState {
  fireInsuranceValue: number
  loan1: number
  loan2: number
  loan3: number
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
  if (inputState.loan1) {
    thorkatlaPayment -= Number(inputState.loan1)
  }
  if (inputState.loan2) {
    thorkatlaPayment -= Number(inputState.loan2)
  }
  if (inputState.loan3) {
    thorkatlaPayment -= Number(inputState.loan3)
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

const GrindavikResidentialPropertyPurchaseCalculator = ({
  slice,
}: GrindavikResidentialPropertyPurchaseCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
  const methods = useForm<InputState>()
  const resultContainerRef = useRef<HTMLDivElement>(null)

  const fireInsuranceValue = methods.watch('fireInsuranceValue')
  const loan1 = methods.watch('loan1')
  const loan2 = methods.watch('loan2')
  const loan3 = methods.watch('loan3')

  const inputState: InputState = {
    fireInsuranceValue,
    loan1,
    loan2,
    loan3,
  }

  const [resultState, setResultState] = useState<ResultState | null>(null)

  const thorkatlaPurchasePrice = (fireInsuranceValue ?? 0) * 0.95

  const onSubmit = (inputState: InputState) => {
    setTimeout(() => {
      // Only scroll results container into view it isn't already in view
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
                  <InputController
                    id="loan1"
                    name="loan1"
                    label={n('loan1Label', 'Lán 1')}
                    currency={true}
                    maxLength={maxLength}
                    placeholder={n('currencyInputPlaceholder', 'kr.')}
                    type="number"
                    size="sm"
                    inputMode="numeric"
                    suffix={currencySuffix}
                  />
                  <InputController
                    id="loan2"
                    name="loan2"
                    label={n('loan2Label', 'Lán 2')}
                    currency={true}
                    maxLength={maxLength}
                    placeholder={n('currencyInputPlaceholder', 'kr.')}
                    type="number"
                    size="sm"
                    inputMode="numeric"
                    suffix={currencySuffix}
                  />
                  <InputController
                    id="loan3"
                    name="loan3"
                    label={n('loan3Label', 'Lán 3')}
                    currency={true}
                    maxLength={maxLength}
                    placeholder={n('currencyInputPlaceholder', 'kr.')}
                    type="number"
                    size="sm"
                    inputMode="numeric"
                    suffix={currencySuffix}
                  />
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
            <Text variant="small">
              {n(
                'thorkatlaPaymentDisclaimer',
                'Seljandi getur valið afhendingardagsetningu minnst 1 mánuði frá kaupsamningi og mest 3 mánuðum frá kaupsamningi. Afsal fer fram einum mánuði frá afhendingu.',
              )}
            </Text>
            <Text variant="small">
              {n(
                'purchaseAgreementPaymentDisclaimer',
                '*Greiðslur frá félaginu fara til eigenda í samræmi við eignarhlutfall.',
              )}
            </Text>
            <Text variant="small">
              {n(
                'closingResultDisclaimer',
                '**Í afsalsgreiðslu fer fram lögskilauppgjör sem kemur til hækkunar eða lækkunar á afsalsgreiðslu.',
              )}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

export default GrindavikResidentialPropertyPurchaseCalculator
