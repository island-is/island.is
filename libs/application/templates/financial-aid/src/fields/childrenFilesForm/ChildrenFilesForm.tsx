import React from 'react'
import { useIntl } from 'react-intl'
import { Text, UploadFile } from '@island.is/island-ui/core'
import { childrenFilesForm } from '../../lib/messages'
import { UploadFileType } from '../..'
import Files from '../files/Files'
import { FieldBaseProps } from '@island.is/application/types'

export const ChildrenFilesForm = ({ field, application }: FieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers } = application

  return (
    <>
      <Text marginTop={2} marginBottom={[3, 3, 5]}>
        {formatMessage(childrenFilesForm.general.description)}
      </Text>
      <Files
        fileKey={field.id as UploadFileType}
        uploadFiles={answers[field.id] as unknown as UploadFile[]}
        folderId={id}
      />
    </>
  )
}
