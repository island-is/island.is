import React, { Fragment } from 'react'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  INPUTCHANGEINTERVAL,
  INDIVIDUALOPERATIONIDS,
} from '../../lib/constants'
interface PropTypes {
  getSum: () => void
}

export const Income = ({ getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { errors, clearErrors } = useFormContext()

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.contributionsByLegalEntities}
          name={INDIVIDUALOPERATIONIDS.contributionsByLegalEntities}
          error={
            errors &&
            getErrorViaPath(
              errors,
              INDIVIDUALOPERATIONIDS.contributionsByLegalEntities,
            )
          }
          label={formatMessage(m.corporateDonation)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.contributionsByLegalEntities)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.individualContributions}
          name={INDIVIDUALOPERATIONIDS.individualContributions}
          error={
            errors &&
            getErrorViaPath(
              errors,
              INDIVIDUALOPERATIONIDS.individualContributions,
            )
          }
          label={formatMessage(m.individualContributions)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.individualContributions)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.candidatesOwnContributions}
          name={INDIVIDUALOPERATIONIDS.candidatesOwnContributions}
          error={
            errors &&
            getErrorViaPath(
              errors,
              INDIVIDUALOPERATIONIDS.candidatesOwnContributions,
            )
          }
          label={formatMessage(m.candidatesOwnContributions)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.candidatesOwnContributions)
          }
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.otherIncome}
          name={INDIVIDUALOPERATIONIDS.otherIncome}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.otherIncome)
          }
          label={formatMessage(m.otherIncome)}
          onChange={() => onInputChange(INDIVIDUALOPERATIONIDS.otherIncome)}
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
