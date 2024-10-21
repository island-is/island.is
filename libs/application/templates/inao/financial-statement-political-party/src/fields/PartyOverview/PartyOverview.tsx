import { useState } from 'react'
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
import { getErrorViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import { FinancialStatementPoliticalParty } from '../../lib/dataSchema'
import { formatCurrency } from '@island.is/libs/application/templates/inao/shared/utils/helpers'
import { FileValueLine } from '@island.is/libs/application/templates/inao/shared/components/FileValueLine'
import { AssetDebtEquityOverview } from '@island.is/libs/application/templates/inao/shared/components/AssetDebtEquityOverview'
import {
  sectionColumn,
  starterColumnStyle,
} from '@island.is/libs/application/templates/inao/shared/components/css/overviewStyles.css'
import { CapitalNumberOverview } from '@island.is/libs/application/templates/inao/shared/components/CapitalNumberOverview'
import { AboutOverview } from '@island.is/libs/application/templates/inao/shared/components/AboutOverview'
import { ValueLine } from '@island.is/libs/application/templates/inao/shared/components/ValueLine'
import { BottomBar } from '@island.is/libs/application/templates/inao/shared/components/BottomBar'

export const PartyOverview = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [approveOverview, setApproveOverview] = useState(false)
  const {
    setError,
    setValue,
    formState: { errors },
  } = useFormContext()
  const answers = application.answers as FinancialStatementPoliticalParty
  const fileName = answers.attachments?.file?.[0]?.name
  const [submitApplication, { error: submitError, loading }] =
    useSubmitApplication({
      application,
      refetch,
      event: DefaultEvents.SUBMIT,
    })

  const onBackButtonClick = () => {
    goToScreen?.('attachments.file')
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
              value={formatCurrency(
                answers.partyIncome?.municipalContributions,
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
              isTotal
              label={m.totalIncome}
              value={formatCurrency(answers.partyIncome?.total)}
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
              value={formatCurrency(answers.partyExpense?.electionOffice)}
            />
            <ValueLine
              label={m.otherCost}
              value={formatCurrency(answers.partyExpense?.otherCost)}
            />
            <ValueLine
              isTotal
              label={m.totalExpenses}
              value={formatCurrency(answers.partyExpense?.total)}
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

        <AssetDebtEquityOverview
          liability={answers.liability}
          asset={answers.asset}
          equity={answers.equity}
          equityAndLiabilities={answers.equityAndLiabilities}
          fixedAssetsTotal={m.fixedAssetsTotal}
          currentAssets={m.currentAssets}
          totalAssets={m.totalAssets}
          longTerm={m.longTerm}
          shortTerm={m.shortTerm}
          totalLiabilities={m.totalLiabilities}
          equityTitle={m.equity}
          debtsAndCash={m.debtsAndCash}
          properties={m.properties}
          debtsAndEquity={m.debtsAndEquity}
        />
      </Box>
      <Divider />
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
