import { FieldBaseProps } from '@island.is/application/core'
import { useAuth } from '@island.is/auth/react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { confirmation } from '../../lib/messages/confirmation'
import { CompanyIllustration } from '../Illustrations/CompanyIllustration'

export const ComplaintConfirmation: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const token = userInfo?.access_token ?? ''
  const basepath =
    process.env.DOWNLOAD_SERVICE_BASE_PATH ?? 'http://localhost:3377'
  const url = `${basepath}/download/v1/application/`

  const onClickHandler = () => {
    // Create form elements
    const form = document.createElement('form')
    const documentIdInput = document.createElement('input')
    const tokenInput = document.createElement('input')

    form.appendChild(documentIdInput)
    form.appendChild(tokenInput)

    // Form values
    form.method = 'post'

    form.action = url + application.id
    form.target = '_blank'

    // Document Id values
    documentIdInput.type = 'hidden'
    documentIdInput.name = 'applicationId'
    documentIdInput.value = application.id

    // National Id values
    tokenInput.type = 'hidden'
    tokenInput.name = '__accessToken'
    tokenInput.value = token

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  return (
    <Box marginTop={3}>
      <Text>{formatMessage(confirmation.labels.bulletOne)}</Text>
      <Box marginTop={5}>
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={onClickHandler}
          preTextIconType="filled"
          size="default"
          type="button"
          variant="ghost"
        >
          {formatMessage(confirmation.labels.pdfButton)}
        </Button>
      </Box>
      <Box marginTop={[3, 5, 12]}>
        <CompanyIllustration />
      </Box>
    </Box>
  )
}
