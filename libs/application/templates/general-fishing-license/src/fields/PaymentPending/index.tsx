import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import React, { FC } from 'react'
import { PaymentPending } from '@island.is/application/ui-components'

export const PaymentPendingScreen: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, refetch }) => (
  <PaymentPending
    application={application}
    refetch={refetch}
    targetEvent={DefaultEvents.SUBMIT}
  />
)
