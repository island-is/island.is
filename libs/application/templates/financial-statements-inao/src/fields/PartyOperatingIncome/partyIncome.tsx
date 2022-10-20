import React, { Fragment } from 'react'
import debounce from 'lodash/debounce'
import { RecordObject } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { INPUTCHANGEINTERVAL, PARTYOPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const PartyIncome = ({ errors, getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.contributionsFromTheTreasury}
          name={PARTYOPERATIONIDS.contributionsFromTheTreasury}
          label={formatMessage(m.contributionsFromTheTreasury)}
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.contributionsFromTheTreasury)
          }
          backgroundColor="blue"
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
          backgroundColor="blue"
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
          backgroundColor="blue"
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
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.otherIncome)
          }
        />
      </Box>
    </Fragment>
  )
}
