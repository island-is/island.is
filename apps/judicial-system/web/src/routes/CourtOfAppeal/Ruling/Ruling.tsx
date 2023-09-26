import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  Input,
  InputFileUpload,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseAppealRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isCourtOfAppealRulingStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { courtOfAppealRuling as strings } from './Ruling.strings'

const CourtOfAppealRuling: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

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
  const { updateCase, transitionCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState(false)

  const [appealConclusionErrorMessage, setAppealConclusionErrorMessage] =
    useState<string>('')

  const isStepValid =
    uploadFiles.some(
      (file) =>
        file.category === CaseFileCategory.APPEAL_RULING &&
        file.status === 'done',
    ) &&
    allFilesUploaded &&
    isCourtOfAppealRulingStepValid(workingCase)

  const handleRulingDecisionChange = (
    appealRulingDecision: CaseAppealRulingDecision,
  ) => {
    setAndSendCaseToServer(
      [
        {
          appealRulingDecision,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        <Box marginBottom={7}>
          <Text as="h2" variant="h2">
            {formatMessage(strings.caseNumber, {
              caseNumber: `${workingCase.appealCaseNumber}`,
            })}
          </Text>
          <Text as="h3" variant="default" fontWeight="semiBold">
            {formatMessage(strings.courtOfAppealCaseNumber, {
              caseNumber: workingCase.courtCaseNumber,
            })}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={3} display="flex">
            <Text as="h3" variant="h3">
              {formatMessage(strings.decision)}
            </Text>
            <Box marginLeft="smallGutter">
              <Text as="span" variant="h3" color="red400">
                *
              </Text>
            </Box>
          </Box>
          <Box background="blue100" padding={3}>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-accepting"
                label={formatMessage(appealRuling.decisionAccept)}
                checked={
                  workingCase.appealRulingDecision ===
                  CaseAppealRulingDecision.ACCEPTING
                }
                onChange={() => {
                  handleRulingDecisionChange(CaseAppealRulingDecision.ACCEPTING)
                }}
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-repeal"
                label={formatMessage(appealRuling.decisionRepeal)}
                checked={
                  workingCase.appealRulingDecision ===
                  CaseAppealRulingDecision.REPEAL
                }
                onChange={() =>
                  handleRulingDecisionChange(CaseAppealRulingDecision.REPEAL)
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-changed"
                label={formatMessage(appealRuling.decisionChanged)}
                checked={
                  workingCase.appealRulingDecision ===
                  CaseAppealRulingDecision.CHANGED
                }
                onChange={() =>
                  handleRulingDecisionChange(CaseAppealRulingDecision.CHANGED)
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-dismissed-from-court-of-appeal"
                label={formatMessage(
                  appealRuling.decisionDismissedFromCourtOfAppeal,
                )}
                checked={
                  workingCase.appealRulingDecision ===
                  CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL
                }
                onChange={() =>
                  handleRulingDecisionChange(
                    CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL,
                  )
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-dismissed-from-court"
                label={formatMessage(appealRuling.decisionDismissedFromCourt)}
                checked={
                  workingCase.appealRulingDecision ===
                  CaseAppealRulingDecision.DISMISSED_FROM_COURT
                }
                onChange={() =>
                  handleRulingDecisionChange(
                    CaseAppealRulingDecision.DISMISSED_FROM_COURT,
                  )
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-unlabeling"
                label={formatMessage(appealRuling.decisionRemand)}
                checked={
                  workingCase.appealRulingDecision ===
                  CaseAppealRulingDecision.REMAND
                }
                onChange={() =>
                  handleRulingDecisionChange(CaseAppealRulingDecision.REMAND)
                }
                backgroundColor="white"
                large
              />
            </Box>
          </Box>
        </Box>
        <Box marginBottom={5}>
          <Text as="h3" variant="h3" marginBottom={3}>
            {formatMessage(strings.conclusionHeading)}
          </Text>
          <Input
            label={formatMessage(strings.conclusionHeading)}
            name="rulingConclusion"
            value={workingCase.appealConclusion || ''}
            onChange={(event) => {
              removeTabsValidateAndSet(
                'appealConclusion',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
                appealConclusionErrorMessage,
                setAppealConclusionErrorMessage,
              )
            }}
            onBlur={(event) =>
              validateAndSendToServer(
                'appealConclusion',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setAppealConclusionErrorMessage,
              )
            }
            textarea
            rows={7}
            required
            autoExpand={{ on: true, maxHeight: 300 }}
            hasError={appealConclusionErrorMessage !== ''}
            errorMessage={appealConclusionErrorMessage}
          />
        </Box>
        <Box marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.courtConclusionHeading)}
            required
          />

          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.APPEAL_RULING,
            )}
            accept="application/pdf"
            header={formatMessage(strings.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(strings.uploadButtonText)}
            onChange={(files) => {
              handleUpload(
                addUploadFiles(files, CaseFileCategory.APPEAL_RULING),
                updateUploadFile,
              )
            }}
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.COURT_OF_APPEAL_CASE_ROUTE}/${id}`}
          onNextButtonClick={async () => {
            const caseTransitioned = await transitionCase(
              workingCase.id,
              CaseTransition.COMPLETE_APPEAL,
              setWorkingCase,
            )

            if (caseTransitioned) {
              setVisibleModal(true)
            }
          }}
          nextIsDisabled={!isStepValid}
          nextButtonIcon="arrowForward"
          nextButtonText={formatMessage(strings.nextButtonFooter)}
        />
      </FormContentContainer>
      {visibleModal && (
        <Modal
          title={formatMessage(strings.uploadCompletedModalTitle)}
          text={formatMessage(strings.uploadCompletedModalText)}
          secondaryButtonText={formatMessage(core.closeModal)}
          onClose={() => setVisibleModal(false)}
          onSecondaryButtonClick={() => {
            router.push(
              `${constants.COURT_OF_APPEAL_RESULT_ROUTE}/${workingCase.id}`,
            )
          }}
        />
      )}
    </PageLayout>
  )
}

export default CourtOfAppealRuling
