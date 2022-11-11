import React, { Fragment, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'

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
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'

import { formatPhoneNumber } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { FileValueLine, ValueLine } from '../Shared'
import { formatCurrency } from '../../lib/utils/helpers'
import { starterColumnStyle } from '../Shared/styles/overviewStyles.css'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import BottomBar from '../../components/BottomBar'
import { GREATER } from '../../lib/constants'

export const Overview = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { errors, setError, setValue } = useFormContext()
  const [approveOverview, setApproveOverview] = useState(false)

  const answers = application.answers as FinancialStatementsInao
  const fileName = answers.attachments?.file?.[0]?.name
  const [
    submitApplication,
    { error: submitError, loading },
  ] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.SUBMIT,
  })

  const onBackButtonClick = () => {
    const incomeLimit = getValueViaPath(answers, 'election.incomeLimit')

    if (incomeLimit === GREATER) {
      goToScreen && goToScreen('attachments.file')
    } else {
      goToScreen && goToScreen('election')
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
        {answers.about.powerOfAttorneyName ? (
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyName}
              value={answers.about.powerOfAttorneyName}
            />
          </GridColumn>
        ) : null}
        {answers.about.powerOfAttorneyNationalId ? (
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.powerOfAttorneyNationalId}
              value={formatNationalId(answers.about.powerOfAttorneyNationalId)}
            />
          </GridColumn>
        ) : null}
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
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.candidatesOwnContributions}
            value={formatCurrency(
              answers.individualIncome?.candidatesOwnContributions,
            )}
          />
          <ValueLine
            label={m.contributionsFromLegalEntities}
            value={formatCurrency(
              answers.individualIncome?.contributionsByLegalEntities,
            )}
          />
          <ValueLine
            label={m.contributionsFromIndividuals}
            value={formatCurrency(
              answers.individualIncome?.individualContributions,
            )}
          />
          <ValueLine
            label={m.otherIncome}
            value={formatCurrency(answers.individualIncome?.otherIncome)}
          />
          <ValueLine
            label={m.totalIncome}
            value={formatCurrency(answers.individualIncome?.total)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.advertisements}
            value={formatCurrency(answers.individualExpense?.advertisements)}
          />
          <ValueLine
            label={m.electionOffice}
            value={formatCurrency(answers.individualExpense?.electionOffice)}
          />
          <ValueLine
            label={m.travelCost}
            value={formatCurrency(answers.individualExpense?.travelCost)}
          />
          <ValueLine
            label={m.otherCost}
            value={formatCurrency(answers.individualExpense?.otherCost)}
          />
          <ValueLine
            label={m.totalExpenses}
            value={formatCurrency(answers.individualExpense?.total)}
          />
        </GridColumn>
      </GridRow>
      <Divider />
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.capitalCost)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.capitalIncome}
            value={answers.capitalNumbers.capitalIncome}
          />
        </GridColumn>
        {answers.capitalNumbers?.capitalCost ? (
          <GridColumn span={['12/12', '6/12']}>
            <ValueLine
              label={m.capitalCost}
              value={formatPhoneNumber(answers.capitalNumbers.capitalCost)}
            />
          </GridColumn>
        ) : null}
      </GridRow>
      <GridRow>
        <GridColumn>
          <ValueLine
            label={m.totalCapital}
            value={formatCurrency(answers.capitalNumbers?.total)}
          />
        </GridColumn>
      </GridRow>
      <Divider />
      <Box paddingTop={4} paddingBottom={2}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersDebt)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.fixedAssetsTotal}
            value={formatCurrency(answers.asset?.fixedAssetsTotal)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.currentAssets}
            value={formatCurrency(answers.asset?.currentAssets)}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.totalAssets}
            value={formatCurrency(answers.asset?.total)}
          />
        </GridColumn>
      </GridRow>
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
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.totalLiabilities}
            value={formatCurrency(answers.liability?.total)}
          />
        </GridColumn>
      </GridRow>
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
            value={formatCurrency(answers.equityAndLiabilities?.total)}
          />
        </GridColumn>
      </GridRow>

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
      <Box background="blue100" padding={3}>
        <Controller
          name="applicationApprove"
          defaultValue={approveOverview}
          rules={{ required: true }}
          render={({ value, onChange }) => {
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
