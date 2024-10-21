import { useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'

import {
  AlertBanner,
  Box,
  Checkbox,
  Divider,
  GridColumn,
  GridRow,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { format as formatNationalId } from 'kennitala'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import { m } from '../../lib/messages'
import { FinancialStatementCemetery } from '../../lib/dataSchema'
import { currencyStringToNumber } from '../../../../shared/utils/helpers'
import { BOARDMEMEBER } from '../../utils/constants'
import {
  columnStyle,
  sectionColumn,
  starterColumnStyle,
} from './overviewStyles.css'
import { AboutOverview } from '../../../../shared/components/AboutOverview'
import { ValueLine } from '../../../../shared/components/ValueLine'
import { BottomBar } from '../../../../shared/components/BottomBar'
import { FileValueLine } from '../../../../shared/components/FileValueLine'
import { formatCurrency } from '../../../../shared/utils/helpers'
import { CapitalNumberOverview } from '../../../../shared/components/CapitalNumberOverview'

export const CemeteryOverview = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const {
    formState: { errors },
    setError,
    setValue,
  } = useFormContext()
  const { formatMessage } = useLocale()
  const [approveOverview, setApproveOverview] = useState(false)

  const [submitApplication, { error: submitError, loading }] =
    useSubmitApplication({
      application,
      refetch,
      event: DefaultEvents.SUBMIT,
    })

  const answers = application.answers as FinancialStatementCemetery
  const fileName = answers.attachments?.file?.[0]?.name
  const careTakerLimit = answers.cemeteryOperation?.incomeLimit ?? '0'
  const cemeteryIncome = currencyStringToNumber(answers.cemeteryIncome?.total)
  const fixedAssetsTotal = answers.cemeteryAsset?.fixedAssetsTotal
  const longTermDebt = answers.cemeteryLiability?.longTerm
  const email = getValueViaPath(answers, 'about.email')
  const cemeteryCaretakers = answers.cemeteryCaretaker

  const onBackButtonClick = () => {
    if (
      Number(cemeteryIncome) < Number(careTakerLimit) &&
      fixedAssetsTotal === '0' &&
      longTermDebt === '0'
    ) {
      goToScreen && goToScreen('caretakers')
    } else {
      goToScreen && goToScreen('attachments.file')
    }
  }

  const onSendButtonClick = () => {
    if (approveOverview) {
      submitApplication()
    } else {
      setError('applicationApprove', {
        type: 'error',
      })
    }
  }

  return (
    <Box marginBottom={2}>
      <Divider />
      <Box paddingY={3}>
        <AboutOverview
          about={answers.about}
          fullName={m.fullName}
          nationalId={m.nationalId}
          powerOfAttorneyName={m.powerOfAttorneyName}
          powerOfAttorneyNationalId={m.powerOfAttorneyNationalId}
          email={m.email}
          phoneNumber={m.phoneNumber}
        />
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
        <CapitalNumberOverview
          capitalNumbersMessage={m.capitalNumbers}
          capitalIncomeMessage={m.capitalIncome}
          capitalIncome={answers.capitalNumbers.capitalIncome}
          capitalCostMessage={m.capitalCost}
          capitalCost={answers.capitalNumbers.capitalCost}
          totalCapitalMessage={m.totalCapital}
          total={answers.capitalNumbers.total}
        />
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
              value={formatCurrency(answers.cemeteryAsset.total)}
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
              value={formatCurrency(answers.cemeteryLiability?.total)}
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
              value={formatCurrency(answers.equityAndLiabilities?.total)}
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
          {cemeteryCaretakers.map((careTaker) => (
            <>
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
            </>
          ))}
        </>
      ) : null}
      {fileName ? (
        <>
          <FileValueLine
            label={answers.attachments?.file?.[0]?.name}
            files={m.files}
          />
          <Divider />
        </>
      ) : null}
      <Box paddingY={3}>
        <Text variant="h3" as="h3">
          {formatMessage(m.overview)}
        </Text>
      </Box>

      <Box background="blue100">
        <Controller
          name="applicationApprove"
          defaultValue={approveOverview}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setApproveOverview(e.target.checked)
                  setValue('applicationApprove' as string, e.target.checked)
                }}
                checked={value}
                name="applicationApprove"
                id="applicationApprove"
                label={formatMessage(m.overviewCorrect)}
                large
              />
            )
          }}
        />
      </Box>
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
      {errors && getErrorViaPath(errors, 'applicationApprove') ? (
        <InputError errorMessage={formatMessage(m.errorApproval)} />
      ) : null}
      {submitError ? (
        <Box paddingY={2}>
          <AlertBanner
            title={formatMessage(m.submitErrorTitle)}
            description={formatMessage(m.submitErrorMessage)}
            variant="error"
            dismissable
          />
        </Box>
      ) : null}
      <BottomBar
        loading={loading}
        onSendButtonClick={onSendButtonClick}
        onBackButtonClick={onBackButtonClick}
        goBack={m.goBack}
        send={m.send}
      />
    </Box>
  )
}
