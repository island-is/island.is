import React from 'react'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'

import { Text, Box, Button } from '@island.is/island-ui/core'

import { FAFieldBaseProps, UploadFileType } from '../../../lib/types'
import { missingFiles } from '../../../lib/messages'
import FileList from '../FileList/FileList'

const MissingFilesConfirmation = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()

  const fileType: UploadFileType = 'otherFiles'
  const commentType = 'fileUploadComment'

  return (
    <>
      <Text variant="h3" color={'mint600'} marginBottom={3}>
        {formatMessage(missingFiles.confirmation.subtitle)}
      </Text>

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

      <Box marginTop={10} width="full" display="flex" justifyContent="flexEnd">
        <Button onClick={() => window.location.reload()}>
          {formatMessage(missingFiles.confirmation.linkStatusPage)}
        </Button>
      </Box>
    </>
  )
}

export default MissingFilesConfirmation
