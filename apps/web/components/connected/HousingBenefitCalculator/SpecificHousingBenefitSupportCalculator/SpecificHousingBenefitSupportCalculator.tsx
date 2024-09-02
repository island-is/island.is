import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  Option,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  ConnectedComponent,
  GetSpecificHousingBenefitSupportCalculationQuery,
  GetSpecificHousingBenefitSupportCalculationQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { GET_SPECIFIC_HOUSING_BENEFIT_SUPPORT_CALCULATION } from '@island.is/web/screens/queries/HousingBenefitCalculator'
import { formatCurrency } from '@island.is/web/utils/currency'

import { translation as translationStrings } from './translation.strings'

const MAX_LENGTH = 15

interface InputState {
  housingCost: string
  householdMemberCount: number
}

const SpecificHousingBenefitSupportCalculator = () => {
  const { formatMessage } = useIntl()
  const [inputState, setInputState] = useState<InputState>({
    housingCost: '',
    householdMemberCount: 1,
  })
  const [data, setData] =
    useState<GetSpecificHousingBenefitSupportCalculationQuery>()
  const updateInputState = (key: keyof InputState, value: string | number) => {
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const { control, getValues } = useForm()

  const [fetchCalculation, { loading, called, error }] = useLazyQuery<
    GetSpecificHousingBenefitSupportCalculationQuery,
    GetSpecificHousingBenefitSupportCalculationQueryVariables
  >(GET_SPECIFIC_HOUSING_BENEFIT_SUPPORT_CALCULATION, {
    onCompleted(data) {
      setData(data)
    },
  })

  const calculate = () => {
    const values = getValues() as InputState
    fetchCalculation({
      variables: {
        input: {
          numberOfHouseholdMembers: values.householdMemberCount,
          housingCostsPerMonth: Number(values.housingCost),
        },
      },
    })
  }

  const maximumHousingBenefits =
    data?.housingBenefitCalculatorSpecificSupportCalculation
      ?.maximumHousingBenefits
  const reductionsDueToHousingCosts =
    data?.housingBenefitCalculatorSpecificSupportCalculation
      ?.reductionsDueToHousingCosts
  const estimatedHousingBenefits =
    data?.housingBenefitCalculatorSpecificSupportCalculation
      ?.estimatedHousingBenefits

  const canSubmit = useMemo(() => {
    return Object.keys(inputState).every((key) => {
      if (key === 'householdMemberCount') {
        const householdMemberCount = inputState[key]
        return (
          householdMemberCount === 1 ||
          householdMemberCount === 2 ||
          householdMemberCount === 3 ||
          householdMemberCount === 4 ||
          householdMemberCount === 5 ||
          householdMemberCount === 6
        )
      }
      return Boolean(inputState[key as keyof InputState])
    })
  }, [inputState])

  const householdMemberOptions = useMemo<Option<number>[]>(() => {
    return [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: formatMessage(translationStrings.sixOrMore), value: 6 },
    ]
  }, [])

  return (
    <Box>
      <Box
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
        marginBottom={5}
      >
        <Stack space={5}>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {formatMessage(translationStrings.numberOfHouseholdMembers)}
            </Text>

            <Controller
              control={control}
              name="householdMemberCount"
              defaultValue={1}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select
                  size="sm"
                  options={householdMemberOptions}
                  value={householdMemberOptions.find(
                    (option) => option.value === value,
                  )}
                  onChange={(option) => {
                    if (option) {
                      onChange(option.value)
                      updateInputState('householdMemberCount', option.value)
                    }
                  }}
                />
              )}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {formatMessage(translationStrings.housingCostsPerMonth)}
            </Text>

            <InputController
              id="housingCost"
              control={control}
              name="housingCost"
              label={formatMessage(translationStrings.housingCostLabel)}
              placeholder={formatMessage(
                translationStrings.housingCostPlaceholder,
              )}
              currency={true}
              type="number"
              onChange={(event) => {
                updateInputState('housingCost', event.target.value)
              }}
              size="sm"
              required={true}
              maxLength={MAX_LENGTH}
            />
          </Box>
          <Text variant="small" lineHeight="lg">
            {formatMessage(translationStrings.calculatorDisclaimer)}
          </Text>
          <Button loading={loading} onClick={calculate} disabled={!canSubmit}>
            {formatMessage(translationStrings.calculate)}
          </Button>
        </Stack>
      </Box>
      {called && !error && data && (
        <Box
          background="blue100"
          paddingY={[3, 3, 5]}
          paddingX={[3, 3, 3, 3, 12]}
        >
          <Text variant="h3">
            <strong>{formatMessage(translationStrings.results)}</strong>
          </Text>
          <Stack space={5}>
            <Box>
              {typeof maximumHousingBenefits === 'number' && (
                <Text
                  variant="medium"
                  fontWeight="light"
                  paddingBottom={2}
                  paddingTop={5}
                >
                  {formatMessage(translationStrings.maximumHousingBenefits)}{' '}
                  {formatCurrency(maximumHousingBenefits)}{' '}
                  {formatMessage(translationStrings.perMonth)}
                </Text>
              )}

              <Stack space={1}>
                {typeof reductionsDueToHousingCosts === 'number' &&
                  reductionsDueToHousingCosts > 0 && (
                    <Text variant="medium" fontWeight="light">
                      {formatMessage(
                        translationStrings.reductionsDueToHousingCosts,
                      )}{' '}
                      {formatCurrency(reductionsDueToHousingCosts)}{' '}
                      {formatMessage(translationStrings.perMonth)}
                    </Text>
                  )}
              </Stack>
            </Box>

            {typeof estimatedHousingBenefits === 'number' && (
              <Text variant="medium" fontWeight="light">
                {formatMessage(translationStrings.estimatedHousingBenefits)}{' '}
                <strong>{formatCurrency(estimatedHousingBenefits)}</strong>{' '}
                {formatMessage(translationStrings.perMonth)}
              </Text>
            )}
          </Stack>
        </Box>
      )}
      {!loading && called && error && (
        <AlertMessage
          type="error"
          title={formatMessage(translationStrings.errorOccurredTitle)}
          message={formatMessage(translationStrings.errorOccurredMessage)}
        />
      )}
    </Box>
  )
}

export default SpecificHousingBenefitSupportCalculator
