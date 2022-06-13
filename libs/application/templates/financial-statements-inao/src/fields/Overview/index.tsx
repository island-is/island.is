import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { ValueLine } from './ValueLine'

export const Overview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao

  return (
    <Box marginBottom={2}>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.nationalId}
              value={formatNationalId(answers.about.nationalId)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine label={m.fullName} value={answers.about.fullName} />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyName}
              value={answers.about.powerOfAttorneyName}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyNationalId}
              value={formatNationalId(answers.about.powerOfAttorneyNationalId)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine label={m.email} value={answers.about.email} />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.phoneNumber}
              value={formatPhoneNumber(answers.about.phoneNumber)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalIncome}
              value={answers.incomeAndExpenses?.capital}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.personalIncome}
              value={answers.incomeAndExpenses?.personal}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.donations}
              value={answers.incomeAndExpenses?.donations}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalIncome}
              value={answers.incomeAndExpenses?.capitalIncome}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.keyNumbersParty}
              value={answers.incomeAndExpenses?.partyRunning}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersDebt)}
        </Text>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.debtsShort}
              value={answers.propertiesAndDebts?.debtsShort}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.debtsLong}
              value={answers.propertiesAndDebts?.longTermDebt}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.propertiesCash}
              value={answers.propertiesAndDebts?.propertiesCash}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.propertiesShort}
              value={answers.propertiesAndDebts?.propertiesShort}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
    </Box>
  )
}
