import React, { Fragment } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { INDIVIDUALOPERATIONIDS } from '../../lib/constants'

interface PropTypes {
  getSum: () => void
}

export const Expenses = ({ getSum }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.electionOffice}
          name={INDIVIDUALOPERATIONIDS.electionOffice}
          label={formatMessage(m.electionOffice)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.advertisements}
          name={INDIVIDUALOPERATIONIDS.advertisements}
          label={formatMessage(m.advertisements)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.travelCost}
          name={INDIVIDUALOPERATIONIDS.travelCost}
          label={formatMessage(m.travelCost)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.otherCost}
          name={INDIVIDUALOPERATIONIDS.otherCost}
          label={formatMessage(m.otherCost)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.capitalCost}
          name={INDIVIDUALOPERATIONIDS.capitalCost}
          label={formatMessage(m.capitalCost)}
          onBlur={() => getSum()}
          backgroundColor="blue"
          currency
        />
      </Box>
    </Fragment>
  )
}
