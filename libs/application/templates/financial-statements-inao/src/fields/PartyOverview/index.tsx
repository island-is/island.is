import React, { Fragment, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import {
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

  const [submitApplication, { error: submitError }] = useSubmitApplication({
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
      <BottomBar
        onSendButtonClick={onSendButtonClick}
        onBackButtonClick={onBackButtonClick}
      />
    </Box>
  )
}
