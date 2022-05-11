import React from 'react'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'

import { Text, Box } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../../lib/types'
import { missingFiles } from '../../../lib/messages'
import FileList from '../FileList/FileList'

const MissingFilesConfirmation = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()

  return (
    <>
      <Text variant="h3" color={'mint600'}>
        {formatMessage(missingFiles.confirmation.subtitle)}
      </Text>
      <Box marginTop={3}>
        <FileList files={getValues('otherFiles')} />
      </Box>
      <Box
        background="purple100"
        paddingX={4}
        paddingY={3}
        marginBottom={[3, 3, 5]}
        borderRadius="large"
      >
        <Text variant="eyebrow" marginBottom={1}>
          {formatMessage(missingFiles.confirmation.commentTitle)}
        </Text>
        <Text>{getValues('fileUploadComment')}</Text>
      </Box>
    </>
  )
}

export default MissingFilesConfirmation
