import React, { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { PaymentPending as Payment } from '@island.is/application/ui-components'

export const PaymentPending: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  return (
    <Payment
      application={application}
      refetch={refetch}
      targetEvent={DefaultEvents.ASSIGN}
    />
  )
}
