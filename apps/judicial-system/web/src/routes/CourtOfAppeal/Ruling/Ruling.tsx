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
} from '@island.is/judicial-system-web/src/components'
import type { UploadFile } from '@island.is/island-ui/core'
import {
  Box,
  Input,
  InputFileUpload,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'

import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system/types'
import { CaseAppealRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  useCase,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'
import {
  mapCaseFileToUploadFile,
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isCourtOfAppealRulingStepValid } from '@island.is/judicial-system-web/src/utils/validate'
import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'

import { courtOfAppealRuling as strings } from './Ruling.strings'

const CourtOfAppealRuling: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  useEffect(() => {
    if (workingCase.caseFiles) {
      setDisplayFiles(workingCase.caseFiles.map(mapCaseFileToUploadFile))
    }
  }, [workingCase.caseFiles])

  const { handleChange, handleRemove, handleRetry, generateSingleFileUpdate } =
    useS3Upload(workingCase.id)

  const { updateCase, transitionCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [displayFiles, setDisplayFiles] = useState<TUploadFile[]>([])
  const [visibleModal, setVisibleModal] = useState(false)

  const [appealConclusionErrorMessage, setAppealConclusionErrorMessage] =
    useState<string>('')

  const allFilesUploaded = useMemo(() => {
    return displayFiles.every(
      (file) => file.status === 'done' || file.status === 'error',
    )
  }, [displayFiles])

  const isStepValid =
    displayFiles.some(
      (file) =>
        file.category === CaseFileCategory.APPEAL_RULING &&
        file.status === 'done',
    ) &&
    allFilesUploaded &&
    isCourtOfAppealRulingStepValid(workingCase)

  const handleUIUpdate = useCallback(
    (displayFile: TUploadFile, newId?: string) => {
      setDisplayFiles((previous) =>
        generateSingleFileUpdate(previous, displayFile, newId),
      )
    },
    [generateSingleFileUpdate],
  )

  const removeFileCB = (file: UploadFile) => {
    setDisplayFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )
  }

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
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.APPEAL_RULING,
            )}
            accept="application/pdf"
            header={formatMessage(strings.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(strings.uploadButtonText)}
            onChange={(files) => {
              handleChange(
                files,
                CaseFileCategory.APPEAL_RULING,
                setDisplayFiles,
                handleUIUpdate,
              )
            }}
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) =>
              handleRetry(file, handleUIUpdate, CaseFileCategory.APPEAL_RULING)
            }
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
