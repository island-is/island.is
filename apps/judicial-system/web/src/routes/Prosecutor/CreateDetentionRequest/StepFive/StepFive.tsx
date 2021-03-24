import React, { useEffect, useState } from 'react'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  AlertMessage,
} from '@island.is/island-ui/core'
import { Case, UpdateCase } from '@island.is/judicial-system/types'
import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
  CreatePresignedPostMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import { forEach } from 'lodash'
import { uploadFile } from '@island.is/judicial-system-web/src/services/api'
import * as styles from './StepFive.treat'

export const StepFive: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [files, setFiles] = useState<File[]>([])

  const router = useRouter()
  const id = router.query.id

  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Rannsóknargögn - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && resCase) {
      setWorkingCase(resCase)
    }
  }, [id, workingCase, setWorkingCase, resCase])

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const [createPresignedPostMutation] = useMutation(CreatePresignedPostMutation)

  const uploadFiles = (id: string, files: File[]) => {
    forEach(files, async (file) => {
      const { data } = await createPresignedPostMutation({
        variables: { input: { caseId: id, fileName: file.name } },
      })

      const presignedPost = data?.createPresignedPost

      if (presignedPost) {
        uploadFile(presignedPost, file)
      }
    })
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_FIVE
      }
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                Rannsóknargögn
              </Text>
            </Box>
            <Box marginBottom={5}>
              <AlertMessage
                title="Meðferð gagna"
                message={
                  <ul className={styles.ul}>
                    <li>
                      Hér er hægt að hlaða upp rannsóknargögnum til að sýna
                      dómara.
                    </li>
                    <li>
                      Skjölin eru eingöngu aðgengileg settum dómara í málinu og
                      aðgengi að þeim lokast þegar dómari hefur úrskurðað.
                    </li>
                    <li>
                      Skjölin verða ekki lögð fyrir eða flutt í málakerfi
                      dómstóls nema annar hvor aðilinn kæri úrskurðinn.
                    </li>
                  </ul>
                }
                type="info"
              />
            </Box>
            <Box marginBottom={3}>
              <Text variant="h3" as="h3">
                Rannsóknargögn
              </Text>
            </Box>
            <Box marginBottom={[2, 2, 3]}>
              <ContentBlock>
                <InputFileUpload
                  fileList={files}
                  header="Dragðu skjöl hingað til að hlaða upp"
                  buttonLabel="Velja skjöl til að hlaða upp"
                  onChange={(evt) => {
                    uploadFiles(workingCase.id, evt)
                    setFiles(evt)
                  }}
                  onRemove={() => console.log('remove')}
                  errorMessage=""
                />
              </ContentBlock>
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
              nextUrl={`${Constants.STEP_SIX_ROUTE}/${workingCase.id}`}
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepFive
