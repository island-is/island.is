import React, { useEffect, useState } from 'react'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  AlertMessage,
  UploadFile,
  UploadFileStatus,
} from '@island.is/island-ui/core'
import { Case, CreateFile, UpdateCase } from '@island.is/judicial-system/types'
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
  CreateFileMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import { forEach } from 'lodash'
import * as styles from './StepFive.treat'
import { createUploadFile } from '@island.is/judicial-system-web/src/services/api'

export const StepFive: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [files, setFiles] = useState<UploadFile[]>()

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

  const [createFileMutation] = useMutation(CreateFileMutation)

  const [createPresignedPostMutation] = useMutation(CreatePresignedPostMutation)

  const getFileIndexInFiles = (file: UploadFile, files: UploadFile[]) => {
    return files.findIndex((fileInFiles) => fileInFiles.name === file.name)
  }

  const onUpdate = (
    file: UploadFile,
    files: UploadFile[],
    loaded: number,
    total: number,
  ) => {
    file.percent = (loaded / total) * 100
    file.status = 'uploading'
    files[getFileIndexInFiles(file, files)].percent = (loaded / total) * 100
    files[getFileIndexInFiles(file, files)].status = 'uploading'

    setFiles(files)
  }

  const setFileStatus = (
    file: UploadFile,
    files: UploadFile[],
    status: UploadFileStatus,
  ) => {
    file.status = status
    files[getFileIndexInFiles(file, files)].status = status

    setFiles(files)
  }

  const createRequest = (file: UploadFile, files: UploadFile[]) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        onUpdate(file, files, evt.loaded, evt.total)
      }
    })

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        setFileStatus(file, files, 'done')
      } else {
        setFileStatus(file, files, 'error')
      }
    })

    return request
  }

  const uploadFiles = (id: string, files: UploadFile[]) => {
    forEach(files, async (aFile) => {
      const request = createRequest(aFile, files)
      const { data: presignedPostData } = await createPresignedPostMutation({
        variables: { input: { caseId: id, fileName: aFile.name } },
      })
      const presignedPost = presignedPostData?.createPresignedPost

      if (!presignedPost) {
        return
      }

      const { data: fileData } = await createFileMutation({
        variables: {
          input: { caseId: id, key: presignedPost.fields.key, size: 999 },
        },
      })

      const file = fileData?.createFileMutation

      if (file) {
        // do something
      }

      if (presignedPost) {
        const fileToUpload = createUploadFile(presignedPost, file)
        request.open('POST', presignedPost.url)
        request.send(fileToUpload)
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
                      <Box marginLeft={1}>
                        <Text>
                          Hér er hægt að hlaða upp rannsóknargögnum til að sýna
                          dómara.
                        </Text>
                      </Box>
                    </li>
                    <li>
                      <Box marginLeft={1}>
                        <Text>
                          Skjölin eru eingöngu aðgengileg settum dómara í málinu
                          og aðgengi að þeim lokast þegar dómari hefur
                          úrskurðað.
                        </Text>
                      </Box>
                    </li>
                    <li>
                      <Box marginLeft={1}>
                        <Text>
                          Skjölin verða ekki lögð fyrir eða flutt í málakerfi
                          dómstóls nema annar hvor aðilinn kæri úrskurðinn.
                        </Text>
                      </Box>
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
                  fileList={files || []}
                  header="Dragðu skjöl hingað til að hlaða upp"
                  buttonLabel="Velja skjöl til að hlaða upp"
                  onChange={(evt) => {
                    setFiles(evt)
                    uploadFiles(workingCase.id, evt)
                  }}
                  onRemove={() => console.log('remove')}
                  errorMessage=""
                  showFileSize
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
