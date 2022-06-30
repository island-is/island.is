import React, { Fragment } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { OPERATIONIDS, PARTY } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
}

export const Expenses = ({ getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.electionOffice}
          name={OPERATIONIDS.electionOffice}
          label={formatMessage(m.electionOffice)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.advertisements}
          name={OPERATIONIDS.advertisements}
          label={formatMessage(m.advertisements)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.travelCost}
          name={OPERATIONIDS.travelCost}
          label={formatMessage(m.travelCost)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.otherCost}
          name={OPERATIONIDS.otherCost}
          label={formatMessage(m.otherCost)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={OPERATIONIDS.capitalCost}
          name={OPERATIONIDS.capitalCost}
          label={formatMessage(m.capitalCost)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
