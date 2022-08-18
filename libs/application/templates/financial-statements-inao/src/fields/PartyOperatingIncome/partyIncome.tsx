import React, { Fragment } from 'react'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { PARTYOPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  checkIfEmpty: (fieldId: string) => void,
  getSum: () => void,
  errors: any
}

export const PartyIncome = ({ errors, checkIfEmpty, getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()

  const onInputBlur = (fieldId: string) => {
    getSum()
    checkIfEmpty(fieldId)
  }

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.publicDonations}
          name={PARTYOPERATIONIDS.publicDonations}
          label={formatMessage(m.publicDonations)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.publicDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.publicDonations)}
          backgroundColor="blue"
          currency
          error={errors?.income?.publicDonations?.message}
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.partyDonations}
          name={PARTYOPERATIONIDS.partyDonations}
          label={formatMessage(m.partyDonations)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.partyDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.partyDonations)}
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
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.municipalityDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.municipalityDonations)}
          backgroundColor="blue"
          currency
          error={errors?.income?.municipalityDonations?.message}
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.individualDonations}
          name={PARTYOPERATIONIDS.individualDonations}
          label={formatMessage(m.individualDonations)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.individualDonations)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.individualDonations)}
          backgroundColor="blue"
          currency
          error={errors?.income?.individualDonations?.message}
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.capitalIncome}
          name={PARTYOPERATIONIDS.capitalIncome}
          label={formatMessage(m.capitalIncome)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.capitalIncome)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.capitalIncome)}
          backgroundColor="blue"
          currency
          error={errors?.income?.capitalIncome?.message}
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.otherIncome}
          name={PARTYOPERATIONIDS.otherIncome}
          label={formatMessage(m.otherIncome)}
          onBlur={() => onInputBlur(PARTYOPERATIONIDS.otherIncome)}
          onChange={() => clearErrors(PARTYOPERATIONIDS.otherIncome)}
          backgroundColor="blue"
          currency
          error={errors?.income?.otherIncome?.message}
        />
      </Box>
    </Fragment>
  )
}
