import React from 'react'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'

import { Text, Box, Link } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../../lib/types'
import { missingFiles } from '../../../lib/messages'
import FileList from '../FileList/FileList'

const MissingFilesConfirmation = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()

  return (
    <>
      <Text variant="h3" color={'mint600'} marginBottom={3}>
        {formatMessage(missingFiles.confirmation.subtitle)}
      </Text>

      <Box>
        <FileList
          files={getValues('otherFiles')}
          applicationSystemId={application.id}
        />
      </Box>

      {getValues('fileUploadComment') && (
        <Box
          background="purple100"
          paddingX={4}
          paddingY={3}
          borderRadius="large"
        >
          <Text variant="eyebrow" marginBottom={1}>
            {formatMessage(missingFiles.confirmation.commentTitle)}
          </Text>
          <Text>{getValues('fileUploadComment')}</Text>
        </Box>
      )}

      <Box position="absolute" bottom={0}>
        <Link
          href={''}
          underline="normal"
          underlineVisibility="always"
          color="blue400"
          onClick={() => window.location.reload()}
        >
          {formatMessage(missingFiles.confirmation.linkStatusPage)}
        </Link>
      </Box>
    </>
  )
}

export default MissingFilesConfirmation
