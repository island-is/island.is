import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  Checkbox,
  Input,
  InputFileUpload,
  RadioButton,
  toast,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  DateTime,
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
  CaseTransition,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Conclusion.strings'

type Decision =
  | CaseIndictmentRulingDecision.FINE
  | CaseIndictmentRulingDecision.RULING

interface Postponement {
  postponedIndefinitely?: boolean
  postonedUntilVerdict?: boolean
  reason?: string
}

const Conclusion: React.FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const [selectedAction, setSelectedAction] = useState<IndictmentDecision>()
  const [selectedDecision, setSelectedDecision] = useState<Decision>()
  const [postponement, setPostponement] = useState<Postponement>()

  const {
    courtDate,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'courtDate')

  const { updateCase, isUpdatingCase, transitionCase, setAndSendCaseToServer } =
    useCase()

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

  const handleRedistribution = useCallback(
    async (destination: string) => {
      const transitionSuccessful = await transitionCase(
        workingCase.id,
        CaseTransition.REDISTRIBUTE,
      )

      const success = await setAndSendCaseToServer(
        [
          {
            indictmentDecision: IndictmentDecision.REDISTRIBUTING,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      if (!transitionSuccessful || !success) {
        return
      }

      router.push(destination)
    },
    [setAndSendCaseToServer, setWorkingCase, transitionCase, workingCase],
  )

  const handleCompletion = useCallback(
    async (destination: string) => {
      const success = await setAndSendCaseToServer(
        [
          {
            indictmentRulingDecision: selectedDecision,
            indictmentDecision: IndictmentDecision.COMPLETING,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      if (!success) {
        return
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [selectedDecision, setAndSendCaseToServer, setWorkingCase, workingCase],
  )

  const handlePostponementUntilVerdict = useCallback(
    async (destination: string) => {
      const success = await setAndSendCaseToServer(
        [
          {
            indictmentDecision: IndictmentDecision.POSTPONING_UNTIL_VERDICT,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      if (!success) {
        return
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [setAndSendCaseToServer, setWorkingCase, workingCase],
  )

  const handlePostponementIndefinitely = useCallback(
    async (destination: string) => {
      const updateSuccess = await setAndSendCaseToServer(
        [
          {
            courtDate: null,
            postponedIndefinitelyExplanation: postponement?.reason,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      if (!updateSuccess) {
        return
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [postponement?.reason, setAndSendCaseToServer, setWorkingCase, workingCase],
  )

  const handlePostponement = useCallback(
    async (destination: string) => {
      const updateCourtDateSuccess = await sendCourtDateToServer([
        { postponedIndefinitelyExplanation: null, force: true },
      ])

      const updateSuccess = await setAndSendCaseToServer(
        [
          {
            indictmentDecision: IndictmentDecision.POSTPONING,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      if (!updateCourtDateSuccess || !updateSuccess) {
        return
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [
      sendCourtDateToServer,
      setAndSendCaseToServer,
      setWorkingCase,
      workingCase,
    ],
  )

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (selectedAction === IndictmentDecision.REDISTRIBUTING) {
        handleRedistribution(destination)
      } else if (selectedAction === IndictmentDecision.COMPLETING) {
        handleCompletion(destination)
      } else if (
        selectedAction === IndictmentDecision.POSTPONING_UNTIL_VERDICT
      ) {
        await handlePostponementUntilVerdict(destination)
      } else if (postponement?.postponedIndefinitely) {
        handlePostponementIndefinitely(destination)
      } else {
        handlePostponement(destination)
      }
    },
    [
      selectedAction,
      postponement?.postponedIndefinitely,
      handleRedistribution,
      handleCompletion,
      handlePostponementUntilVerdict,
      handlePostponementIndefinitely,
      handlePostponement,
    ],
  )

  useEffect(() => {
    if (
      workingCase.indictmentDecision ===
      IndictmentDecision.POSTPONING_UNTIL_VERDICT
    ) {
      setSelectedAction(IndictmentDecision.POSTPONING_UNTIL_VERDICT)

      return
    }
    if (workingCase.indictmentRulingDecision) {
      setSelectedDecision(workingCase.indictmentRulingDecision)
      setSelectedAction(IndictmentDecision.COMPLETING)

      return
    } else if (
      workingCase.courtDate?.date ||
      workingCase.postponedIndefinitelyExplanation
    ) {
      setSelectedAction(IndictmentDecision.POSTPONING)

      if (workingCase.postponedIndefinitelyExplanation) {
        setPostponement({
          postponedIndefinitely: true,
          reason: workingCase.postponedIndefinitelyExplanation,
        })
      }
    } else {
      return
    }
  }, [
    workingCase.courtDate?.date,
    workingCase.postponedIndefinitelyExplanation,
    workingCase.indictmentRulingDecision,
    workingCase.indictmentDecision,
  ])

  const stepIsValid = () => {
    if (!selectedAction) {
      return false
    }

    if (selectedAction === IndictmentDecision.REDISTRIBUTING) {
      return uploadFiles.find(
        (file) => file.category === CaseFileCategory.COURT_RECORD,
      )
    } else if (selectedAction === IndictmentDecision.POSTPONING) {
      return (
        Boolean(
          postponement?.postponedIndefinitely
            ? postponement.reason
            : courtDate?.date,
        ) && allFilesDoneOrError
      )
    } else if (
      selectedAction === IndictmentDecision.COMPLETING ||
      selectedAction === IndictmentDecision.POSTPONING_UNTIL_VERDICT
    ) {
      return allFilesDoneOrError
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={allFilesDoneOrError}
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
                id="conclusion-postpone"
                name="conclusion-decision"
                checked={
                  selectedAction === IndictmentDecision.POSTPONING ||
                  (!selectedAction &&
                    workingCase.indictmentDecision ===
                      IndictmentDecision.POSTPONING)
                }
                onChange={() => {
                  setSelectedAction(IndictmentDecision.POSTPONING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.postponed)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-postpone-until-verdict"
                name="conclusion-decision"
                checked={
                  selectedAction ===
                    IndictmentDecision.POSTPONING_UNTIL_VERDICT ||
                  (!selectedAction &&
                    workingCase.indictmentDecision ===
                      IndictmentDecision.POSTPONING_UNTIL_VERDICT)
                }
                onChange={() => {
                  setSelectedAction(IndictmentDecision.POSTPONING_UNTIL_VERDICT)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.postponedUntilVerdict)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-complete"
                name="conclusion-decision"
                checked={
                  selectedAction === IndictmentDecision.COMPLETING ||
                  (!selectedAction &&
                    workingCase.indictmentDecision ===
                      IndictmentDecision.COMPLETING)
                }
                onChange={() => {
                  setSelectedAction(IndictmentDecision.COMPLETING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.complete)}
              />
            </Box>
            <RadioButton
              id="conclusion-redistribute"
              name="conclusion-redistribute"
              checked={
                selectedAction === IndictmentDecision.REDISTRIBUTING ||
                (!selectedAction &&
                  workingCase.indictmentDecision ===
                    IndictmentDecision.REDISTRIBUTING)
              }
              onChange={() => {
                setSelectedAction(IndictmentDecision.REDISTRIBUTING)
              }}
              large
              backgroundColor="white"
              label={formatMessage(strings.redistribute)}
            />
          </BlueBox>
        </Box>
        {selectedAction === IndictmentDecision.POSTPONING && (
          <>
            <SectionHeading
              title={formatMessage(strings.arrangeAnotherHearing)}
            />
            <Box marginBottom={5}>
              <BlueBox>
                <Box marginBottom={2}>
                  <CourtArrangements
                    handleCourtDateChange={handleCourtDateChange}
                    handleCourtRoomChange={handleCourtRoomChange}
                    courtDate={courtDate}
                    blueBox={false}
                    dateTimeDisabled={postponement?.postponedIndefinitely}
                    courtRoomDisabled={postponement?.postponedIndefinitely}
                  />
                </Box>
                <Box marginBottom={2}>
                  <Checkbox
                    name="postponedIndefinitely"
                    label={formatMessage(strings.postponedIndefinitely)}
                    large
                    filled
                    checked={postponement?.postponedIndefinitely}
                    onChange={(event) =>
                      setPostponement((prev) => ({
                        ...prev,
                        postponedIndefinitely: event.target.checked,
                      }))
                    }
                  />
                </Box>
                <Input
                  name="reasonForPostponement"
                  rows={10}
                  autoExpand={{ on: true, maxHeight: 600 }}
                  label={formatMessage(strings.reasonForPostponement)}
                  placeholder={formatMessage(
                    strings.reasonForPostponementPlaceholder,
                  )}
                  value={postponement?.reason}
                  onChange={(event) =>
                    setPostponement((prev) => ({
                      ...prev,
                      reason: event.target.value,
                    }))
                  }
                  disabled={!postponement?.postponedIndefinitely}
                  textarea
                  required
                />
              </BlueBox>
            </Box>
          </>
        )}
        {selectedAction === IndictmentDecision.POSTPONING_UNTIL_VERDICT && (
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.arrangeVerdictTitle)}
            />
            <BlueBox>
              <Box marginBottom={2}>
                <Checkbox
                  id="arrange-verdict"
                  name="arrange-verdict"
                  checked={Boolean(postponement?.postonedUntilVerdict)}
                  onChange={() => {
                    setPostponement((prev) => ({
                      ...prev,
                      postonedUntilVerdict: !prev?.postonedUntilVerdict,
                    }))
                  }}
                  backgroundColor="white"
                  label={formatMessage(strings.arrangeVerdict)}
                  large
                  filled
                />
              </Box>
              <DateTime
                name="verdictDate"
                onChange={(date) => {
                  console.log('asd')
                }}
                blueBox={false}
                disabled={!postponement?.postonedUntilVerdict}
              />
            </BlueBox>
          </Box>
        )}
        {selectedAction === IndictmentDecision.COMPLETING && (
          <Box marginBottom={5}>
            <SectionHeading title={formatMessage(strings.decision)} required />
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
              <RadioButton
                id="decision-fine"
                name="decision"
                checked={selectedDecision === CaseIndictmentRulingDecision.FINE}
                onChange={() => {
                  setSelectedDecision(CaseIndictmentRulingDecision.FINE)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.fine)}
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
              required={selectedAction === IndictmentDecision.REDISTRIBUTING}
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
        {selectedDecision === 'RULING' && (
          <Box component="section" marginBottom={10}>
            <SectionHeading title={formatMessage(strings.rulingUploadTitle)} />
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
