import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, InputFileUpload, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  isDefenceUser,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
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
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import {
  CaseAppealDecision,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { statement as strings } from './Statement.strings'

const Statement = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { isUpdatingCase, updateCase } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [visibleModal, setVisibleModal] = useState<'STATEMENT_SENT'>()
  const { id } = router.query
  const {
    uploadFiles,
    allFilesUploaded,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )

  const appealStatementType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT

  const appealCaseFilesType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE

  const previousUrl = `${
    isDefenceUser(user)
      ? constants.DEFENDER_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${id}`

  const isStepValid =
    uploadFiles.some(
      (file) => file.category === appealStatementType && file.status === 'done',
    ) && allFilesUploaded

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
          {workingCase.rulingDate && (
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          )}
          {(workingCase.prosecutorPostponedAppealDate ||
            workingCase.accusedPostponedAppealDate) && (
            <Text variant="h5" as="h5">
              {workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.APPEAL ||
              workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
                ? formatMessage(strings.appealActorInCourt, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                  })
                : formatMessage(strings.appealActorAndDate, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                    date: formatDate(workingCase.appealedDate, 'PPPp'),
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
                fileList={uploadFiles.filter(
                  (file) => file.category === appealStatementType,
                )}
                accept={'application/pdf'}
                header={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                onChange={(files) =>
                  handleUpload(
                    addUploadFiles(files, appealStatementType),
                    updateUploadFile,
                  )
                }
                onRemove={(file) => handleRemove(file, removeUploadFile)}
                onRetry={(file) => handleRetry(file, updateUploadFile)}
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
                fileList={uploadFiles.filter(
                  (file) => file.category === appealCaseFilesType,
                )}
                accept={'application/pdf'}
                header={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                onChange={(files) =>
                  handleUpload(
                    addUploadFiles(files, appealCaseFilesType),
                    updateUploadFile,
                  )
                }
                onRemove={(file) => handleRemove(file, removeUploadFile)}
                onRetry={(file) => handleRetry(file, updateUploadFile)}
              />
            </Box>
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={async () => {
            const update = isDefenceUser(user)
              ? { defendantStatementDate: new Date().toISOString() }
              : { prosecutorStatementDate: new Date().toISOString() }
            await updateCase(workingCase.id, update)
            setVisibleModal('STATEMENT_SENT')
          }}
          nextButtonText={formatMessage(strings.nextButtonText)}
          nextIsDisabled={!isStepValid || isUpdatingCase}
          nextButtonIcon={undefined}
        />
      </FormContentContainer>
      {visibleModal === 'STATEMENT_SENT' && (
        <Modal
          title={formatMessage(strings.statementSentModalTitle)}
          text={formatMessage(strings.statementSentModalText, {
            isDefender: isDefenceUser(user),
          })}
          secondaryButtonText={formatMessage(core.closeModal)}
          onSecondaryButtonClick={() => router.push(previousUrl)}
        />
      )}
    </PageLayout>
  )
}

export default Statement
