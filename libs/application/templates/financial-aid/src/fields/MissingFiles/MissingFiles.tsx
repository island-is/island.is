import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Text,
  Box,
  AlertMessage,
  Input,
  LoadingDots,
} from '@island.is/island-ui/core'
import {
  ApplicationEventType,
  ApplicationState,
  FileType,
  getCommentFromLatestEvent,
} from '@island.is/financial-aid/shared/lib'
import { getValueViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'

import { filesText, missingFiles } from '../../lib/messages'
import { Files } from '..'
import { FAFieldBaseProps, UploadFileType } from '../../lib/types'
import useApplication from '../../lib/hooks/useApplication'
import { Controller, useFormContext } from 'react-hook-form'
import { useFileUpload } from '../../lib/hooks/useFileUpload'
import DescriptionText from '../DescriptionText/DescriptionText'

const MissingFiles = ({
  application,
  setBeforeSubmitCallback,
  field,
}: FAFieldBaseProps) => {
  const { currentApplication, updateApplication, loading } = useApplication(
    application.externalData.currentApplication.data?.currentApplicationId,
  )
  const isSpouse = getValueViaPath(
    field as unknown as RecordObject,
    'props.isSpouse',
  )

  const { formatMessage } = useIntl()
  const { setValue, getValues } = useFormContext()

  const fileType: UploadFileType = 'otherFiles'
  const commentType = 'fileUploadComment'
  const files = getValues(fileType)

  const { uploadFiles } = useFileUpload(files, application.id)

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
  }, [files])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      setError(false)
      if (files.length <= 0) {
        setFilesError(true)
        return [false, formatMessage(filesText.errorMessage)]
      }

      try {
        if (
          !application.externalData.currentApplication.data
            ?.currentApplicationId
        ) {
          throw new Error()
        }

        const uploadedFiles = await uploadFiles(
          application.externalData.currentApplication.data.currentApplicationId,
          FileType.OTHER,
          files,
        )
        setValue(fileType, uploadedFiles)

        await updateApplication(
          ApplicationState.INPROGRESS,
          isSpouse
            ? ApplicationEventType.SPOUSEFILEUPLOAD
            : ApplicationEventType.FILEUPLOAD,
          getValues(commentType),
        )
      } catch (e) {
        setError(true)
        return [false, formatMessage(missingFiles.error.title)]
      }
      return [true, null]
    })

  if (loading) {
    return <LoadingDots />
  }

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
            message={
              <span dangerouslySetInnerHTML={{ __html: fileComment.comment }} />
            }
          />
        </Box>
      )}

      <Box marginBottom={[7, 7, 8]}>
        <Files
          fileKey={fileType}
          uploadFiles={files}
          folderId={application.id}
          hasError={filesError}
        />
      </Box>

      <Box marginBottom={[8, 8, 9]}>
        <Text as="h3" variant="h3" marginBottom={[3, 3, 4]}>
          {formatMessage(missingFiles.comment.title)}
        </Text>
        <Box marginBottom={4}>
          <Controller
            name={commentType}
            defaultValue={''}
            render={({ field: { onChange, value } }) => {
              return (
                <Input
                  id={commentType}
                  name={commentType}
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
                    setValue(commentType, e.target.value)
                  }}
                />
              )
            }}
          />
        </Box>
      </Box>

      {error && (
        <>
          <Text as="h3" variant="h4" color="red400" marginBottom={1}>
            {formatMessage(missingFiles.error.title)}
          </Text>
          <DescriptionText
            text={missingFiles.error.message}
            format={{
              email: application.externalData.municipality.data?.email ?? '',
            }}
          />
        </>
      )}
    </>
  )
}

export default MissingFiles
