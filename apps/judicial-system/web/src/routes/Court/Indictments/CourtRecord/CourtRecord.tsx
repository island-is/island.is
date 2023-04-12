import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

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

  const {
    handleChange,
    handleRemove,
    handleRetry,
    generateSingleFileUpdate,
  } = useS3Upload(workingCase.id)

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

  const handleUIUpdate = useCallback(
    (displayFile: TUploadFile, newId?: string) => {
      setDisplayFiles((previous) =>
        generateSingleFileUpdate(previous, displayFile, newId),
      )
    },
    [generateSingleFileUpdate],
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

  const removeFileCB = useCallback((file: UploadFile) => {
    setDisplayFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )
  }, [])

  return (
    <PageLayout
      workingCase={workingCase}
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
            accept="application/pdf"
            header={formatMessage(m.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) => {
              handleChange(
                files,
                CaseFileCategory.COURT_RECORD,
                setDisplayFiles,
                handleUIUpdate,
              )
            }}
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) => handleRetry(file, handleUIUpdate)}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading title={formatMessage(m.rulingTitle)} />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.RULING,
            )}
            accept="application/pdf"
            header={formatMessage(m.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) =>
              handleChange(
                files,
                CaseFileCategory.RULING,
                setDisplayFiles,
                handleUIUpdate,
              )
            }
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) => handleRetry(file, handleUIUpdate)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
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
