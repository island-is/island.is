import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Footer,
  Files,
  ContentContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osk/src/utils/useFileUpload'
import {
  Application,
  ApplicationEventType,
  ApplicationState,
  FileType,
} from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import {
  CreateApplicationEventQuery,
  UpdateApplicationMutation,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Box, Input, Text } from '@island.is/island-ui/core'

import { Routes } from '@island.is/financial-aid/shared/lib'
import cn from 'classnames'
import { ApplicationContext } from '../../../components/ApplicationProvider/ApplicationProvider'

const FileUpload = () => {
  const { form, updateForm } = useContext(FormContext)
  const { myApplication } = useContext(ApplicationContext)

  const router = useRouter()
  const { uploadFiles } = useFileUpload(form.otherFiles)

  const [error, setError] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    UpdateApplicationMutation,
  )

  const [createApplicationEventMutation] = useMutation(
    CreateApplicationEventQuery,
  )

  useEffect(() => {
    if (error) {
      setError(false)
    }
  }, [form?.otherFiles])

  const sendFiles = async () => {
    setIsLoading(true)

    try {
      await uploadFiles(router.query.id as string, FileType.OTHER).then(
        async () => {
          await updateApplicationMutation({
            variables: {
              input: {
                id: router.query.id,
                state: ApplicationState.INPROGRESS,
              },
            },
          })

          updateForm({
            ...form,
            status: ApplicationState.INPROGRESS,
          })

          router.push(
            `${Routes.statusFileUploadSuccess(router.query.id as string)}`,
          )
        },
      )
    } catch (e) {
      router.push(
        `${Routes.statusFileUploadFailure(router.query.id as string)}`,
      )
    }

    setIsLoading(false)
  }

  const sendUserComment = async () => {
    try {
      await createApplicationEventMutation({
        variables: {
          input: {
            applicationId: router.query.id,
            comment: form.fileUploadComment,
            eventType: ApplicationEventType.FILEUPLOAD,
          },
        },
      })
    } catch (e) {
      router.push(
        `${Routes.statusFileUploadFailure(router.query.id as string)}`,
      )
    }
  }

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
          Senda inn gögn
        </Text>

        <Files
          header="Senda inn gögn"
          fileKey="otherFiles"
          uploadFiles={form.otherFiles}
        />

        <Text as="h2" variant="h3" marginBottom={[2, 2, 3]}>
          Viltu láta fylgja með athugasemd?
        </Text>

        <Box marginBottom={[4, 4, 10]}>
          <Input
            label="Athugasemd"
            name="fileUploadComment"
            value={form.fileUploadComment}
            placeholder="Skrifaðu hér"
            rows={7}
            textarea
            backgroundColor="blue"
            onChange={(event) => {
              updateForm({
                ...form,
                fileUploadComment: event.currentTarget.value,
              })
            }}
          />
        </Box>

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && form?.otherFiles.length <= 0,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Það vantar gögn
          </Text>
        </div>
      </ContentContainer>

      <Footer
        previousUrl={Routes.statusPage(router.query.id as string)}
        nextButtonText={'Senda gögn'}
        nextIsLoading={isLoading}
        onNextButtonClick={() => {
          if (form?.otherFiles.length <= 0 || router.query.id === undefined) {
            return setError(true)
          }
          Promise.all([sendFiles(), sendUserComment()])
        }}
      />
    </>
  )
}

export default FileUpload
