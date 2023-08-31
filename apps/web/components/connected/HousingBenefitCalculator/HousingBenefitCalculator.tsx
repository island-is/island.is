import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import {
  ConnectedComponent,
  GetHousingBenefitCalculationQuery,
  GetHousingBenefitCalculationQueryVariables,
} from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  Inline,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { GET_HOUSING_BENEFIT_CALCULATION } from '@island.is/web/screens/queries/HousingBenefitCalculator'
import { useNamespace } from '@island.is/web/hooks'
import { formatCurrency } from '@island.is/application/ui-components'

interface InputState {
  income: string
  housingCost: string
  assets: string
  householdMemberCount: number
}

interface HousingBenefitCalculatorProps {
  slice: ConnectedComponent
}

const HousingBenefitCalculator = ({ slice }: HousingBenefitCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
  const [inputState, setInputState] = useState<InputState>({
    income: '',
    housingCost: '',
    assets: '',
    householdMemberCount: 0,
  })

  const updateInputState = (key: keyof InputState, value: string | number) => {
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const { control, getValues } = useForm()

  const [fetchCalculation, { data, loading, called }] = useLazyQuery<
    GetHousingBenefitCalculationQuery,
    GetHousingBenefitCalculationQueryVariables
  >(GET_HOUSING_BENEFIT_CALCULATION)

  const calculate = () => {
    const values = getValues() as InputState
    console.log(values)
    fetchCalculation({
      variables: {
        input: {
          numberOfHouseholdMembers: values.householdMemberCount,
          totalMonthlyIncome: Number(values.income),
          totalAssets: Number(values.assets),
          housingCostsPerMonth: Number(values.housingCost),
        },
      },
    })
  }

  const maximumHousingBenefits =
    data?.housingBenefitCalculatorCalculation.maximumHousingBenefits
  const reduction = data?.housingBenefitCalculatorCalculation.reductions
  const estimatedHousingBenefits =
    data?.housingBenefitCalculatorCalculation?.estimatedHousingBenefits

  const canSubmit = useMemo(() => {
    return Object.keys(inputState).every((key: keyof InputState) => {
      if (key === 'householdMemberCount') {
        const householdMemberCount = inputState[key]
        return (
          householdMemberCount === 1 ||
          householdMemberCount === 2 ||
          householdMemberCount === 3 ||
          householdMemberCount === 4
        )
      }
      return Boolean(inputState[key])
    })
  }, [inputState])

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
              {n('numberOfHouseholdMembers', 'Fjöldi heimilismanna í húsnæði?')}
            </Text>

            <Controller
              control={control}
              name="householdMemberCount"
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Inline space={5} collapseBelow="sm">
                  <RadioButton
                    label="1"
                    name="oneHouseholdMember"
                    onChange={() => {
                      onChange(1)
                      updateInputState('householdMemberCount', 1)
                    }}
                    checked={value === 1}
                  />
                  <RadioButton
                    label="2"
                    name="twoHouseholdMembers"
                    onChange={() => {
                      onChange(2)
                      updateInputState('householdMemberCount', 2)
                    }}
                    checked={value === 2}
                  />
                  <RadioButton
                    label="3"
                    name="threeHouseholdMembers"
                    onChange={() => {
                      onChange(3)
                      updateInputState('householdMemberCount', 3)
                    }}
                    checked={value === 3}
                  />
                  <RadioButton
                    label={n('fourOrMore', '4 eða fleiri')}
                    name="fourOrMoreHouseholdMembers"
                    onChange={() => {
                      onChange(4)
                      updateInputState('householdMemberCount', 4)
                    }}
                    checked={value === 4}
                  />
                </Inline>
              )}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n(
                'monthlyIncomeOfHouseholdMembers18YearsAndOlder',
                'Samanlagðar mánaðarlegartekjur heimilismanna 18 ára og eldri (tekjur f. skatt)?',
              )}
            </Text>

            <InputController
              id="income"
              control={control}
              name="income"
              label={n('incomeLabel', 'Tekjur')}
              placeholder={n('incomePlaceholder', 'kr.')}
              currency={true}
              type="number"
              onChange={(event) => {
                updateInputState('income', event.target.value)
              }}
              size="sm"
              required={true}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n(
                'assetsOfHouseholdMembers18YearsAndOlder',
                'Eignir heimilismanna 18 ára og eldri?',
              )}
            </Text>

            <InputController
              id="assets"
              control={control}
              name="assets"
              label={n('assetsLabel', 'Eignir')}
              placeholder={n('assetsPlaceholder', 'kr.')}
              currency={true}
              type="number"
              onChange={(event) => {
                updateInputState('assets', event.target.value)
              }}
              size="sm"
              required={true}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n('housingCostsPerMonth', 'Húsnæðiskostnaður á mánuði?')}
            </Text>
            <InputController
              id="housingCost"
              control={control}
              name="housingCost"
              label={n('housingCostLabel', 'Húsnæðiskostnaður')}
              placeholder={n('housingCostPlaceholder', 'kr.')}
              currency={true}
              type="number"
              onChange={(event) => {
                updateInputState('housingCost', event.target.value)
              }}
              size="sm"
              required={true}
            />
          </Box>
          <Text variant="small" lineHeight="lg">
            {n(
              'calculatorDisclaimer',
              'Útreikningur húsnæðisbóta samkvæmt reiknivélinni byggir á þeim forsendum sem þú gafst upp og telst ekki bindandi ákvörðun um húsnæðisbætur. Útreikningur miðast við greiðslur húsnæðisbóta fyrir heilt almanaksár.',
            )}
          </Text>
          <Button
            loading={loading}
            onClick={() => {
              calculate()
            }}
            disabled={!canSubmit}
          >
            {n('calculate', 'Reikna')}
          </Button>
        </Stack>
      </Box>
      <Box
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
        style={{ display: called ? 'block' : 'none' }}
      >
        <Text variant="h3">
          <strong>{n('results', 'Niðurstöður')}</strong>
        </Text>
        <Text
          variant="medium"
          fontWeight="light"
          paddingBottom={2}
          paddingTop={5}
        >
          {n(
            'maximumHousingBenefits',
            'Hámarksbætur miðað við fjölda heimilismanna eru',
          )}{' '}
          {formatCurrency(String(maximumHousingBenefits))}{' '}
          {n('perMonth', 'á mánuði.')}
        </Text>
        <Text variant="medium" fontWeight="light" paddingBottom={5}>
          {n(
            'reductionDueToHousingCosts',
            'Skerðing vegna húsnæðiskostnaðar eru',
          )}{' '}
          {formatCurrency(String(reduction))} {n('perMonth', 'á mánuði.')}
        </Text>
        <Text variant="medium" fontWeight="light">
          {n('estimatedHousingBenefits ', 'Áætlaðar húsnæðisbætur eru ')}{' '}
          <strong>{formatCurrency(String(estimatedHousingBenefits))}</strong>{' '}
          {n('perMonth', 'á mánuði.')}
        </Text>
      </Box>
    </Box>
  )
}

export default HousingBenefitCalculator
