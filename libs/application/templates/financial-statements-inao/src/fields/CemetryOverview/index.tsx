import React, { Fragment, useState } from 'react'
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
import { currencyStringToNumber, formatCurrency } from '../../lib/utils/helpers'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import { m } from '../../lib/messages'
import { AboutOverview, FileValueLine, ValueLine } from '../Shared'
import {
  columnStyle,
  sectionColumn,
  starterColumnStyle,
} from '../Shared/styles/overviewStyles.css'
import BottomBar from '../../components/BottomBar'
import { CapitalNumberOverview } from '../Shared/CapitalNumberOverview'
import { BOARDMEMEBER } from '../../lib/constants'

export const CemetryOverview = ({
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

  const answers = application.answers as FinancialStatementsInao
  const fileName = answers.attachments?.file?.[0]?.name
  const careTakerLimit = answers.cemetryOperation.incomeLimit ?? '0'
  const cemeteryIncome = currencyStringToNumber(answers.cemetryIncome?.total)
  const fixedAssetsTotal = answers.cemetryAsset?.fixedAssetsTotal
  const longTermDebt = answers.cemetryLiability?.longTerm
  const email = getValueViaPath(answers, 'about.email')
  const cemeteryCaretakers = answers.cemetryCaretaker

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
              value={formatCurrency(answers.cemetryIncome?.careIncome)}
            />
            <ValueLine
              label={m.burialRevenue}
              value={formatCurrency(answers.cemetryIncome?.burialRevenue)}
            />
            <ValueLine
              label={m.grantFromTheCemeteryFund}
              value={formatCurrency(
                answers.cemetryIncome?.grantFromTheCemeteryFund,
              )}
            />
            <ValueLine
              label={m.otherIncome}
              value={formatCurrency(answers.cemetryIncome?.otherIncome)}
            />
            <ValueLine
              isTotal
              label={m.totalIncome}
              value={formatCurrency(answers.cemetryIncome?.total)}
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
              value={formatCurrency(answers.cemetryExpense?.payroll)}
            />
            <ValueLine
              label={m.funeralCost}
              value={formatCurrency(answers.cemetryExpense?.funeralCost)}
            />
            <ValueLine
              label={m.chapelExpense}
              value={formatCurrency(answers.cemetryExpense?.chapelExpense)}
            />
            <ValueLine
              label={m.donationsToCemeteryFund}
              value={formatCurrency(
                answers.cemetryExpense?.cemeteryFundExpense,
              )}
            />
            <ValueLine
              label={m.donationsToOther}
              value={formatCurrency(answers.cemetryExpense?.donationsToOther)}
            />
            <ValueLine
              label={m.otherOperationCost}
              value={formatCurrency(answers.cemetryExpense?.otherOperationCost)}
            />
            <ValueLine
              label={m.depreciation}
              value={formatCurrency(answers.cemetryExpense?.depreciation)}
            />
            <ValueLine
              isTotal
              label={m.totalExpenses}
              value={formatCurrency(answers.cemetryExpense.total)}
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
              value={formatCurrency(answers.cemetryAsset?.fixedAssetsTotal)}
            />

            <ValueLine
              label={m.currentAssets}
              value={formatCurrency(answers.cemetryAsset?.currentAssets)}
            />
            <ValueLine
              label={m.totalAssets}
              value={formatCurrency(answers.cemetryAsset.total)}
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
              value={formatCurrency(answers.cemetryLiability?.longTerm)}
            />
            <ValueLine
              label={m.shortTerm}
              value={formatCurrency(answers.cemetryLiability?.shortTerm)}
            />
            <ValueLine
              isTotal
              label={m.totalLiabilities}
              value={formatCurrency(answers.cemetryLiability?.total)}
            />
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.equity)}
              </Text>
            </Box>
            <ValueLine
              label={m.equityAtTheBeginningOfTheYear}
              value={formatCurrency(
                answers.cemetryEquity?.equityAtTheBeginningOfTheYear,
              )}
            />
            <ValueLine
              label={m.revaluationDueToPriceChanges}
              value={formatCurrency(
                answers.cemetryEquity?.revaluationDueToPriceChanges,
              )}
            />
            <ValueLine
              label={m.reevaluateOther}
              value={formatCurrency(answers.cemetryEquity?.reevaluateOther)}
            />
            <ValueLine
              label={m.operationResult}
              value={formatCurrency(answers.cemetryEquity?.operationResult)}
            />
            <ValueLine
              isTotal
              label={m.totalEquity}
              value={formatCurrency(answers.cemetryEquity?.total)}
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
      {parseInt(answers.cemetryIncome?.total, 10) < Number(careTakerLimit) &&
      cemeteryCaretakers?.length > 0 ? (
        <Fragment>
          <Box className={starterColumnStyle}>
            <Text variant="h3" as="h3">
              {formatMessage(m.cemeteryBoardmembers)}
            </Text>
          </Box>
          {cemeteryCaretakers.map((careTaker) => (
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
        </Fragment>
      ) : null}
      {fileName ? (
        <Fragment>
          <FileValueLine label={answers.attachments?.file?.[0]?.name} />
          <Divider />
        </Fragment>
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
      />
    </Box>
  )
}
