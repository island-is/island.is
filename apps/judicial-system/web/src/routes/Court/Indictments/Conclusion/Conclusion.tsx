import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  Input,
  InputFileUpload,
  RadioButton,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  UpdateCase,
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Conclusion.strings'

const Conclusion: React.FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const [selectedAction, setSelectedAction] = useState<IndictmentDecision>()
  const [postponementReason, setPostponementReason] = useState<string>()
  const [selectedDecision, setSelectedDecision] =
    useState<CaseIndictmentRulingDecision>()

  const { courtDate, handleCourtDateChange, handleCourtRoomChange } =
    useCourtArrangements(workingCase, setWorkingCase, 'courtDate')
  const { isUpdatingCase, setAndSendCaseToServer } = useCase()

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

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (!selectedAction) {
        return
      }

      const update: UpdateCase = {
        indictmentDecision: selectedAction,
        courtDate: null,
        postponedIndefinitelyExplanation: null,
        indictmentRulingDecision: null,
        force: true,
      }

      switch (selectedAction) {
        case IndictmentDecision.POSTPONING:
          update.postponedIndefinitelyExplanation = postponementReason
          break
        case IndictmentDecision.SCHEDULING:
          if (courtDate?.date) {
            update.courtDate = {
              date: formatDateForServer(new Date(courtDate.date)),
              location: courtDate.location,
            }
          }
          break
        case IndictmentDecision.COMPLETING:
          update.indictmentRulingDecision = selectedDecision
          break
        case IndictmentDecision.REDISTRIBUTING:
          update.judgeId = null
          break
      }

      const updateSuccess = await setAndSendCaseToServer(
        [update],
        workingCase,
        setWorkingCase,
      )

      if (!updateSuccess) {
        return
      }

      router.push(
        selectedAction === IndictmentDecision.REDISTRIBUTING
          ? destination
          : `${destination}/${workingCase.id}`,
      )
    },
    [
      courtDate?.date,
      courtDate?.location,
      postponementReason,
      selectedAction,
      selectedDecision,
      setAndSendCaseToServer,
      setWorkingCase,
      workingCase,
    ],
  )

  useEffect(() => {
    if (!workingCase.indictmentDecision) {
      return
    }

    setSelectedAction(workingCase.indictmentDecision)

    switch (workingCase.indictmentDecision) {
      case IndictmentDecision.POSTPONING:
        if (workingCase.postponedIndefinitelyExplanation) {
          setPostponementReason(workingCase.postponedIndefinitelyExplanation)
        }
        break
      case IndictmentDecision.COMPLETING:
        if (workingCase.indictmentRulingDecision) {
          setSelectedDecision(workingCase.indictmentRulingDecision)
        }
        break
    }
  }, [
    workingCase.indictmentDecision,
    workingCase.indictmentRulingDecision,
    workingCase.postponedIndefinitelyExplanation,
  ])

  const stepIsValid = () => {
    // Do not leave any downloads unfinished
    if (!allFilesDoneOrError) {
      return false
    }

    switch (selectedAction) {
      case IndictmentDecision.POSTPONING:
        return Boolean(postponementReason)
      case IndictmentDecision.SCHEDULING:
        return Boolean(courtDate?.date)
      case IndictmentDecision.COMPLETING:
        switch (selectedDecision) {
          case CaseIndictmentRulingDecision.RULING:
          case CaseIndictmentRulingDecision.DISMISSAL:
            return (
              uploadFiles.some(
                (file) =>
                  file.category === CaseFileCategory.COURT_RECORD &&
                  file.status === 'done',
              ) &&
              uploadFiles.some(
                (file) =>
                  file.category === CaseFileCategory.RULING &&
                  file.status === 'done',
              )
            )
          case CaseIndictmentRulingDecision.FINE:
          case CaseIndictmentRulingDecision.CANCELLATION:
            return uploadFiles.some(
              (file) =>
                file.category === CaseFileCategory.COURT_RECORD &&
                file.status === 'done',
            )
          default:
            return false
        }
      case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
      case IndictmentDecision.REDISTRIBUTING:
        return true
      default:
        return false
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid()}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.conclusion)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.decisionTitle)}
            required
          />
          <BlueBox>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-postponing"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.POSTPONING}
                onChange={() => {
                  setSelectedAction(IndictmentDecision.POSTPONING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.postponing)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-scheduling"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.SCHEDULING}
                onChange={() => {
                  setSelectedAction(IndictmentDecision.SCHEDULING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.scheduling)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-postponing-until-verdict"
                name="conclusion-decision"
                checked={
                  selectedAction === IndictmentDecision.POSTPONING_UNTIL_VERDICT
                }
                onChange={() => {
                  setSelectedAction(IndictmentDecision.POSTPONING_UNTIL_VERDICT)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.postponingUntilVerdict)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-completing"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.COMPLETING}
                onChange={() => {
                  setSelectedAction(IndictmentDecision.COMPLETING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.completing)}
              />
            </Box>
            <RadioButton
              id="conclusion-redistributing"
              name="conclusion-redistribute"
              checked={selectedAction === IndictmentDecision.REDISTRIBUTING}
              onChange={() => {
                setSelectedAction(IndictmentDecision.REDISTRIBUTING)
              }}
              large
              backgroundColor="white"
              label={formatMessage(strings.redistributing)}
            />
          </BlueBox>
        </Box>
        {selectedAction === IndictmentDecision.POSTPONING && (
          <Box marginBottom={5}>
            <SectionHeading title={formatMessage(strings.postponingTitle)} />
            <Input
              name="reasonForPostponement"
              rows={10}
              autoExpand={{ on: true, maxHeight: 600 }}
              label={formatMessage(strings.reasonForPostponementTitle)}
              placeholder={formatMessage(
                strings.reasonForPostponementPlaceholder,
              )}
              value={postponementReason}
              onChange={(event) => setPostponementReason(event.target.value)}
              textarea
              required
            />
          </Box>
        )}
        {selectedAction === IndictmentDecision.SCHEDULING && (
          <Box marginBottom={5}>
            <SectionHeading title={formatMessage(strings.schedulingTitle)} />
            <BlueBox>
              <CourtArrangements
                handleCourtDateChange={handleCourtDateChange}
                handleCourtRoomChange={handleCourtRoomChange}
                courtDate={courtDate}
                blueBox={false}
              />
            </BlueBox>
          </Box>
        )}
        {selectedAction === IndictmentDecision.COMPLETING && (
          <Box marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.completingTitle)}
              required
            />
            <BlueBox>
              <Box marginBottom={2}>
                <RadioButton
                  id="decision-ruling"
                  name="decision"
                  checked={
                    selectedDecision === CaseIndictmentRulingDecision.RULING
                  }
                  onChange={() => {
                    setSelectedDecision(CaseIndictmentRulingDecision.RULING)
                  }}
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.ruling)}
                />
              </Box>
              <Box marginBottom={2}>
                <RadioButton
                  id="decision-fine"
                  name="decision"
                  checked={
                    selectedDecision === CaseIndictmentRulingDecision.FINE
                  }
                  onChange={() => {
                    setSelectedDecision(CaseIndictmentRulingDecision.FINE)
                  }}
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.fine)}
                />
              </Box>
              <Box marginBottom={2}>
                <RadioButton
                  id="decision-dismissal"
                  name="decision"
                  checked={
                    selectedDecision === CaseIndictmentRulingDecision.DISMISSAL
                  }
                  onChange={() => {
                    setSelectedDecision(CaseIndictmentRulingDecision.DISMISSAL)
                  }}
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.dismissal)}
                />
              </Box>
              <RadioButton
                id="decision-cancellation"
                name="decision"
                checked={
                  selectedDecision === CaseIndictmentRulingDecision.CANCELLATION
                }
                onChange={() => {
                  setSelectedDecision(CaseIndictmentRulingDecision.CANCELLATION)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.cancellation)}
              />
            </BlueBox>
          </Box>
        )}
        {selectedAction && (
          <Box
            component="section"
            marginBottom={selectedDecision === 'RULING' ? 5 : 10}
          >
            <SectionHeading
              title={formatMessage(strings.courtRecordTitle)}
              required={selectedAction === IndictmentDecision.COMPLETING}
            />
            <InputFileUpload
              fileList={uploadFiles.filter(
                (file) => file.category === CaseFileCategory.COURT_RECORD,
              )}
              accept="application/pdf"
              header={formatMessage(strings.inputFieldLabel)}
              description={formatMessage(core.uploadBoxDescription, {
                fileEndings: '.pdf',
              })}
              buttonLabel={formatMessage(strings.uploadButtonText)}
              onChange={(files) => {
                handleUpload(
                  addUploadFiles(files, CaseFileCategory.COURT_RECORD),
                  updateUploadFile,
                )
              }}
              onRemove={(file) => handleRemove(file, removeUploadFile)}
              onRetry={(file) => handleRetry(file, updateUploadFile)}
            />
          </Box>
        )}
        {selectedAction === IndictmentDecision.COMPLETING &&
          (selectedDecision === CaseIndictmentRulingDecision.RULING ||
            selectedDecision === CaseIndictmentRulingDecision.DISMISSAL) && (
            <Box component="section" marginBottom={10}>
              <SectionHeading
                title={formatMessage(
                  selectedDecision === CaseIndictmentRulingDecision.RULING
                    ? strings.verdictUploadTitle
                    : strings.rulingUploadTitle,
                )}
                required
              />
              <InputFileUpload
                fileList={uploadFiles.filter(
                  (file) => file.category === CaseFileCategory.RULING,
                )}
                accept="application/pdf"
                header={formatMessage(strings.inputFieldLabel)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(strings.uploadButtonText)}
                onChange={(files) => {
                  handleUpload(
                    addUploadFiles(files, CaseFileCategory.RULING),
                    updateUploadFile,
                  )
                }}
                onRemove={(file) => handleRemove(file, removeUploadFile)}
                onRetry={(file) => handleRetry(file, updateUploadFile)}
              />
            </Box>
          )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              selectedAction === IndictmentDecision.COMPLETING
                ? constants.INDICTMENTS_SUMMARY_ROUTE
                : selectedAction === IndictmentDecision.REDISTRIBUTING
                ? constants.CASES_ROUTE
                : constants.INDICTMENTS_COURT_OVERVIEW_ROUTE,
            )
          }
          nextButtonText={
            selectedAction === IndictmentDecision.COMPLETING
              ? undefined
              : formatMessage(strings.nextButtonTextConfirm)
          }
          nextIsDisabled={!stepIsValid()}
          nextIsLoading={isUpdatingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Conclusion
