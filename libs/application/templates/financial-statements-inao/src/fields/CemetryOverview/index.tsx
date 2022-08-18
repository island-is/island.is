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
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { ValueLine } from '../Shared'
import { CARETAKERLIMIT } from '../../lib/constants'

export const CemetryOverview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao

  return (
    <Box marginBottom={2}>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.operatingYear}
              value={
                answers.conditionalAbout?.operatingYear
                  ? formatNationalId(answers.conditionalAbout.operatingYear)
                  : '-'
              }
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
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
              value={answers.cemetryIncome?.capitalIncome}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.caretaking}
              value={answers.cemetryIncome?.caretaking}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.cemetryFundDonations}
              value={answers.cemetryIncome?.cemetryFundDonations}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.graveIncome}
              value={answers.cemetryIncome?.graveIncome}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherIncome}
              value={answers.cemetryIncome?.otherIncome}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.cemeteryFundExpense}
              value={answers.cemetryExpense?.chapelExpense}
            />
          </GridColumn>
        </GridRow>
      </Box>

      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.donationsToOther}
              value={answers.cemetryExpense?.donationsToOther}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.funeralCost}
              value={answers.cemetryExpense?.funeralCost}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherOperationCost}
              value={answers.cemetryExpense?.otherOperationCost}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.payroll}
              value={answers.cemetryExpense?.payroll}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.writtenOffExpense}
              value={answers.cemetryExpense?.writtenOffExpense}
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
              label={m.currentAssets}
              value={answers.cemetryAsset?.current}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.tangibleAssets}
              value={answers.cemetryAsset?.tangible}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.shortTerm}
              value={answers.cemetryLiability?.shortTerm}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.longTerm}
              value={answers.cemetryLiability?.longTerm}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.newYearequity}
              value={answers.cemetryEquity?.newYearEquity}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.operationResult}
              value={answers.cemetryEquity?.operationResult}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box paddingY={2}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.reevaluatePrice}
              value={answers.cemetryEquity?.reevaluatePrice}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      {parseInt(answers.cemetryIncome?.total, 10) < CARETAKERLIMIT &&
      answers.cemetryCaretaker?.length > 0
        ? 
        <Fragment>
          <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.cemeteryBoardmembers)}
        </Text>
      </Box> 
        {answers.cemetryCaretaker.map((careTaker) => {
            return (
              <Fragment>
                <Box paddingY={2}>
                  <GridRow>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine
                        label={m.fullName}
                        value={careTaker.name}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine
                        label={m.nationalId}
                        value={careTaker.nationalId}
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Box paddingY={2}>
                  <GridRow>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine
                        label={m.role}
                        value={careTaker.role}
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Divider />
              </Fragment>
            )
          })}
          </Fragment>
        : null}
        
    </Box>
  )
}
