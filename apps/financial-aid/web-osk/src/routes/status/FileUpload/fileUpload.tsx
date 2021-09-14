import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Footer,
  StatusLayout,
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

const FileUpload = () => {
  const { form, updateForm, emptyFormProvider } = useContext(FormContext)
  const router = useRouter()
  const { uploadFiles } = useFileUpload(form.otherFiles)

  const [isLoading, setIsLoading] = useState(false)

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    UpdateApplicationMutation,
  )

  const [createApplicationEventMutation] = useMutation(
    CreateApplicationEventQuery,
  )

  const sendingFiles = async () => {
    if (form?.otherFiles.length <= 0 || router.query.id === undefined) {
      return
    }

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
            `${Routes.statusFileUpload(router.query.id as string)}/send`,
          )
        },
      )
    } catch (e) {
      router.push(`${Routes.statusFileUpload(router.query.id as string)}/villa`)
    }

    setIsLoading(false)
  }

  const sendingUserComment = async () => {
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
      router.push(`${Routes.statusFileUpload(router.query.id as string)}/villa`)
    }
  }

  return (
    <StatusLayout>
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
            name="comment"
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
      </ContentContainer>

      <Footer
        previousUrl={Routes.statusPage(router.query.id as string)}
        nextButtonText={'Senda gögn'}
        nextIsLoading={isLoading}
        onNextButtonClick={() => {
          Promise.all([sendingFiles(), sendingUserComment()])
        }}
      />
    </StatusLayout>
  )
}

export default FileUpload
