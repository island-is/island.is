import React from 'react'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { Text, Box } from '@island.is/island-ui/core'
import { UploadFileType } from '../../lib/types'
import { missingFiles } from '../../lib/messages'
import FileList from './FileList'
import { RecordObject } from '@island.is/shared/types'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'

const MissingFilesConfirmation = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()

  const isSpouse = getValueViaPath<boolean>(
    field as RecordObject<any>,
    'props.isSpouse',
  )
  const fileType: UploadFileType = isSpouse
    ? 'missingFilesSpouse'
    : 'missingFiles'
  const commentType = 'fileUploadComment'

  return (
    <>
      <Box>
        <FileList
          files={getValues(fileType)}
          applicationSystemId={application.id}
        />
      </Box>

      {getValues(commentType) && (
        <Box
          background="purple100"
          paddingX={4}
          paddingY={3}
          borderRadius="large"
        >
          <Text variant="eyebrow" marginBottom={1}>
            {formatMessage(missingFiles.confirmation.commentTitle)}
          </Text>
          <Text>{getValues(commentType)}</Text>
        </Box>
      )}
    </>
  )
}

export default MissingFilesConfirmation
