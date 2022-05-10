import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box, AlertMessage, Input } from '@island.is/island-ui/core'
import {
  ApplicationEventType,
  FileType,
  getCommentFromLatestEvent,
} from '@island.is/financial-aid/shared/lib'

import { filesText, missingFiles } from '../../lib/messages'
import { Files } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import useApplication from '../../lib/hooks/useApplication'
import { Controller, useFormContext } from 'react-hook-form'
import { useFileUpload } from '../../lib/hooks/useFileUpload'

const MissingFiles = ({
  application,
  setBeforeSubmitCallback,
}: FAFieldBaseProps) => {
  const { currentApplication } = useApplication(
    application.externalData.veita.data.currentApplicationId,
  )
  const { formatMessage } = useIntl()
  const { setValue, getValues } = useFormContext()
  const { uploadStateFiles } = useFileUpload(
    application.answers.otherFiles,
    application.id,
  )
  const [error, setError] = useState(false)

  const fileComment = useMemo(() => {
    if (currentApplication?.applicationEvents) {
      return getCommentFromLatestEvent(
        currentApplication?.applicationEvents,
        ApplicationEventType.DATANEEDED,
      )
    }
  }, [currentApplication])

  useEffect(() => {
    if (error) {
      setError(false)
    }
  }, [getValues('otherFiles')])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (getValues('otherFiles').length <= 0) {
        setError(true)
        return [false, formatMessage(filesText.errorMessage)]
      }
      try {
        await uploadStateFiles(
          application.externalData.veita.data.currentApplicationId,
          FileType.OTHER,
        )
      } catch (e) {
        return [false, 'Failed to upload files']
      }
      return [true, null]
    })

  return (
    <>
      <Text marginBottom={[4, 4, 5]}>
        {formatMessage(missingFiles.general.description)}
      </Text>

      {fileComment?.comment && (
        <Box marginBottom={[4, 4, 5]}>
          <AlertMessage
            type="warning"
            title={formatMessage(missingFiles.alert.title)}
            message={formatMessage(missingFiles.alert.message, {
              comment: fileComment.comment,
            })}
          />
        </Box>
      )}

      <Box marginBottom={[6, 6, 7]}>
        <Files
          fileKey="otherFiles"
          uploadFiles={application.answers.otherFiles}
          folderId={application.id}
          hasError={error}
        />
      </Box>

      <>
        <Text as="h3" variant="h3">
          {formatMessage(missingFiles.comment.title)}
        </Text>
        <Box marginTop={[3, 3, 4]} marginBottom={4}>
          <Controller
            name={'fileUploadComment'}
            defaultValue={application.answers.fileUploadComment}
            render={({ value, onChange }) => {
              return (
                <Input
                  id={'fileUploadComment'}
                  name={'fileUploadComment'}
                  label={formatMessage(missingFiles.comment.inputTitle)}
                  placeholder={formatMessage(
                    missingFiles.comment.inputPlaceholder,
                  )}
                  value={value}
                  textarea={true}
                  rows={8}
                  backgroundColor="blue"
                  onChange={(e) => {
                    onChange(e.target.value)
                    setValue('fileUploadComment', e.target.value)
                  }}
                />
              )
            }}
          />
        </Box>
      </>
    </>
  )
}

export default MissingFiles
