import React, { Fragment } from 'react'
import debounce from 'lodash/debounce'
import { RecordObject } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { PARTYOPERATIONIDS } from '../../utils/constants'
import { INPUTCHANGEINTERVAL } from '@island.is/application/templates/inao/shared'

interface PropTypes {
  getSum: () => void
  errors: RecordObject<unknown> | undefined
}

export const PartyExpenses = ({ errors, getSum }: PropTypes): JSX.Element => {
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
          id={PARTYOPERATIONIDS.electionOffice}
          name={PARTYOPERATIONIDS.electionOffice}
          label={formatMessage(m.electionOffice)}
          onChange={() => onInputChange(PARTYOPERATIONIDS.electionOffice)}
          error={
            errors && getErrorViaPath(errors, PARTYOPERATIONIDS.electionOffice)
          }
          rightAlign
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={PARTYOPERATIONIDS.otherCost}
          name={PARTYOPERATIONIDS.otherCost}
          label={formatMessage(m.otherOperationalCost)}
          onChange={() => onInputChange(PARTYOPERATIONIDS.otherCost)}
          error={errors && getErrorViaPath(errors, PARTYOPERATIONIDS.otherCost)}
          rightAlign
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
