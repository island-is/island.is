import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

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
  CreateFilesResponse,
} from '@island.is/financial-aid/shared/lib'
import { getValueViaPath } from '@island.is/application/core'
import { Application, RecordObject } from '@island.is/application/types'
import { FileUploadController } from '@island.is/application/ui-components'

import { filesText, missingFiles } from '../../lib/messages'
import { FAFieldBaseProps } from '../../lib/types'
import useApplication from '../../lib/hooks/useApplication'
import { Controller, useFormContext } from 'react-hook-form'
import DescriptionText from '../DescriptionText/DescriptionText'

const ApplicationFilesMutation = gql`
  mutation CreateMunicipalitiesFinancialAidFilesMutation(
    $input: MunicipalitiesFinancialAidApplicationFilesInput!
  ) {
    createMunicipalitiesFinancialAidApplicationFiles(input: $input) {
      success
      files {
        id
        key
        name
        size
      }
    }
  }
`

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
  const { setValue, getValues, watch } = useFormContext()

  const fileType = 'otherFiles'
  const commentType = 'fileUploadComment'
  const currentFiles = watch(fileType)

  const [createApplicationFiles] = useMutation<{
    createMunicipalitiesFinancialAidApplicationFiles: CreateFilesResponse
  }>(ApplicationFilesMutation)

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
    if (filesError && currentFiles?.length > 0) {
      setFilesError(false)
    }
  }, [currentFiles])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      setError(false)
      const files = getValues(fileType)
      if (!files || files.length <= 0) {
        setFilesError(true)
        return [false, formatMessage(filesText.errorMessage)]
      }

      try {
        const currentApplicationId =
          application.externalData.currentApplication.data
            ?.currentApplicationId
        if (!currentApplicationId) {
          throw new Error()
        }

        const formattedFiles = files.map(
          (f: { key: string; name: string }) => ({
            applicationId: currentApplicationId,
            name: f.name ?? '',
            key: f.key ?? '',
            size: 0,
            type: FileType.OTHER,
          }),
        )

        const result = await createApplicationFiles({
          variables: {
            input: { files: formattedFiles },
          },
        })

        const uploadedFiles =
          result.data?.createMunicipalitiesFinancialAidApplicationFiles?.files
        if (uploadedFiles) {
          setValue(fileType, uploadedFiles)
        }

        await updateApplication(
          ApplicationState.INPROGRESS,
          isSpouse
            ? ApplicationEventType.SPOUSEFILEUPLOAD
            : ApplicationEventType.FILEUPLOAD,
          getValues(commentType),
        )
      } catch {
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
        <FileUploadController
          id={fileType}
          application={application as unknown as Application}
          error={
            filesError ? formatMessage(filesText.errorMessage) : undefined
          }
          header={formatMessage(filesText.header)}
          description={formatMessage(filesText.description)}
          buttonLabel={formatMessage(filesText.buttonLabel)}
          multiple
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
