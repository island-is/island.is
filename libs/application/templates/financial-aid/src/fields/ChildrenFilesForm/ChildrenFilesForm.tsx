import React from 'react'
import { useIntl } from 'react-intl'
import { Text, UploadFileDeprecated } from '@island.is/island-ui/core'
import { childrenFilesForm } from '../../lib/messages'
import {
  FAFieldBaseProps,
  OverrideAnswerSchema,
  UploadFileType,
} from '../../lib/types'
import Files from '../Files/Files'

const ChildrenFilesForm = ({ field, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers } = application

  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(childrenFilesForm.general.description)}
      </Text>
      <Files
        fileKey={field.id as UploadFileType}
        uploadFiles={
          answers[
            field.id as keyof OverrideAnswerSchema
          ] as UploadFileDeprecated[]
        }
        folderId={id}
      />
    </>
  )
}

export default ChildrenFilesForm
