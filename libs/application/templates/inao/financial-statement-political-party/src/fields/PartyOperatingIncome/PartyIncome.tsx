import { useEffect } from 'react'
import debounce from 'lodash/debounce'
import { RecordObject } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { FinancialStatementsInaoTaxInfo } from '@island.is/api/schema'
import { PARTYOPERATIONIDS } from '../../utils/constants'
import { INPUTCHANGEINTERVAL } from '@island.is/application/templates/inao/shared'

type Props = {
  data?: {
    financialStatementsInaoTaxInfo: FinancialStatementsInaoTaxInfo[]
  } | null
  loading: boolean
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const PartyIncome = ({ data, loading, errors, getSum }: Props) => {
  const { formatMessage } = useLocale()
  const { clearErrors, getValues, setValue } = useFormContext()
  useEffect(() => {
    const values = getValues()

    const contributionsFromTheTreasury = getValueViaPath(
      values,
      PARTYOPERATIONIDS.contributionsFromTheTreasury,
    )
    const parliamentaryPartySupport = getValueViaPath(
      values,
      PARTYOPERATIONIDS.parliamentaryPartySupport,
    )
    const municipalContributions = getValueViaPath(
      values,
      PARTYOPERATIONIDS.municipalContributions,
    )

    if (data?.financialStatementsInaoTaxInfo) {
      if (!contributionsFromTheTreasury) {
        setValue(
          PARTYOPERATIONIDS.contributionsFromTheTreasury,
          data.financialStatementsInaoTaxInfo?.[0]?.value?.toString() ?? '',
        )
      }
      if (!parliamentaryPartySupport) {
        setValue(
          PARTYOPERATIONIDS.parliamentaryPartySupport,
          data.financialStatementsInaoTaxInfo?.[1]?.value?.toString() ?? '',
        )
      }
      if (!municipalContributions) {
        setValue(
          PARTYOPERATIONIDS.municipalContributions,
          data.financialStatementsInaoTaxInfo?.[2]?.value?.toString() ?? '',
        )
      }
    }
    getSum()
  }, [data, getSum, setValue])

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.contributionsFromTheTreasury}
          name={PARTYOPERATIONIDS.contributionsFromTheTreasury}
          label={formatMessage(m.contributionsFromTheTreasury)}
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.contributionsFromTheTreasury)
          }
          rightAlign
          backgroundColor="blue"
          loading={loading}
          currency
          error={
            errors &&
            getErrorViaPath(
              errors,
              PARTYOPERATIONIDS.contributionsFromTheTreasury,
            )
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.parliamentaryPartySupport}
          name={PARTYOPERATIONIDS.parliamentaryPartySupport}
          label={formatMessage(m.parliamentaryPartySupport)}
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.parliamentaryPartySupport)
          }
          loading={loading}
          backgroundColor="blue"
          rightAlign
          currency
          error={
            errors &&
            getErrorViaPath(errors, PARTYOPERATIONIDS.parliamentaryPartySupport)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.municipalContributions}
          name={PARTYOPERATIONIDS.municipalContributions}
          label={formatMessage(m.municipalContributions)}
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.municipalContributions)
          }
          loading={loading}
          backgroundColor="blue"
          rightAlign
          currency
          error={
            errors &&
            getErrorViaPath(errors, PARTYOPERATIONIDS.municipalContributions)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.contributionsFromLegalEntities}
          name={PARTYOPERATIONIDS.contributionsFromLegalEntities}
          label={formatMessage(m.contributionsFromLegalEntities)}
          rightAlign
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.contributionsFromLegalEntities)
          }
          backgroundColor="blue"
          currency
          error={
            errors &&
            getErrorViaPath(
              errors,
              PARTYOPERATIONIDS.contributionsFromLegalEntities,
            )
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.contributionsFromIndividuals}
          name={PARTYOPERATIONIDS.contributionsFromIndividuals}
          label={formatMessage(m.contributionsFromIndividuals)}
          rightAlign
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.contributionsFromIndividuals)
          }
          backgroundColor="blue"
          currency
          error={
            errors &&
            getErrorViaPath(
              errors,
              PARTYOPERATIONIDS.contributionsFromIndividuals,
            )
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.generalMembershipFees}
          name={PARTYOPERATIONIDS.generalMembershipFees}
          label={formatMessage(m.generalMembershipFees)}
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.generalMembershipFees)
          }
          rightAlign
          backgroundColor="blue"
          currency
          error={
            errors &&
            getErrorViaPath(errors, PARTYOPERATIONIDS.generalMembershipFees)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.otherIncome}
          name={PARTYOPERATIONIDS.otherIncome}
          label={formatMessage(m.otherIncome)}
          onChange={() => onInputChange(PARTYOPERATIONIDS.otherIncome)}
          rightAlign
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.otherIncome)
          }
        />
      </Box>
    </>
  )
}
