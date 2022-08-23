import React, { Fragment } from 'react'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { PARTYOPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
  errors: any
}

export const PartyIncome = ({ errors, getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()

  const onInputBlur = () => {
    getSum()
  }

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.publicDonations}
          name={PARTYOPERATIONIDS.publicDonations}
          label={formatMessage(m.publicDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.publicDonations)}
          onBlur={() => onInputBlur()}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.publicDonations)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.partyDonations}
          name={PARTYOPERATIONIDS.partyDonations}
          label={formatMessage(m.publicDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.publicDonations)}
          onBlur={() => onInputBlur()}
          backgroundColor="blue"
          currency
          error={errors?.income?.partyDonations?.message}
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.municipalityDonations}
          name={PARTYOPERATIONIDS.municipalityDonations}
          label={formatMessage(m.municipalityDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.municipalityDonations)}
          onBlur={() => onInputBlur()}
          backgroundColor="blue"
          currency
          error={
            errors &&
            getErrorViaPath(errors, PARTYOPERATIONIDS.municipalityDonations)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.individualDonations}
          name={PARTYOPERATIONIDS.individualDonations}
          label={formatMessage(m.individualDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.individualDonations)}
          onBlur={() => onInputBlur()}
          backgroundColor="blue"
          currency
          error={
            errors &&
            getErrorViaPath(errors, PARTYOPERATIONIDS.individualDonations)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.capitalIncome}
          name={PARTYOPERATIONIDS.capitalIncome}
          onChange={() => clearErrors(PARTYOPERATIONIDS.capitalIncome)}
          label={formatMessage(m.capitalIncome)}
          onBlur={() => onInputBlur()}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.capitalIncome)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.otherIncome}
          name={PARTYOPERATIONIDS.otherIncome}
          label={formatMessage(m.otherIncome)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.otherIncome)}
          onBlur={() => onInputBlur()}
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
