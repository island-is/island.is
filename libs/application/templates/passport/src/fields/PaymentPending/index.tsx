import React, { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { PaymentPending as Payment } from '@island.is/application/ui-components'
import { Passport } from '../../lib/constants'

export const PaymentPending: FC<FieldBaseProps> = ({
  application,
  refetch,
}) => {
  return (
    <Payment
      application={application}
      refetch={refetch}
      targetEvent={
        (application.answers.passport as Passport).userPassport !== ''
          ? DefaultEvents.SUBMIT
          : DefaultEvents.ASSIGN
      }
    />
  )
}
