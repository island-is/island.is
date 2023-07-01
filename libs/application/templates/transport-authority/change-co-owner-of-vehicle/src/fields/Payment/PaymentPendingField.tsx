import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { PaymentPending } from '@island.is/application/ui-components'
import { Conclusion } from '../Conclusion'
import { useLazyQuery } from '@apollo/client'
import { APPLICATION_APPLICATION } from '@island.is/application/graphql'
import { States } from '../../lib/constants'

export const PaymentPendingField: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application, refetch } = props

  const [conclusionScreen, setConclusionScreen] = useState(false)

  const [getApplicationInfo, { data }] = useLazyQuery(APPLICATION_APPLICATION)

  useEffect(() => {
    const updatedApplication = data?.applicationApplication
    if (updatedApplication?.state) {
      // If we are still in the payment state, then it is okay to call
      // refetch (this will be triggered when calling refetch inside PaymentPending
      // when an error occured calling submitApplication)
      if (updatedApplication.state === States.PAYMENT) {
        refetch?.()
      }
      // Otherwise we can display the conclusion screen (state changed
      // to review/completed)
      else {
        setConclusionScreen(true)
      }
    }
  }, [data, refetch])

  if (conclusionScreen) {
    return <Conclusion {...props} />
  }

  return (
    <PaymentPending
      application={application}
      refetch={() => {
        // Get the updated application state and either call refetch or display
        // conclusion screen
        getApplicationInfo({
          variables: {
            input: {
              id: application.id,
            },
            locale: 'is',
          },
        })
      }}
      targetEvent={DefaultEvents.SUBMIT}
    />
  )
}
