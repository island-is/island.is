import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles } from '@island.is/judicial-system-web/messages'
import { Box, InputFileUpload, Text } from '@island.is/island-ui/core'
import { CaseFile, CaseFileCategory } from '@island.is/judicial-system/types'
import { useS3UploadV2 } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { policeCaseFiles as m } from './PoliceCaseFilesRoute.strings'
import { PoliceCaseFileCheck, PoliceCaseFiles } from '../../components'
import { LocalUploadFile } from '@island.is/judicial-system-web/src/utils/hooks/useS3UploadV2/useS3UploadV2'

const mapCaseFileToUploadFile = (file: CaseFile): LocalUploadFile => ({
  displayId: file.id,
  name: file.name,
  type: file.type,
  id: file.id,
  key: file.key,
  status: 'done',
  percent: 100,
  size: file.size,
})

const AssignFilesToPoliceCase: React.FC<{
  caseId: string
  policeCaseNumber: string
  setAllUploaded: (allUploaded: boolean) => void
  caseFiles: CaseFile[]
}> = ({ caseId, policeCaseNumber, setAllUploaded, caseFiles }) => {
  const allFilesUploaded = false

  const upload = useS3UploadV2(
    caseId,
    CaseFileCategory.CASE_FILE,
    policeCaseNumber,
  )

  const [displayFiles, setDisplayFiles] = useState<LocalUploadFile[]>(
    caseFiles.map(mapCaseFileToUploadFile),
  )

  useEffect(() => {
    setDisplayFiles(caseFiles.map(mapCaseFileToUploadFile))
  }, [caseFiles, setDisplayFiles])

  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])

  useEffect(() => setAllUploaded(allFilesUploaded), [
    allFilesUploaded,
    setAllUploaded,
  ])

  const setSingleFile = useCallback(
    (displayFile) => {
      setDisplayFiles((previous) => {
        const index = previous.findIndex(
          (f) => f.displayId === displayFile.displayId,
        )
        if (index === -1) {
          return previous
        }
        const next = [...previous]
        next[index] = displayFile
        return next
      })
    },
    [setDisplayFiles],
  )

  const onChange = useCallback(
    (files: File[]) => {
      setDisplayFiles((previous) => [
        ...files.map((file, index) => ({
          name: file.name,
          displayId: `${file.name}-${index}`,
        })),
        ...previous,
      ])
      upload(files, setSingleFile)
    },
    [upload, setSingleFile],
  )

  return (
    <>
      <Box marginBottom={5}>
        <PoliceCaseFiles
          isUploading={false}
          setIsUploading={() => false}
          policeCaseFileList={policeCaseFileList}
          setPoliceCaseFileList={setPoliceCaseFileList}
          policeCaseNumber={policeCaseNumber}
        />
      </Box>

      <InputFileUpload
        name="fileUpload"
        fileList={displayFiles}
        header={'Dragðu gögn hingað til að hlaða upp'}
        buttonLabel={'Velja gögn til að hlaða upp'}
        onChange={onChange}
        onRemove={() => {
          console.log('onRemove')
        }}
        onRetry={() => {
          console.log('onRetry')
        }}
        errorMessage={
          !allFilesUploaded
            ? undefined
            : 'Villa kom upp við að hlaða upp gögnum'
        }
        showFileSize
      />
    </>
  )
}

const PoliceCaseFilesRoute = () => {
  const { formatMessage } = useIntl()
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.POLICE_CASE_FILES}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.policeCaseFiles)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        {workingCase.policeCaseNumbers.map((policeCaseNumber, index) => (
          <Box key={index} marginBottom={6}>
            <AssignFilesToPoliceCase
              caseId={workingCase.id}
              caseFiles={
                index === 0
                  ? workingCase.caseFiles?.filter((f) =>
                      f.name.endsWith('pdf'),
                    ) ?? []
                  : index === 1
                  ? workingCase.caseFiles?.filter((f) =>
                      f.name.toLocaleLowerCase().endsWith('png'),
                    ) ?? []
                  : []
              }
              policeCaseNumber={policeCaseNumber}
              setAllUploaded={(policeCaseNumber) =>
                console.log('allUploaded', policeCaseNumber)
              }
            />
          </Box>
        ))}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`}
          nextIsDisabled={false}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceCaseFilesRoute
