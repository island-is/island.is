import {
  ConnectedComponent,
  GetHousingBenefitCalculationQuery,
  GetHousingBenefitCalculationQueryVariables,
} from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  Inline,
  Input,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_HOUSING_BENEFIT_CALCULATION } from '@island.is/web/screens/queries/HousingBenefitCalculator'
import { useNamespace } from '@island.is/web/hooks'
import { formatCurrency } from '@island.is/application/ui-components'

interface HousingBenefitCalculatorProps {
  slice: ConnectedComponent
}

const HousingBenefitCalculator = ({ slice }: HousingBenefitCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
  const [state, setState] = useState({
    houseHoldMembers: 0,
    income: 0,
    assets: 0,
    housingCost: 0,
  })
  const handleChange = (event: any) => {
    if (event.target.name.includes('houseHoldMembers')) {
      setState({ ...state, houseHoldMembers: Number(event.target.value) })
    } else {
      event.target.value = event.target.value.replace('.', '')
      setState({ ...state, [event.target.name]: Number(event.target.value) })
    }
  }

  const [getCalculations, { data, loading, error, called }] = useLazyQuery<
    GetHousingBenefitCalculationQuery,
    GetHousingBenefitCalculationQueryVariables
  >(GET_HOUSING_BENEFIT_CALCULATION)

  const calculate = () => {
    getCalculations({
      variables: {
        input: {
          numberOfHouseholdMembers: state.houseHoldMembers,
          totalMonthlyIncome: state.income,
          totalAssets: state.assets,
          housingCostsPerMonth: state.housingCost,
        },
      },
    })
  }

  const formatInput = (event: any) => {
    event.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, '')
  }

  const maximumHousingBenefits =
    data?.housingBenefitCalculatorCalculation.maximumHousingBenefits
  const reduction = data?.housingBenefitCalculatorCalculation.reductions
  const estimatedHousingBenefits =
    data?.housingBenefitCalculatorCalculation?.estimatedHousingBenefits
  return (
    <Box>
      <Box background="blue100" paddingX={15} paddingY={8} marginBottom={5}>
        <Stack space={5}>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n(
                'Number of household members?',
                'Fjöldi heimilismanna í húsnæði?',
              )}
            </Text>

            <Inline space={5}>
              <RadioButton
                label="1"
                value={1}
                name="houseHoldMembers1"
                onChange={handleChange}
                checked={state.houseHoldMembers == 1}
              />
              <RadioButton
                label="2"
                value={2}
                name="houseHoldMembers2"
                onChange={handleChange}
                checked={state.houseHoldMembers == 2}
              />
              <RadioButton
                label="3"
                value={3}
                name="houseHoldMembers3"
                onChange={handleChange}
                checked={state.houseHoldMembers == 3}
              />
              <RadioButton
                label={n('4 or more', '4 eða fleiri')}
                value={4}
                name="houseHoldMembers4"
                onChange={handleChange}
                checked={state.houseHoldMembers == 4}
              />
            </Inline>
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n(
                'Total monthly income of household members aged 18 and over (income before tax)?',
                'Samtals mánaðarlegar tekjur heimilismanna 18 ára og eldri (tekjur f.skatt)?',
              )}
            </Text>
            <Input
              size="sm"
              label={n('Income', 'Tekjur')}
              name="income"
              placeholder={n('Income', 'Tekjur')}
              type="number"
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n(
                'Assets of household members aged 18 years and over?',
                'Eignir Heimilismanna 18 ára og eldri?',
              )}
            </Text>
            <Input
              size="sm"
              label={n('Assets', 'Eignir')}
              name="assets"
              placeholder={n('Assets', 'Eignir')}
              type="number"
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n('Housing costs per month?', 'Húsnæðiskostnaður á mánuði?')}
            </Text>
            <Input
              size="sm"
              label={n('Housing costs', 'Húsnæðiskostnaður')}
              name="housingCost"
              placeholder={n('Housing costs', 'Húsnæðiskostnaður')}
              type="number"
              onChange={handleChange}
            />
          </Box>
          <Text variant="eyebrow">
            {n(
              'The calculation of housing benefit is based on the assumptions you provided and is not considered a binding decision on housing benefit. The calculation is based on housing benefit payments for an entire calendar year.',
              'Útreikningur húsnæðisbóta samkvæmt reiknivélinni byggir á þeim forsendum sem þú gafst upp og telst ekki bindandi ákvörðun um húsnæðisbætur. Útreikningur miðast við greiðslur húsnæðisbóta fyrir heilt almanaksár.',
            )}
          </Text>
          <Button onClick={() => calculate()}>
            {n('Calculate', 'Reikna')}
          </Button>
        </Stack>
      </Box>
      <Box
        background="blue100"
        paddingX={15}
        paddingY={5}
        style={{ display: called ? 'block' : 'none' }}
      >
        <Text variant="h3">
          <strong>{n('Results', 'Niðurstöður')}</strong>
        </Text>
        <Text
          variant="medium"
          fontWeight="light"
          paddingBottom={2}
          paddingTop={5}
        >
          {n(
            'Maximum benefits based on the number of household members are ',
            'Hámarksbætur miðað við fjölda heimilismanna eru ',
          )}
          {formatCurrency(String(maximumHousingBenefits))}{' '}
          {n(' per month.', ' á mánuði.')}
        </Text>
        <Text variant="medium" fontWeight="light" paddingBottom={5}>
          {n(
            'Reductions due to income are ',
            'Skerðing vegna húsnæðiskostnaðar eru ',
          )}
          {formatCurrency(String(reduction))} {n(' per month.', ' á mánuði.')}
        </Text>
        <Text variant="medium" fontWeight="light">
          {n('Estimated housing benefits are ', 'Áætlaðar húsnæðisbætur eru ')}
          <strong>{formatCurrency(String(estimatedHousingBenefits))}</strong>
          {n(' per month.', ' á mánuði.')}
        </Text>
      </Box>
    </Box>
  )
}

export default HousingBenefitCalculator
