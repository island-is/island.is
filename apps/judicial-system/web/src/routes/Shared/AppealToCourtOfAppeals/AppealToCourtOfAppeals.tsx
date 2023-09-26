import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, InputFileUpload, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseFileCategory,
  CaseTransition,
  isProsecutionRole,
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
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { appealToCourtOfAppeals as strings } from './AppealToCourtOfAppeals.strings'

const AppealToCourtOfAppeals = () => {
  const { workingCase } = useContext(FormContext)
  const { limitedAccess, user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<'APPEAL_SENT'>()
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
  const { transitionCase } = useCase()

  const appealBriefType = isProsecutionRole(user?.role)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF
  const appealCaseFilesType = isProsecutionRole(user?.role)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE
  const previousUrl = `${
    limitedAccess
      ? constants.DEFENDER_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${id}`

  const isStepValid =
    uploadFiles.some(
      (file) => file.category === appealBriefType && file.status === 'done',
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
        {workingCase.rulingDate && (
          <Box marginBottom={7}>
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          </Box>
        )}

        <>
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.appealBriefTitle)}
              required
            />
            <InputFileUpload
              fileList={uploadFiles.filter(
                (file) => file.category === appealBriefType,
              )}
              accept={'application/pdf'}
              header={formatMessage(core.uploadBoxTitle)}
              description={formatMessage(core.uploadBoxDescription, {
                fileEndings: '.pdf',
              })}
              buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
              onChange={(files) =>
                handleUpload(
                  addUploadFiles(files, appealBriefType),
                  updateUploadFile,
                )
              }
              onRemove={(file) => handleRemove(file, removeUploadFile)}
              onRetry={(file) => handleRetry(file, updateUploadFile)}
            />
          </Box>
          <Box component="section" marginBottom={10}>
            <SectionHeading
              title={formatMessage(strings.appealCaseFilesTitle)}
              marginBottom={1}
            />
            <Text marginBottom={3}>
              {formatMessage(strings.appealCaseFilesSubtitle)}
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
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={async () => {
            const caseTransitioned = await transitionCase(
              workingCase.id,
              CaseTransition.APPEAL,
            )

            if (caseTransitioned) {
              setVisibleModal('APPEAL_SENT')
            }
          }}
          nextButtonText={formatMessage(strings.nextButtonText)}
          nextIsDisabled={!isStepValid}
          nextButtonIcon={undefined}
        />
      </FormContentContainer>
      {visibleModal === 'APPEAL_SENT' && (
        <Modal
          title={formatMessage(strings.appealSentModalTitle)}
          text={formatMessage(strings.appealSentModalText)}
          secondaryButtonText={formatMessage(core.closeModal)}
          onSecondaryButtonClick={() => {
            router.push(previousUrl)
          }}
        />
      )}
    </PageLayout>
  )
}

export default AppealToCourtOfAppeals
