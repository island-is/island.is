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
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { getErrorViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../../lib/utils/helpers'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { FileValueLine, ValueLine } from '../Shared'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import BottomBar from '../../components/BottomBar'
import {
  columnStyle,
  starterColumnStyle,
} from '../Shared/styles/overviewStyles.css'

export const PartyOverview = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [approveOverview, setApproveOverview] = useState(false)
  const { errors, setError, setValue } = useFormContext()

  const answers = application.answers as FinancialStatementsInao
  const fileName = answers.attachment?.file?.[0]?.name

  const [
    submitApplication,
    { error: submitError, loading },
  ] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.SUBMIT,
  })

  const onBackButtonClick = () => {
    goToScreen && goToScreen('attachment.file')
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
      <Box className={starterColumnStyle}>
        <Text variant="h3" as="h3">
          {formatMessage(m.keyNumbersIncomeAndExpenses)}
        </Text>
      </Box>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <ValueLine
            label={m.contributionsFromTheTreasury}
            value={formatCurrency(
              answers.partyIncome?.contributionsFromTheTreasury,
            )}
          />
          <ValueLine
            label={m.parliamentaryPartySupport}
            value={formatCurrency(
              answers.partyIncome?.parliamentaryPartySupport,
            )}
          />
          <ValueLine
            label={m.municipalContributions}
            value={formatCurrency(answers.partyIncome?.municipalContributions)}
          />
          <ValueLine
            label={m.contributionsFromIndividuals}
            value={formatCurrency(
              answers.partyIncome?.contributionsFromIndividuals,
            )}
          />
          <ValueLine
            label={m.contributionsFromLegalEntities}
            value={formatCurrency(
              answers.partyIncome?.contributionsFromLegalEntities,
            )}
          />
          <ValueLine
            label={m.contributionsFromIndividuals}
            value={formatCurrency(
              answers.partyIncome?.contributionsFromIndividuals,
            )}
          />
          <ValueLine
            label={m.generalMembershipFees}
            value={formatCurrency(answers.partyIncome?.generalMembershipFees)}
          />
          <ValueLine
            label={m.otherIncome}
            value={formatCurrency(answers.partyIncome?.otherIncome)}
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
