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
          id={PARTYOPERATIONIDS.publicDonations}
          name={PARTYOPERATIONIDS.publicDonations}
          label={formatMessage(m.publicDonations)}
          onChange={() => onInputChange(PARTYOPERATIONIDS.publicDonations)}
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
          onChange={() => onInputChange(PARTYOPERATIONIDS.publicDonations)}
          backgroundColor="blue"
          currency
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.publicDonations)
          }
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.municipalityDonations}
          name={PARTYOPERATIONIDS.municipalityDonations}
          label={formatMessage(m.municipalityDonations)}
          onChange={() =>
            onInputChange(PARTYOPERATIONIDS.municipalityDonations)
          }
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
          onChange={() => onInputChange(PARTYOPERATIONIDS.individualDonations)}
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
