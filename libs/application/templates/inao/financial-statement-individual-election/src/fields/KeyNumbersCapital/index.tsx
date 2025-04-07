import { useState, useEffect } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'
import { CAPITALNUMBERS, INPUTCHANGEINTERVAL } from '../../utils/constants'
import { m } from '../../lib/messages'
import { Total } from '../IndividualElectionOperatingIncome/Total'

export const KeyNumbersCapital = () => {
  const { formatMessage } = useLocale()
  const [totalCapital, setTotalCapital] = useState(0)
  const {
    clearErrors,
    formState: { errors },
    getValues,
  } = useFormContext()

  const getTotalCapital = () => {
    const values = getValues()

    const income = getValueViaPath(values, CAPITALNUMBERS.capitalIncome) || '0'
    const expense = getValueViaPath(values, CAPITALNUMBERS.capitalCost) || '0'
    const total = Number(income) - Number(expense)
    setTotalCapital(total)
  }

  useEffect(() => {
    getTotalCapital()
  }, [getTotalCapital])

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingY={1}>
            <InputController
              id={CAPITALNUMBERS.capitalIncome}
              name={CAPITALNUMBERS.capitalIncome}
              error={
                errors && getErrorViaPath(errors, CAPITALNUMBERS.capitalIncome)
              }
              onChange={debounce(() => {
                getTotalCapital()
                clearErrors(CAPITALNUMBERS.capitalIncome)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.capitalIncome)}
              backgroundColor="blue"
              rightAlign
              currency
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingY={1}>
            <InputController
              id={CAPITALNUMBERS.capitalCost}
              name={CAPITALNUMBERS.capitalCost}
              onChange={debounce(() => {
                getTotalCapital()
                clearErrors(CAPITALNUMBERS.capitalCost)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.capitalCost)}
              error={
                errors && getErrorViaPath(errors, CAPITALNUMBERS.capitalCost)
              }
              backgroundColor="blue"
              rightAlign
              currency
            />
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Total
            name={CAPITALNUMBERS.total}
            total={totalCapital}
            label={formatMessage(m.totalCapital)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
