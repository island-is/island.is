import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Box,
  Button,
  InputFileUpload,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { core, titles } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import {
  CaseFileCategory,
  isProsecutionRole,
} from '@island.is/judicial-system/types'
import {
  TUploadFile,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { mapCaseFileToUploadFile } from '@island.is/judicial-system-web/src/utils/formHelper'
import { formatDate } from '@island.is/judicial-system/formatters'
import * as constants from '@island.is/judicial-system/consts'

import { statement as strings } from './Statement.strings'

const Statement = () => {
  const { workingCase } = useContext(FormContext)
  const { limitedAccess, user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [displayFiles, setDisplayFiles] = useState<TUploadFile[]>([])
  const [visibleModal, setVisibleModal] = useState<'STATEMENT_SENT'>()
  const { id } = router.query
  const {
    handleChange,
    handleRemove,
    handleRetry,
    generateSingleFileUpdate,
  } = useS3Upload(workingCase.id)

  const appealStatementType = isProsecutionRole(user?.role)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT

  const appealCaseFilesType = isProsecutionRole(user?.role)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE

  const previousUrl = `${
    limitedAccess
      ? constants.DEFENDER_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${id}`

  const allFilesUploaded = useMemo(() => {
    return displayFiles.every(
      (file) => file.status === 'done' || file.status === 'error',
    )
  }, [displayFiles])

  const isStepValid =
    displayFiles.some((file) => file.category === appealStatementType) &&
    allFilesUploaded

  const removeFileCB = useCallback((file: UploadFile) => {
    setDisplayFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )
  }, [])

  const handleUIUpdate = useCallback(
    (displayFile: TUploadFile, newId?: string) => {
      setDisplayFiles((previous) =>
        generateSingleFileUpdate(previous, displayFile, newId),
      )
    },
    [generateSingleFileUpdate],
  )

  useEffect(() => {
    if (workingCase.caseFiles) {
      setDisplayFiles(workingCase.caseFiles.map(mapCaseFileToUploadFile))
    }
  }, [workingCase.caseFiles])

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <Box marginBottom={2}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(previousUrl)}
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
        <Box marginBottom={1}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        <Box marginBottom={7}>
          {workingCase.courtEndTime && (
            <RulingDateLabel courtEndTime={workingCase.courtEndTime} />
          )}
          {(workingCase.prosecutorPostponedAppealDate ||
            workingCase.accusedPostponedAppealDate) && (
            <Text variant="h5" as="h5">
              {formatMessage(strings.appealActorAndDate, {
                actor: workingCase.prosecutorPostponedAppealDate
                  ? 'sækjanda'
                  : 'varnaraðila',
                date: formatDate(
                  workingCase.prosecutorPostponedAppealDate ??
                    workingCase.accusedPostponedAppealDate,
                  'PPPp',
                ),
              })}
            </Text>
          )}
        </Box>

        {user && (
          <>
            <Box component="section" marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.uploadStatementTitle)}
                required
              />
              <InputFileUpload
                fileList={displayFiles.filter(
                  (file) => file.category === appealStatementType,
                )}
                accept={'application/pdf'}
                header={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                multiple={false}
                onChange={(files) =>
                  handleChange(
                    files,
                    appealStatementType,
                    setDisplayFiles,
                    handleUIUpdate,
                  )
                }
                onRemove={(file) => handleRemove(file, removeFileCB)}
                onRetry={(file) => handleRetry(file, handleUIUpdate)}
              />
            </Box>
            <Box component="section" marginBottom={10}>
              <SectionHeading
                title={formatMessage(strings.uploadStatementCaseFilesTitle)}
                marginBottom={1}
              />
              <Text marginBottom={3}>
                {formatMessage(strings.uploadStatementCaseFilesSubtitle)}
              </Text>
              <InputFileUpload
                fileList={displayFiles.filter(
                  (file) => file.category === appealCaseFilesType,
                )}
                accept={'application/pdf'}
                header={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                multiple={false}
                onChange={(files) =>
                  handleChange(
                    files,
                    appealCaseFilesType,
                    setDisplayFiles,
                    handleUIUpdate,
                  )
                }
                onRemove={(file) => handleRemove(file, removeFileCB)}
                onRetry={(file) => handleRetry(file, handleUIUpdate)}
              />
            </Box>
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={() => setVisibleModal('STATEMENT_SENT')}
          nextButtonText={formatMessage(strings.nextButtonText)}
          nextIsDisabled={!isStepValid}
          nextButtonIcon={undefined}
        />
      </FormContentContainer>
      {visibleModal === 'STATEMENT_SENT' && (
        <Modal
          title={formatMessage(strings.statementSentModalTitle)}
          text={formatMessage(strings.statementSentModalText)}
          secondaryButtonText={formatMessage(core.closeModal)}
          onSecondaryButtonClick={() => router.push(previousUrl)}
        />
      )}
    </PageLayout>
  )
}

export default Statement
