import React, { Fragment } from 'react'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { OPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
}

export const Income = ({ getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.corporateDonations}
          name={OPERATIONIDS.corporateDonations}
          label={formatMessage(m.corporateDonation)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.individualDonations}
          name={OPERATIONIDS.individualDonations}
          label={formatMessage(m.individualDonations)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.personalDonations}
          name={OPERATIONIDS.personalDonations}
          label={formatMessage(m.personalDonations)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.otherIncome}
          name={OPERATIONIDS.otherIncome}
          label={formatMessage(m.otherIncome)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.capitalIncome}
          name={OPERATIONIDS.capitalIncome}
          label={formatMessage(m.capitalIncome)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
