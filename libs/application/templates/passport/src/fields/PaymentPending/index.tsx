import React, { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { PaymentPending as Payment } from '@island.is/application/ui-components'
import { Passport } from '../../lib/constants'
import { hasSecondGuardian } from '../../lib/utils'

export const PaymentPending: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  const noAssignment =
    (application.answers.passport as Passport).userPassport !== '' ||
    !hasSecondGuardian(application.answers, application.externalData)
  return (
    <Payment
      application={application}
      refetch={refetch}
      targetEvent={noAssignment ? DefaultEvents.SUBMIT : DefaultEvents.ASSIGN}
    />
  )
}
