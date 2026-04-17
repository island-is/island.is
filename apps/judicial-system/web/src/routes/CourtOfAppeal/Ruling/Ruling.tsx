import { ChangeEvent, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  FileUploadStatus,
  Input,
  InputFileUpload,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { appealRuling } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  RestrictionLength,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseRulingDecision,
  CaseDecision,
  CaseFileCategory,
  CaseState,
  UpdateAppealCaseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  useAppealCase,
  useFileList,
  useOnceOn,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  isCourtOfAppealRulingStepFieldsValid,
  validate,
} from '@island.is/judicial-system-web/src/utils/validate'

import { CaseNumbers } from '../components'
import { courtOfAppealRuling as strings } from './Ruling.strings'

const CourtOfAppealRuling = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )
  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })
  const { updateAppealCase } = useAppealCase()
  const { formatMessage } = useIntl()
  const router = useRouter()

  const setAndSendAppealCaseToServer = useCallback(
    (update: Omit<UpdateAppealCaseInput, 'caseId' | 'appealCaseId'>) => {
      if (workingCase.appealCase?.id) {
        const appealCaseId = workingCase.appealCase.id

        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          appealCase: {
            id: appealCaseId,
            ...prevWorkingCase.appealCase,
            ...update,
          },
        }))

        updateAppealCase(workingCase.id, appealCaseId, update)
      }
    },
    [
      setWorkingCase,
      updateAppealCase,
      workingCase.appealCase?.id,
      workingCase.id,
    ],
  )

  const initialize = useCallback(() => {
    if (
      isRestrictionCase(workingCase.type) &&
      workingCase.state === CaseState.ACCEPTED &&
      (workingCase.decision === CaseDecision.ACCEPTING ||
        workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY)
    ) {
      setAndSendAppealCaseToServer({
        appealValidToDate: workingCase.validToDate,
        isAppealCustodyIsolation: workingCase.isCustodyIsolation,
        appealIsolationToDate: workingCase.isolationToDate,
      })
    }
  }, [
    setAndSendAppealCaseToServer,
    workingCase.decision,
    workingCase.isCustodyIsolation,
    workingCase.isolationToDate,
    workingCase.state,
    workingCase.type,
    workingCase.validToDate,
  ])

  useOnceOn(isCaseUpToDate, initialize)

  const [appealConclusionErrorMessage, setAppealConclusionErrorMessage] =
    useState<string>('')

  const isStepValid =
    allFilesDoneOrError &&
    isCourtOfAppealRulingStepFieldsValid(workingCase) &&
    (workingCase.appealCase?.appealRulingDecision ===
      AppealCaseRulingDecision.DISCONTINUED ||
      uploadFiles.some(
        (file) =>
          file.category === CaseFileCategory.APPEAL_RULING &&
          file.status === FileUploadStatus.done,
      ))

  const decisionOptions = [
    {
      id: 'case-decision-accepting',
      decision: AppealCaseRulingDecision.ACCEPTING,
      message: appealRuling.decisionAccept,
    },
    {
      id: 'case-decision-repeal',
      decision: AppealCaseRulingDecision.REPEAL,
      message: appealRuling.decisionRepeal,
    },
    {
      id: 'case-decision-changed',
      decision: AppealCaseRulingDecision.CHANGED,
      message: appealRuling.decisionChanged,
    },
    {
      id: 'case-decision-changed-significantly',
      decision: AppealCaseRulingDecision.CHANGED_SIGNIFICANTLY,
      message: appealRuling.decisionChangedSignificantly,
    },
    {
      id: 'case-decision-dismissed-from-court-of-appeal',
      decision: AppealCaseRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL,
      message: appealRuling.decisionDismissedFromCourtOfAppeal,
    },
    {
      id: 'case-decision-dismissed-from-court',
      decision: AppealCaseRulingDecision.DISMISSED_FROM_COURT,
      message: appealRuling.decisionDismissedFromCourt,
    },
    {
      id: 'case-decision-unlabeling',
      decision: AppealCaseRulingDecision.REMAND,
      message: appealRuling.decisionRemand,
    },
    {
      id: 'case-decision-discontinued',
      decision: AppealCaseRulingDecision.DISCONTINUED,
      message: appealRuling.decisionDiscontinued,
    },
  ]

  const handleNavigationTo = (destination: string) => {
    return router.push(`${destination}/${workingCase.id}`)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={isStepValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CaseNumbers />
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
          <BlueBox>
            {decisionOptions.map((option, index) => (
              <Box
                marginBottom={index === decisionOptions.length - 1 ? 0 : 2}
                key={option.id}
              >
                <RadioButton
                  name="case-decision"
                  id={option.id}
                  label={formatMessage(option.message)}
                  checked={
                    workingCase.appealCase?.appealRulingDecision ===
                    option.decision
                  }
                  onChange={() =>
                    setAndSendAppealCaseToServer({
                      appealRulingDecision: option.decision,
                    })
                  }
                  backgroundColor="white"
                  large
                />
              </Box>
            ))}
          </BlueBox>
        </Box>
        {workingCase.appealCase?.appealRulingDecision ===
        AppealCaseRulingDecision.DISCONTINUED ? (
          <Box marginBottom={10}>
            <SectionHeading title={formatMessage(strings.courtRecordHeading)} />
            <InputFileUpload
              name="appealCourtRecord"
              files={uploadFiles.filter(
                (file) =>
                  file.category === CaseFileCategory.APPEAL_COURT_RECORD,
              )}
              accept="application/pdf"
              title={formatMessage(strings.inputFieldLabel)}
              description={formatMessage(core.uploadBoxDescription, {
                fileEndings: '.pdf',
              })}
              buttonLabel={formatMessage(strings.uploadButtonText)}
              onChange={(files) => {
                handleUpload(
                  addUploadFiles(files, {
                    category: CaseFileCategory.APPEAL_COURT_RECORD,
                  }),
                  updateUploadFile,
                )
              }}
              onOpenFile={(file) => onOpenFile(file)}
              onRemove={(file) => handleRemove(file, removeUploadFile)}
              onRetry={(file) => handleRetry(file, updateUploadFile)}
            />
          </Box>
        ) : (
          <>
            {isRestrictionCase(workingCase.type) &&
              workingCase.state === CaseState.ACCEPTED &&
              (workingCase.decision === CaseDecision.ACCEPTING ||
                workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY) &&
              (workingCase.appealCase?.appealRulingDecision ===
                AppealCaseRulingDecision.CHANGED ||
                workingCase.appealCase?.appealRulingDecision ===
                  AppealCaseRulingDecision.CHANGED_SIGNIFICANTLY) && (
                <RestrictionLength
                  workingCase={workingCase}
                  handleIsolationChange={(
                    event: ChangeEvent<HTMLInputElement>,
                  ) =>
                    setAndSendAppealCaseToServer({
                      isAppealCustodyIsolation: event.target.checked,
                    })
                  }
                  handleIsolationDateChange={(
                    date: Date | undefined,
                    valid: boolean,
                  ) => {
                    if (date && valid) {
                      setAndSendAppealCaseToServer({
                        appealIsolationToDate: formatDateForServer(date),
                      })
                    }
                  }}
                  handleValidToDateChange={(
                    date: Date | undefined,
                    valid: boolean,
                  ) => {
                    if (date && valid) {
                      setAndSendAppealCaseToServer({
                        appealValidToDate: formatDateForServer(date),
                      })
                    }
                  }}
                />
              )}
            <Box marginBottom={5}>
              <Text as="h3" variant="h3" marginBottom={3}>
                {formatMessage(strings.conclusionHeading)}
              </Text>
              <Input
                label={formatMessage(strings.conclusionHeading)}
                name="rulingConclusion"
                value={workingCase.appealCase?.appealConclusion || ''}
                placeholder={formatMessage(strings.conclusionPlaceholder)}
                onChange={(event) => {
                  removeTabsValidateAndSet(
                    'appealConclusion',
                    event.target.value,
                    ['empty'],
                    setWorkingCase,
                    appealConclusionErrorMessage,
                    setAppealConclusionErrorMessage,
                  )
                }}
                onBlur={(event) => {
                  const value = event.target.value

                  const validationResult = validate([[value, ['empty']]])

                  if (validationResult.isValid) {
                    if (workingCase.appealCase?.id) {
                      setAppealConclusionErrorMessage('')
                      updateAppealCase(
                        workingCase.id,
                        workingCase.appealCase.id,
                        { appealConclusion: value },
                      )
                    }
                  } else {
                    setAppealConclusionErrorMessage(
                      validationResult.errorMessage,
                    )
                  }
                }}
                textarea
                rows={7}
                required
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
                name="appealRuling"
                files={uploadFiles.filter(
                  (file) => file.category === CaseFileCategory.APPEAL_RULING,
                )}
                accept="application/pdf"
                title={formatMessage(strings.inputFieldLabel)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(strings.uploadButtonText)}
                onChange={(files) => {
                  handleUpload(
                    addUploadFiles(files, {
                      category: CaseFileCategory.APPEAL_RULING,
                    }),
                    updateUploadFile,
                  )
                }}
                onOpenFile={(file) => onOpenFile(file)}
                onRemove={(file) => handleRemove(file, removeUploadFile)}
                onRetry={(file) => handleRetry(file, updateUploadFile)}
              />
            </Box>
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.COURT_OF_APPEAL_CASE_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.COURT_OF_APPEAL_SUMMARY_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isStepValid}
          nextButtonIcon="arrowForward"
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtOfAppealRuling
