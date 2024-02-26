import { useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Box, Button, Inline, Stack, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { formatCurrency } from '@island.is/web/utils/currency'

interface ResultState {
  thorkatlaPayment: number
  purchaseAgreementPayment: number
  closingPayment: number
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
  }
}

const GrindavikResidentialPropertyPurchaseCalculator = ({
  slice,
}: GrindavikResidentialPropertyPurchaseCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
  const methods = useForm<InputState>()
  const resultContainerRef = useRef<HTMLDivElement>(null)

  const fireInsuranceValue = methods.watch('fireInsuranceValue')
  const [resultState, setResultState] = useState<ResultState | null>(null)

  const thorkatlaPurchasePrice = (fireInsuranceValue ?? 0) * 0.95

  const onSubmit = (inputState: InputState) => {
    if (!isElementInView(resultContainerRef.current)) {
      resultContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
    setResultState(calculateResultState(inputState, thorkatlaPurchasePrice))
  }

  const mainHeading = n(
    'mainHeading',
    'Útreikningur vegna uppkaupa fasteigna í Grindavík',
  )
  const currencySuffix = n('currencySuffix', ' krónur')

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
                  maxLength={15}
                  type="number"
                />
              </Stack>

              <Stack space={2}>
                <Text>
                  {n(
                    'thorkatlaPurchasePriceLabel',
                    'Kaupverð Þórkötlu (95% af brunabótamati)',
                  )}
                </Text>
                <Text variant="h5" color="blue400">
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
                    maxLength={15}
                    placeholder={n('currencyInputPlaceholder', 'kr.')}
                    type="number"
                  />
                  <InputController
                    id="loan2"
                    name="loan2"
                    label={n('loan2Label', 'Lán 2')}
                    currency={true}
                    maxLength={15}
                    placeholder={n('currencyInputPlaceholder', 'kr.')}
                    type="number"
                  />
                  <InputController
                    id="loan3"
                    name="loan3"
                    label={n('loan3Label', 'Lán 3')}
                    currency={true}
                    maxLength={15}
                    placeholder={n('currencyInputPlaceholder', 'kr.')}
                    type="number"
                  />
                </Stack>
              </Stack>

              <Button type="submit">{n('calculate', 'Reikna')}</Button>
            </Stack>
          </form>
        </FormProvider>
      </Box>
      <Box
        ref={resultContainerRef}
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
        style={{ visibility: resultState !== null ? 'visible' : 'hidden' }}
      >
        <Stack space={3}>
          <Text variant="h3">{n('resultsHeading', 'Niðurstöður')}</Text>
          <Stack space={2}>
            <Inline space={2} justifyContent="spaceBetween">
              <Text variant="h5">
                {n('thorkatlaPaymentLabel', 'Greitt úr af Þórkötlu*')}
              </Text>
              <Text variant="h5" color="blue400">
                {formatCurrency(resultState?.thorkatlaPayment, currencySuffix)}
              </Text>
            </Inline>
            <Inline space={2} justifyContent="spaceBetween">
              <Text>
                {n('purchaseAgreementPaymentLabel', 'Greitt við kaupsamning')}
              </Text>
              <Text>
                {formatCurrency(
                  resultState?.purchaseAgreementPayment,
                  currencySuffix,
                )}
              </Text>
            </Inline>
            <Inline space={2} justifyContent="spaceBetween">
              <Text>
                {n(
                  'closingPaymentLabel',
                  'Greitt við afsal (5% af kaupvirði)**',
                )}
              </Text>
              <Text>
                {formatCurrency(resultState?.closingPayment, currencySuffix)}
              </Text>
            </Inline>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

export default GrindavikResidentialPropertyPurchaseCalculator
