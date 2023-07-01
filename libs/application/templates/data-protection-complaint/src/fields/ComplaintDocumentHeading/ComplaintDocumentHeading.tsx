import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Text } from '@island.is/island-ui/core'
import { complaint } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const ComplaintDocumentHeading: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h4" marginTop={4}>
        {formatMessage(complaint.labels.complaintDocumentsTitle)}
      </Text>
      <Text>
        {formatMessage(complaint.labels.complaintDocumentsIntroduction)}
      </Text>
    </>
  )
}
