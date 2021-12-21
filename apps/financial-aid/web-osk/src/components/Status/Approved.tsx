import React from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  ApplicationState,
  getState,
  currentMonth,
  Amount,
  acceptedAmountBreakDown,
} from '@island.is/financial-aid/shared/lib'
import { Breakdown } from '@island.is/financial-aid/shared/components'

interface Props {
  state: ApplicationState
  amount?: Amount
  isStateVisible: boolean
  isApplicant?: boolean
}

const Approved = ({
  state,
  amount,
  isStateVisible,
  isApplicant = true,
}: Props) => {
  if (!isStateVisible) {
    return null
  }

  return (
    <>
      <Text as="h2" variant="h3" color="mint600" marginBottom={[4, 4, 5]}>
        Umsókn {getState[state].toLowerCase()}
      </Text>
      {isApplicant && amount ? (
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            Veitt aðstoð
          </Text>
          <Breakdown calculations={acceptedAmountBreakDown(amount)} />
        </>
      ) : (
        <Text variant="intro">
          Umsóknin maka þíns um fjárhagsaðstoð í {currentMonth()} er samþykkt.
          Maki þinn fær frekari upplýsingar um veitta aðstoð.
        </Text>
      )}
    </>
  )
}

export default Approved
