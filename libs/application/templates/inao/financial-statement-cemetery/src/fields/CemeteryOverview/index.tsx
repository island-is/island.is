import { Fragment } from 'react'
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
import { formatCurrency } from '../../utils/helpers'
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

export const CemeteryOverview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementCemetery
  const file = getValueViaPath<Array<File>>(answers, 'attachments.file')
  const fileName = file?.[0]?.name
  const incomeLimit =
    getValueViaPath<string>(answers, 'cemeteryOperations.incomeLimit') ?? '0'
  const email = getValueViaPath<string>(answers, 'about.email')
  const cemeteryCaretakers = answers.cemeteryCaretaker

  const careIncome = getValueViaPath<string>(
    answers,
    'cemeteryIncome.careIncome',
  )
  const burialRevenue = getValueViaPath<string>(
    answers,
    'cemeteryIncome.burialRevenue',
  )
  const grantFromTheCemeteryFund = getValueViaPath<string>(
    answers,
    'cemeteryIncome.grantFromTheCemeteryFund',
  )
  const otherIncome = getValueViaPath<string>(
    answers,
    'cemeteryIncome.otherIncome',
  )
  const totalIncome = getValueViaPath<string>(answers, 'cemeteryIncome.total')

  const payroll = getValueViaPath<string>(answers, 'cemeteryExpense.payroll')
  const funeralCost = getValueViaPath<string>(
    answers,
    'cemeteryExpense.funeralCost',
  )
  const chapelExpense = getValueViaPath<string>(
    answers,
    'cemeteryExpense.chapelExpense',
  )
  const donationsToCemeteryFund = getValueViaPath<string>(
    answers,
    'cemeteryExpense.cemeteryFundExpense',
  )
  const donationsToOther = getValueViaPath<string>(
    answers,
    'cemeteryExpense.donationsToOther',
  )
  const otherOperationCost = getValueViaPath<string>(
    answers,
    'cemeteryExpense.otherOperationCost',
  )
  const depreciation = getValueViaPath<string>(
    answers,
    'cemeteryExpense.depreciation',
  )
  const totalExpenses = getValueViaPath<string>(
    answers,
    'cemeteryExpense.total',
  )

  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    'cemeteryAsset.fixedAssetsTotal',
  )
  const currentAssets = getValueViaPath<string>(
    answers,
    'cemeteryAsset.currentAssets',
  )
  const totalAssets = getValueViaPath<string>(answers, 'assetsTotal')

  const longTerm = getValueViaPath<string>(
    answers,
    'cemeteryLiability.longTerm',
  )
  const shortTerm = getValueViaPath<string>(
    answers,
    'cemeteryLiability.shortTerm',
  )
  const totalLiabilities = getValueViaPath<string>(
    answers,
    'equityAndLiabilitiesTotals.liabilitiesTotal',
  )

  const equityAtTheBeginningOfTheYear = getValueViaPath<string>(
    answers,
    'cemeteryEquity.equityAtTheBeginningOfTheYear',
  )
  const revaluationDueToPriceChanges = getValueViaPath<string>(
    answers,
    'cemeteryEquity.revaluationDueToPriceChanges',
  )
  const reevaluateOther = getValueViaPath<string>(
    answers,
    'cemeteryEquity.reevaluateOther',
  )
  const operationResult = getValueViaPath<string>(
    answers,
    'cemeteryEquity.operationResult',
  )
  const totalEquity = getValueViaPath<string>(answers, 'cemeteryEquity.total')

  const debtsAndCash = getValueViaPath<string>(
    answers,
    'equityAndLiabilitiesTotals.equityAndLiabilitiesTotal',
  )

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
              value={formatCurrency(careIncome)}
            />
            <ValueLine
              label={m.burialRevenue}
              value={formatCurrency(burialRevenue)}
            />
            <ValueLine
              label={m.grantFromTheCemeteryFund}
              value={formatCurrency(grantFromTheCemeteryFund)}
            />
            <ValueLine
              label={m.otherIncome}
              value={formatCurrency(otherIncome)}
            />
            <ValueLine
              isTotal
              label={m.totalIncome}
              value={formatCurrency(totalIncome)}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.expenses)}
              </Text>
            </Box>
            <ValueLine label={m.payroll} value={formatCurrency(payroll)} />
            <ValueLine
              label={m.funeralCost}
              value={formatCurrency(funeralCost)}
            />
            <ValueLine
              label={m.chapelExpense}
              value={formatCurrency(chapelExpense)}
            />
            <ValueLine
              label={m.donationsToCemeteryFund}
              value={formatCurrency(donationsToCemeteryFund)}
            />
            <ValueLine
              label={m.donationsToOther}
              value={formatCurrency(donationsToOther)}
            />
            <ValueLine
              label={m.otherOperationCost}
              value={formatCurrency(otherOperationCost)}
            />
            <ValueLine
              label={m.depreciation}
              value={formatCurrency(depreciation)}
            />
            <ValueLine
              isTotal
              label={m.totalExpenses}
              value={formatCurrency(totalExpenses)}
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
              value={formatCurrency(fixedAssetsTotal)}
            />

            <ValueLine
              label={m.currentAssets}
              value={formatCurrency(currentAssets)}
            />
            <ValueLine
              label={m.totalAssets}
              value={formatCurrency(totalAssets)}
              isTotal
            />
          </GridColumn>

          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.debts)}
              </Text>
            </Box>
            <ValueLine label={m.longTerm} value={formatCurrency(longTerm)} />
            <ValueLine label={m.shortTerm} value={formatCurrency(shortTerm)} />
            <ValueLine
              isTotal
              label={m.totalLiabilities}
              value={formatCurrency(totalLiabilities)}
            />
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.equity)}
              </Text>
            </Box>
            <ValueLine
              label={m.equityAtTheBeginningOfTheYear}
              value={formatCurrency(equityAtTheBeginningOfTheYear)}
            />
            <ValueLine
              label={m.revaluationDueToPriceChanges}
              value={formatCurrency(revaluationDueToPriceChanges)}
            />
            <ValueLine
              label={m.reevaluateOther}
              value={formatCurrency(reevaluateOther)}
            />
            <ValueLine
              label={m.operationResult}
              value={formatCurrency(operationResult)}
            />
            <ValueLine
              isTotal
              label={m.totalEquity}
              value={formatCurrency(totalEquity)}
            />
            <ValueLine
              isTotal
              label={m.debtsAndCash}
              value={formatCurrency(debtsAndCash)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      {Number(totalIncome) < Number(incomeLimit) &&
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
          <FileValueLine label={file?.[0]?.name} />
          <Divider />
        </>
      ) : null}
      {Number(totalIncome) < Number(incomeLimit) &&
      fixedAssetsTotal === '0' &&
      longTerm === '0' ? (
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
