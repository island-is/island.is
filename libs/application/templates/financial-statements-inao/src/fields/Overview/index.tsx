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
import { useLocale } from '@island.is/localization'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { m } from '../../lib/messages'
import {
  AboutOverview,
  AssetDebtEquityOverview,
  FileValueLine,
  ValueLine,
} from '../Shared'
import { formatCurrency } from '../../lib/utils/helpers'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import BottomBar from '../../components/BottomBar'
import { GREATER } from '../../lib/constants'
import { CapitalNumberOverview } from '../Shared/CapitalNumberOverview'
import {
  starterColumnStyle,
  sectionColumn,
} from '../Shared/styles/overviewStyles.css'

export const Overview = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
    setError,
    setValue,
  } = useFormContext()
  const [approveOverview, setApproveOverview] = useState(false)

  const answers = application.answers as FinancialStatementsInao
  const fileName = answers.attachments?.file?.[0]?.name

  const [submitApplication, { error: submitError, loading }] =
    useSubmitApplication({
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
        <GridRow direction="row">
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.income)}
              </Text>
            </Box>

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
              label={m.candidatesOwnContributions}
              value={formatCurrency(
                answers.individualIncome?.candidatesOwnContributions,
              )}
            />
            <ValueLine
              label={m.otherIncome}
              value={formatCurrency(answers.individualIncome?.otherIncome)}
            />
            <ValueLine
              label={m.totalIncome}
              value={formatCurrency(answers.individualIncome?.total)}
              isTotal
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.expenses)}
              </Text>
            </Box>
            <ValueLine
              label={m.electionOffice}
              value={formatCurrency(answers.individualExpense?.electionOffice)}
            />
            <ValueLine
              label={m.advertisements}
              value={formatCurrency(answers.individualExpense?.advertisements)}
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
              isTotal
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
        <AssetDebtEquityOverview answers={answers} />
      </Box>
      <Divider />

      <Box paddingY={3}>
        {fileName ? (
          <Fragment>
            <FileValueLine label={answers.attachments?.file?.[0]?.name} />
            <Divider />
          </Fragment>
        ) : null}
      </Box>

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
      {errors && getErrorViaPath(errors, 'applicationApprove') ? (
        <InputError errorMessage={formatMessage(m.errorApproval)} />
      ) : null}
      {submitError ? (
        <Box paddingY={3}>
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
