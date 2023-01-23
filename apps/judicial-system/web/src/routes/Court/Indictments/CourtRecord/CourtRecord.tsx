import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'
import { uuid } from 'uuidv4'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  AlertMessage,
  Box,
  InputFileUpload,
  toast,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  TUploadFile,
  useCase,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system/types'
import {
  mapCaseFileToUploadFile,
  stepValidationsType,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'

import { courtRecord as m } from './CourtRecord.strings'

const CourtRecord: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [displayFiles, setDisplayFiles] = useState<TUploadFile[]>([])

  const { formatMessage } = useIntl()
  const { transitionCase } = useCase()

  const { upload, remove } = useS3Upload(workingCase.id)

  useEffect(() => {
    if (workingCase.caseFiles) {
      setDisplayFiles(workingCase.caseFiles.map(mapCaseFileToUploadFile))
    }
  }, [workingCase.caseFiles])

  const allFilesUploaded = useMemo(() => {
    return displayFiles.every(
      (file) => file.status === 'done' || file.status === 'error',
    )
  }, [displayFiles])

  const setSingleFile = useCallback(
    (displayFile: TUploadFile, newId?: string) => {
      setDisplayFiles((previous) => {
        const index = previous.findIndex((f) => f.id === displayFile.id)
        if (index === -1) {
          return previous
        }
        const next = [...previous]
        next[index] = { ...displayFile, id: newId ?? displayFile.id }
        return next
      })
    },
    [setDisplayFiles],
  )

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      const transitionSuccessful = await transitionCase(
        workingCase.id,
        CaseTransition.ACCEPT,
      )

      if (transitionSuccessful) {
        setNavigateTo(destination)
      } else {
        toast.error(formatMessage(errors.transitionCase))
      }
    },
    [transitionCase, workingCase, formatMessage],
  )

  const handleChange = useCallback(
    (files: File[], category: CaseFileCategory) => {
      // We generate an id for each file so that we find the file again when
      // updating the file's progress and onRetry.
      // Also we cannot spread File since it contains read-only properties.
      const filesWithId: Array<[File, string]> = files.map((file) => [
        file,
        `${file.name}-${uuid()}`,
      ])
      setDisplayFiles((previous) => [
        ...filesWithId.map(
          ([file, id]): TUploadFile => ({
            status: 'uploading',
            percent: 1,
            name: file.name,
            id: id,
            type: file.type,
            category,
          }),
        ),
        ...previous,
      ])
      upload(filesWithId, setSingleFile, category)
    },
    [upload, setSingleFile],
  )

  const handleRemoveFile = useCallback(
    async (file: UploadFile) => {
      try {
        if (file.id) {
          await remove(file.id)
          setDisplayFiles((prev) => {
            return prev.filter((caseFile) => caseFile.id !== file.id)
          })
        }
      } catch {
        toast.error(formatMessage(errors.general))
      }
    },
    [formatMessage, remove],
  )

  const handleRetry = useCallback(
    (file: TUploadFile) => {
      setSingleFile({
        name: file.name,
        id: file.id,
        percent: 1,
        status: 'uploading',
        type: file.type,
        category: file.category,
      })
      upload(
        [
          [
            { name: file.name, type: file.type ?? '' } as File,
            file.id ?? file.name,
          ],
        ],
        setSingleFile,
        file.category,
      )
    },
    [setSingleFile, upload],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={IndictmentsCourtSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={allFilesUploaded}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.courtRecord)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <AlertMessage
            message={formatMessage(m.alertBannerText)}
            type="info"
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.courtRecordTitle)} />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.COURT_RECORD,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(m.inputFieldLabel)}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) =>
              handleChange(files, CaseFileCategory.COURT_RECORD)
            }
            onRemove={handleRemoveFile}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading title={formatMessage(m.rulingTitle)} />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.RULING,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(m.inputFieldLabel)}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) => handleChange(files, CaseFileCategory.RULING)}
            onRemove={handleRemoveFile}
            onRetry={handleRetry}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!allFilesUploaded}
          nextIsLoading={isLoadingWorkingCase}
          nextButtonText={formatMessage(m.nextButtonText)}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title={formatMessage(m.modalTitle)}
          text={formatMessage(m.modalText)}
          onPrimaryButtonClick={() => {
            router.push(`${navigateTo}/${workingCase.id}`)
          }}
          primaryButtonText={formatMessage(core.closeModal)}
        />
      )}
    </PageLayout>
  )
}

export default CourtRecord
