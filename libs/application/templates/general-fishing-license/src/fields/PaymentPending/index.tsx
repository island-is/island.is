import { DefaultEvents, FieldBaseProps } from '@island.is/application/core'
import React, { FC } from 'react'
import { PaymentPending } from '@island.is/application/ui-components'

export const PaymentPendingScreen: FC<FieldBaseProps> = ({
  application,
  refetch,
}) => (
  <PaymentPending
    application={application}
    refetch={refetch}
    targetEvent={DefaultEvents.SUBMIT}
  />
)
