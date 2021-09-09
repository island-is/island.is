import React, { useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Footer,
  StatusLayout,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osksrc/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'
import { UserContext } from '@island.is/financial-aid-web/osksrc/components/UserProvider/UserProvider'
import {
  Application,
  ApplicationEventType,
  ApplicationState,
  FileType,
} from '@island.is/financial-aid/shared'
import { useMutation } from '@apollo/client'
import {
  CreateApplicationEventQuery,
  UpdateApplicationMutation,
} from '@island.is/financial-aid-web/oskgraphql/sharedGql'
import { Box, Input, Text } from '@island.is/island-ui/core'

import * as styles from './fileUpload.treat'

const FileUpload = () => {
  const { form } = useContext(FormContext)
  const router = useRouter()
  const [nextButtonText, setNextButtonText] = useState('Senda gögn')
  const { uploadFiles } = useFileUpload(form.otherFiles)
  const { user } = useContext(UserContext)

  const [comment, setComment] = useState<string>()

  const currentApplication = useMemo(() => {
    if (user?.currentApplication) {
      return user.currentApplication
    }
  }, [user])

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    UpdateApplicationMutation,
  )

  const [
    createApplicationEventMutation,
    { loading: isCreatingApplicationEvent },
  ] = useMutation(CreateApplicationEventQuery)

  const sendingFiles = async () => {
    if (form?.otherFiles.length <= 0) {
      setNextButtonText('Engar skrár til staðar')
      return
    }

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
          setNextButtonText('Skrám hefur verið hlaðið upp')
        },
      )
    } catch (e) {
      setNextButtonText('Ekki tókst að hlaða upp skrám')
    }
  }

  const sendingUserComment = async () => {
    try {
      await createApplicationEventMutation({
        variables: {
          input: {
            applicationId: router.query.id,
            comment: comment,
            eventType: ApplicationEventType.FILEUPLOAD,
          },
        },
      })
    } catch (e) {
      alert('vikarði ekki lúði')
    }
  }

  return (
    <StatusLayout>
      <Box className={styles.commentContainer}>
        <Files
          header="Senda inn gögn"
          fileKey="otherFiles"
          uploadFiles={form.otherFiles}
        />
      </Box>

      <Box className={styles.commentContainer}>
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
              setComment(event.currentTarget.value)
            }}
          />
        </Box>
      </Box>

      <Footer
        previousUrl={`/${router.query.id}`}
        nextButtonText={nextButtonText}
        onNextButtonClick={() => {
          Promise.all([sendingFiles(), sendingUserComment()])
        }}
      />
    </StatusLayout>
  )
}

export default FileUpload
