import React, { FC } from 'react'

import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { complaint } from '../../lib/messages'

export const ComplaintDocumentHeading: FC<FieldBaseProps> = () => {
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
