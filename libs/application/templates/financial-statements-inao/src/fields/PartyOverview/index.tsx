import React, { Fragment } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../../lib/utils/helpers'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { FileValueLine, ValueLine } from '../Shared'
import {
  columnStyle,
  starterColumnStyle,
} from '../Shared/styles/overviewStyles.css'

export const PartyOverview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao
  const fileName = answers.attachment?.file?.[0]?.name
  return (
    <Box marginBottom={2}>
      <Divider />
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.nationalId}
            value={
              answers.about?.nationalId
                ? formatNationalId(answers.about.nationalId)
                : '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine label={m.fullName} value={answers.about.fullName} />
        </GridColumn>
      </GridRow>
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
      <Divider />
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.partyDonations}
            value={formatCurrency(answers.partyIncome?.partyDonations)}
          />
          <ValueLine
            label={m.individualDonations}
            value={formatCurrency(answers.partyIncome?.individualDonations)}
          />
          <ValueLine
            label={m.municipalityDonations}
            value={formatCurrency(answers.partyIncome?.municipalityDonations)}
          />
          <ValueLine
            label={m.individualDonations}
            value={formatCurrency(answers.partyIncome?.individualDonations)}
          />
          <ValueLine
            label={m.publicDonations}
            value={formatCurrency(answers.partyIncome?.publicDonations)}
          />
          <ValueLine
            label={m.totalIncome}
            value={formatCurrency(answers.partyIncome?.total)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.electionOffice}
            value={formatCurrency(answers.partyExpense?.electionOffice)}
          />
          <ValueLine
            label={m.otherCost}
            value={formatCurrency(answers.partyExpense?.otherCost)}
          />
          <ValueLine
            label={m.totalExpenses}
            value={formatCurrency(answers.partyExpense?.total)}
          />
        </GridColumn>
      </GridRow>
      <Divider />
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.capitalNumbers)}
        </Text>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalIncome}
              value={formatCurrency(answers.capitalNumbers?.capitalIncome)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalCost}
              value={formatCurrency(answers.capitalNumbers?.capitalCost)}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.totalCapital}
              value={formatCurrency(answers.capitalNumbers?.total)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersDebt)}
        </Text>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.currentAssets}
              value={formatCurrency(answers.asset?.current)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.tangibleAssets}
              value={formatCurrency(answers.asset?.tangible)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.totalAssets}
              value={formatCurrency(answers.asset?.total)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.shortTerm}
              value={formatCurrency(answers.liability?.shortTerm)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.longTerm}
              value={formatCurrency(answers.liability?.longTerm)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.totalDebts}
              value={formatCurrency(answers.liability?.total)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.equity}
              value={formatCurrency(answers.equity?.totalEquity)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.debtsAndCash}
              value={formatCurrency(answers.equity?.total)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      {fileName ? (
        <Fragment>
          <FileValueLine label={answers.attachment?.file?.[0]?.name} />
          <Divider />
        </Fragment>
      ) : null}
    </Box>
  )
}
