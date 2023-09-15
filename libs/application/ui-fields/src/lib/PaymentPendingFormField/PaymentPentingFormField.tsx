import React, { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { PaymentPending } from '@island.is/application/ui-components'

export const PaymentPendingFormField: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, refetch }) => {
  return (
    <PaymentPending
      application={application}
      refetch={refetch}
      targetEvent={DefaultEvents.SUBMIT}
    />
  )
}
