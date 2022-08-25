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
import { ValueLine } from '../Shared'
import { CARETAKERLIMIT } from '../../lib/constants'
import {
  columnStyle,
  starterColumnStyle,
} from '../Shared/styles/overviewStyles.css'

export const CemetryOverview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao

  return (
    <Box marginBottom={2}>
      <Divider />
      <Box className={starterColumnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.operatingYear}
              value={
                answers.conditionalAbout?.operatingYear
                  ? answers.conditionalAbout.operatingYear
                  : '-'
              }
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
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
      <Box className={columnStyle}>
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
      <Box className={columnStyle}>
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
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherIncome}
              value={formatCurrency(answers.cemetryIncome?.otherIncome)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.caretaking}
              value={formatCurrency(answers.cemetryIncome?.caretaking)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.cemetryFundDonations}
              value={formatCurrency(
                answers.cemetryIncome?.cemetryFundDonations,
              )}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.graveIncome}
              value={formatCurrency(answers.cemetryIncome?.graveIncome)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.chapelExpense}
              value={formatCurrency(answers.cemetryExpense?.chapelExpense)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}></GridColumn>
        </GridRow>
      </Box>

      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.donationsToOther}
              value={formatCurrency(answers.cemetryExpense?.donationsToOther)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.funeralCost}
              value={formatCurrency(answers.cemetryExpense?.funeralCost)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.otherOperationCost}
              value={formatCurrency(answers.cemetryExpense?.otherOperationCost)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.payroll}
              value={formatCurrency(answers.cemetryExpense?.payroll)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.writtenOffExpense}
              value={formatCurrency(answers.cemetryExpense?.writtenOffExpense)}
            />
          </GridColumn>
        </GridRow>
      </Box>
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
          <GridColumn span={['12/12', '6/12']}></GridColumn>
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
              value={formatCurrency(answers.cemetryAsset?.current)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.tangibleAssets}
              value={formatCurrency(answers.cemetryAsset?.tangible)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.shortTerm}
              value={formatCurrency(answers.cemetryLiability?.shortTerm)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.longTerm}
              value={formatCurrency(answers.cemetryLiability?.longTerm)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.newYearequity}
              value={formatCurrency(answers.cemetryEquity?.newYearEquity)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.operationResult}
              value={formatCurrency(answers.cemetryEquity?.operationResult)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box className={columnStyle}>
        <GridRow>
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.reevaluatePrice}
              value={formatCurrency(answers.cemetryEquity?.reevaluatePrice)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      {parseInt(answers.cemetryIncome?.total, 10) < CARETAKERLIMIT &&
      answers.cemetryCaretaker?.length > 0 ? (
        <Fragment>
          <Box className={starterColumnStyle}>
            <Text variant="h3" as="h3">
              {formatMessage(m.cemeteryBoardmembers)}
            </Text>
          </Box>
          {answers.cemetryCaretaker.map((careTaker) => {
            return (
              <Fragment>
                <Box className={columnStyle}>
                  <GridRow>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine label={m.fullName} value={careTaker.name} />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine
                        label={m.nationalId}
                        value={formatNationalId(careTaker.nationalId)}
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Box className={columnStyle}>
                  <GridRow>
                    <GridColumn span={['12/12', '6/12']}>
                      <ValueLine label={m.role} value={careTaker.role} />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Divider />
              </Fragment>
            )
          })}
        </Fragment>
      ) : null}
    </Box>
  )
}
