import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box, AlertMessage, Input } from '@island.is/island-ui/core'
import {
  ApplicationEventType,
  ApplicationState,
  FileType,
  getCommentFromLatestEvent,
} from '@island.is/financial-aid/shared/lib'

import { filesText, missingFiles } from '../../lib/messages'
import { Files } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import useApplication from '../../lib/hooks/useApplication'
import { Controller, useFormContext } from 'react-hook-form'
import { useFileUpload } from '../../lib/hooks/useFileUpload'
import DescriptionText from '../DescriptionText/DescriptionText'

const MissingFiles = ({
  application,
  setBeforeSubmitCallback,
}: FAFieldBaseProps) => {
  const { currentApplication, updateApplication } = useApplication(
    application.externalData.veita.data.currentApplicationId,
  )
  const { formatMessage } = useIntl()
  const { setValue, getValues } = useFormContext()
  const { uploadStateFiles } = useFileUpload(
    getValues('otherFiles'),
    application.id,
  )

  const [error, setError] = useState(false)
  const [filesError, setFilesError] = useState(false)

  const fileComment = useMemo(() => {
    if (currentApplication?.applicationEvents) {
      return getCommentFromLatestEvent(
        currentApplication?.applicationEvents,
        ApplicationEventType.DATANEEDED,
      )
    }
  }, [currentApplication])

  useEffect(() => {
    if (filesError) {
      setFilesError(false)
    }
  }, [getValues('otherFiles')])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      setError(false)
      if (getValues('otherFiles').length <= 0) {
        setFilesError(true)
        return [false, formatMessage(filesText.errorMessage)]
      }

      try {
        const uploadedFiles = await uploadStateFiles(
          application.externalData.veita.data.currentApplicationId,
          FileType.OTHER,
        )
        setValue('otherFiles', uploadedFiles)

        await updateApplication(
          ApplicationState.INPROGRESS,
          ApplicationEventType.FILEUPLOAD,
          getValues('fileUploadComment'),
        )
      } catch (e) {
        setError(true)
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

      <Box marginBottom={[7, 7, 8]}>
        <Files
          fileKey="otherFiles"
          uploadFiles={application.answers.otherFiles}
          folderId={application.id}
          hasError={filesError}
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

      {error && (
        <>
          <Text as="h3" variant="h4" color="red400" marginTop={[8, 8, 9]}>
            {formatMessage(missingFiles.error.title)}
          </Text>
          <DescriptionText
            textProps={{ marginTop: 1 }}
            text={missingFiles.error.message}
            format={{
              email:
                application.externalData.nationalRegistry.data.municipality
                  .email ?? '',
            }}
          />
        </>
      )}
    </>
  )
}

export default MissingFiles
