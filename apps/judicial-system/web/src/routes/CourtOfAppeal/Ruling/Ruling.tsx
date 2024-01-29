import React, { useCallback, useContext, useState } from 'react'
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
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  RestrictionLength,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseFileCategory,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  useCase,
  useOnceOn,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isCourtOfAppealRulingStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import CaseNumbers from '../components/CaseNumbers/CaseNumbers'
import { courtOfAppealRuling as strings } from './Ruling.strings'

const CourtOfAppealRuling: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
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
  const { updateCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()

  const initialize = useCallback(() => {
    if (
      isRestrictionCase(workingCase.type) &&
      workingCase.state === CaseState.ACCEPTED &&
      (workingCase.decision === CaseDecision.ACCEPTING ||
        workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY)
    ) {
      setAndSendCaseToServer(
        [
          {
            appealValidToDate: workingCase.validToDate,
            isAppealCustodyIsolation: workingCase.isCustodyIsolation,
            appealIsolationToDate: workingCase.isolationToDate,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [setAndSendCaseToServer, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

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
      false,
    )
  }

  const decisionOptions = [
    {
      id: 'case-decision-accepting',
      decision: CaseAppealRulingDecision.ACCEPTING,
      message: appealRuling.decisionAccept,
    },
    {
      id: 'case-decision-repeal',
      decision: CaseAppealRulingDecision.REPEAL,
      message: appealRuling.decisionRepeal,
    },
    {
      id: 'case-decision-changed',
      decision: CaseAppealRulingDecision.CHANGED,
      message: appealRuling.decisionChanged,
    },
    {
      id: 'case-decision-changed-significantly',
      decision: CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY,
      message: appealRuling.decisionChangedSignificantly,
    },
    {
      id: 'case-decision-dismissed-from-court-of-appeal',
      decision: CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL,
      message: appealRuling.decisionDismissedFromCourtOfAppeal,
    },
    {
      id: 'case-decision-dismissed-from-court',
      decision: CaseAppealRulingDecision.DISMISSED_FROM_COURT,
      message: appealRuling.decisionDismissedFromCourt,
    },
    {
      id: 'case-decision-unlabeling',
      decision: CaseAppealRulingDecision.REMAND,
      message: appealRuling.decisionRemand,
    },
    {
      id: 'case-decision-withdrawn',
      decision: CaseAppealRulingDecision.WITHDRAWN,
      message: appealRuling.decisionWithdrawn,
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
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
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
                  checked={workingCase.appealRulingDecision === option.decision}
                  onChange={() => handleRulingDecisionChange(option.decision)}
                  backgroundColor="white"
                  large
                />
              </Box>
            ))}
          </BlueBox>
        </Box>
        {isRestrictionCase(workingCase.type) &&
          workingCase.state === CaseState.ACCEPTED &&
          (workingCase.decision === CaseDecision.ACCEPTING ||
            workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY) &&
          workingCase.appealRulingDecision ===
            CaseAppealRulingDecision.CHANGED && (
            <RestrictionLength
              workingCase={workingCase}
              handleIsolationChange={(
                event: React.ChangeEvent<HTMLInputElement>,
              ): void => {
                setAndSendCaseToServer(
                  [
                    {
                      isAppealCustodyIsolation: event.target.checked,
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              handleIsolationDateChange={(
                date: Date | undefined,
                valid: boolean,
              ): void => {
                if (date && valid) {
                  setAndSendCaseToServer(
                    [
                      {
                        appealIsolationToDate: formatDateForServer(date),
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }
              }}
              handleValidToDateChange={(
                date: Date | undefined,
                valid: boolean,
              ): void => {
                if (date && valid) {
                  setAndSendCaseToServer(
                    [
                      {
                        appealValidToDate: formatDateForServer(date),
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
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
            value={workingCase.appealConclusion || ''}
            placeholder={formatMessage(strings.conclusionPlaceholder)}
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
