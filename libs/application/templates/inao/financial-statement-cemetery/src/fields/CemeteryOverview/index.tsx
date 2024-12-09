import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  AlertBanner,
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { FinancialStatementCemetery } from '../../lib/dataSchema'
import { currencyStringToNumber, formatCurrency } from '../../utils/helpers'
import { AboutOverview } from './AboutOverview'
import { ValueLine } from './ValueLine'
import { CapitalNumberOverview } from './CapitalNumbersOverview'
import { BOARDMEMEBER } from '../../utils/constants'
import { FileValueLine } from './FileValueLine'
import {
  columnStyle,
  sectionColumn,
  starterColumnStyle,
} from './overviewStyles.css'
import { Fragment } from 'react/jsx-runtime'

export const CemeteryOverview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementCemetery
  const fileName = answers.attachments?.file?.[0]?.name
  const careTakerLimit = answers.cemeteryOperation?.incomeLimit ?? '0'
  const cemeteryIncome = currencyStringToNumber(answers.cemeteryIncome?.total)
  const fixedAssetsTotal = answers.cemeteryAsset?.fixedAssetsTotal
  const longTermDebt = answers.cemeteryLiability?.longTerm
  const email = getValueViaPath<string>(answers, 'about.email')
  const cemeteryCaretakers = answers.cemeteryCaretaker

  return (
    <Box marginBottom={2}>
      <Divider />
      <Box paddingY={3}>
        <AboutOverview answers={answers} />
      </Box>
      <Divider />
      <Box paddingY={3}>
        <Box className={starterColumnStyle}>
          <Text variant="h3" as="h3">
            {formatMessage(m.expensesIncome)}
          </Text>
        </Box>
        <GridRow>
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.income)}
              </Text>
            </Box>
            <ValueLine
              label={m.careIncome}
              value={formatCurrency(answers.cemeteryIncome?.careIncome)}
            />
            <ValueLine
              label={m.burialRevenue}
              value={formatCurrency(answers.cemeteryIncome?.burialRevenue)}
            />
            <ValueLine
              label={m.grantFromTheCemeteryFund}
              value={formatCurrency(
                answers.cemeteryIncome?.grantFromTheCemeteryFund,
              )}
            />
            <ValueLine
              label={m.otherIncome}
              value={formatCurrency(answers.cemeteryIncome?.otherIncome)}
            />
            <ValueLine
              isTotal
              label={m.totalIncome}
              value={formatCurrency(answers.cemeteryIncome?.total)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.expenses)}
              </Text>
            </Box>
            <ValueLine
              label={m.payroll}
              value={formatCurrency(answers.cemeteryExpense?.payroll)}
            />
            <ValueLine
              label={m.funeralCost}
              value={formatCurrency(answers.cemeteryExpense?.funeralCost)}
            />
            <ValueLine
              label={m.chapelExpense}
              value={formatCurrency(answers.cemeteryExpense?.chapelExpense)}
            />
            <ValueLine
              label={m.donationsToCemeteryFund}
              value={formatCurrency(
                answers.cemeteryExpense?.cemeteryFundExpense,
              )}
            />
            <ValueLine
              label={m.donationsToOther}
              value={formatCurrency(answers.cemeteryExpense?.donationsToOther)}
            />
            <ValueLine
              label={m.otherOperationCost}
              value={formatCurrency(
                answers.cemeteryExpense?.otherOperationCost,
              )}
            />
            <ValueLine
              label={m.depreciation}
              value={formatCurrency(answers.cemeteryExpense?.depreciation)}
            />
            <ValueLine
              isTotal
              label={m.totalExpenses}
              value={formatCurrency(answers.cemeteryExpense.total)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />

      <Box paddingY={3}>
        <CapitalNumberOverview answers={answers} />
      </Box>
      <Divider />
      <Box paddingY={3}>
        <Box className={starterColumnStyle}>
          <Text variant="h3" as="h3">
            {formatMessage(m.propertiesAndDebts)}
          </Text>
        </Box>
        <GridRow>
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.properties)}
              </Text>
            </Box>
            <ValueLine
              label={m.fixedAssetsTotal}
              value={formatCurrency(answers.cemeteryAsset?.fixedAssetsTotal)}
            />

            <ValueLine
              label={m.currentAssets}
              value={formatCurrency(answers.cemeteryAsset?.currentAssets)}
            />
            <ValueLine
              label={m.totalAssets}
              value={formatCurrency(
                answers.equityAndLiabilitiesTotals?.assetsTotal,
              )}
              isTotal
            />
          </GridColumn>

          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.debts)}
              </Text>
            </Box>
            <ValueLine
              label={m.longTerm}
              value={formatCurrency(answers.cemeteryLiability?.longTerm)}
            />
            <ValueLine
              label={m.shortTerm}
              value={formatCurrency(answers.cemeteryLiability?.shortTerm)}
            />
            <ValueLine
              isTotal
              label={m.totalLiabilities}
              value={formatCurrency(
                answers.equityAndLiabilitiesTotals?.liabilitiesTotal,
              )}
            />
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.equity)}
              </Text>
            </Box>
            <ValueLine
              label={m.equityAtTheBeginningOfTheYear}
              value={formatCurrency(
                answers.cemeteryEquity?.equityAtTheBeginningOfTheYear,
              )}
            />
            <ValueLine
              label={m.revaluationDueToPriceChanges}
              value={formatCurrency(
                answers.cemeteryEquity?.revaluationDueToPriceChanges,
              )}
            />
            <ValueLine
              label={m.reevaluateOther}
              value={formatCurrency(answers.cemeteryEquity?.reevaluateOther)}
            />
            <ValueLine
              label={m.operationResult}
              value={formatCurrency(answers.cemeteryEquity?.operationResult)}
            />
            <ValueLine
              isTotal
              label={m.totalEquity}
              value={formatCurrency(answers.cemeteryEquity?.total)}
            />
            <ValueLine
              isTotal
              label={m.debtsAndCash}
              value={formatCurrency(
                answers.equityAndLiabilitiesTotals?.equityAndLiabilitiesTotal,
              )}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      {parseInt(answers.cemeteryIncome?.total, 10) < Number(careTakerLimit) &&
      cemeteryCaretakers?.length > 0 ? (
        <>
          <Box className={starterColumnStyle}>
            <Text variant="h3" as="h3">
              {formatMessage(m.cemeteryBoardmembers)}
            </Text>
          </Box>
          {cemeteryCaretakers.map((careTaker, i) => (
            <Fragment key={i}>
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
                    <ValueLine
                      label={m.role}
                      value={
                        careTaker.role === BOARDMEMEBER
                          ? formatMessage(m.cemeteryBoardMember)
                          : formatMessage(m.cemeteryInspector)
                      }
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Divider />
            </Fragment>
          ))}
        </>
      ) : null}
      {fileName ? (
        <>
          <FileValueLine label={answers.attachments?.file?.[0]?.name} />
          <Divider />
        </>
      ) : null}
      {Number(cemeteryIncome) < Number(careTakerLimit) &&
      fixedAssetsTotal === '0' &&
      longTermDebt === '0' ? (
        <Box paddingTop={4}>
          <AlertBanner
            title={`${formatMessage(m.SignatureMessage)}`}
            description={`${formatMessage(
              m.SignatureMessage,
            )} ${email} ${formatMessage(m.SignaturePossible)}`}
            variant="info"
          />
        </Box>
      ) : null}
    </Box>
  )
}
