import { FC, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { RejectConfirmationModal } from '../Components/RejectConfirmationModal'

export const HandleReject: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
  refetch,
}) => {
  const [rejectModalVisibility, setRejectModalVisibility] =
    useState<boolean>(false)

  setBeforeSubmitCallback?.(async (event) => {
    if (event === DefaultEvents.REJECT) {
      setRejectModalVisibility(true)
      return [false, '']
    }
    return [true, null]
  })

  return (
    <RejectConfirmationModal
      visibility={rejectModalVisibility}
      setVisibility={setRejectModalVisibility}
      application={application}
      refetch={refetch}
    />
  )
}
