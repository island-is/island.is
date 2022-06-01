import React, { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/core'
import { PaymentPending } from '@island.is/application/ui-components'

export const PaymentPendingScreen: FC<FieldBaseProps> = ({
  application,
  refetch,
}) => {
  return (
    <PaymentPending
      application={application}
      refetch={refetch}
      targetEvent={DefaultEvents.SUBMIT}
    />
  )
}
