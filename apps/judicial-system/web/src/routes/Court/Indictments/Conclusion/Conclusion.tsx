import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  Checkbox,
  FileUploadStatus,
  Input,
  InputFileUpload,
  RadioButton,
  Select,
} from '@island.is/island-ui/core'
import {
  getStandardUserDashboardRoute,
  INDICTMENTS_COURT_OVERVIEW_ROUTE,
  INDICTMENTS_COURT_RECORD_ROUTE,
  INDICTMENTS_SUMMARY_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  courtSessionTypeNames,
  hasGeneratedCourtRecordPdf,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  SectionHeading,
  useCourtArrangements,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  CourtSessionRulingType,
  CourtSessionType,
  Defendant,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  UpdateCase,
  useCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import CourtCaseNumberInput from '../../components/CourtCaseNumber/CourtCaseNumberInput'
import SelectConnectedCase from './SelectConnectedCase'
import { strings } from './Conclusion.strings'

const courtSessionOptions = [
  {
    label: courtSessionTypeNames[CourtSessionType.MAIN_HEARING],
    value: CourtSessionType.MAIN_HEARING,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.OTHER],
    value: CourtSessionType.OTHER,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.APPRAISER_SUMMONS],
    value: CourtSessionType.APPRAISER_SUMMONS,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.VERDICT],
    value: CourtSessionType.VERDICT,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.MAIN_HEARING_CONTINUATION],
    value: CourtSessionType.MAIN_HEARING_CONTINUATION,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.HEARING],
    value: CourtSessionType.HEARING,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.ORAL_ARGUMENTS],
    value: CourtSessionType.ORAL_ARGUMENTS,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.RULING],
    value: CourtSessionType.RULING,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.ARRAIGNMENT],
    value: CourtSessionType.ARRAIGNMENT,
  },
]

const Conclusion: FC = () => {
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const {
    createCourtCase,
    isUpdatingCase,
    setAndSendCaseToServer,
    splitDefendantFromCase,
    isSplittingDefendantFromCase,
  } = useCase()
  const { courtDate, handleCourtDateChange, handleCourtRoomChange } =
    useCourtArrangements(workingCase, setWorkingCase, 'courtDate')
  const { createVerdicts, updateDefendantVerdictState } = useVerdict()
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

  const [selectedAction, setSelectedAction] = useState<IndictmentDecision>()
  const [postponementReason, setPostponementReason] = useState<string>()
  const [selectedCourtSessionType, setSelectedCourtSessionType] =
    useState<CourtSessionType>()
  const [selectedDecision, setSelectedDecision] =
    useState<CaseIndictmentRulingDecision>()
  const [mergeCaseNumber, setMergeCaseNumber] = useState<string>()
  const [mergeCaseNumberErrorMessage, setMergeCaseNumberErrorMessage] =
    useState<string>()
  const [selectedDefendant, setSelectedDefendant] = useState<Defendant | null>(
    null,
  )
  const [splitCaseId, setSplitCaseId] = useState<string>()
  const [splitCaseCourtCaseNumber, setSplitCaseCourtCaseNumber] =
    useState<string>()
  const [modalVisible, setModalVisible] = useState<
    'SPLIT' | 'CREATE_COURT_CASE_NUMBER'
  >()

  const hasGeneratedCourtRecord = hasGeneratedCourtRecordPdf(
    workingCase.state,
    workingCase.indictmentRulingDecision,
    workingCase.withCourtSessions,
    workingCase.courtSessions,
    user,
  )

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (!selectedAction) {
        return
      }

      const update: UpdateCase = {
        indictmentDecision: selectedAction,
        courtSessionType: null,
        courtDate: null,
        postponedIndefinitelyExplanation: null,
        indictmentRulingDecision: null,
        mergeCaseId: null,
        force: true,
      }

      if (selectedAction === IndictmentDecision.SPLITTING) {
        setModalVisible('SPLIT')
        return
      }

      switch (selectedAction) {
        case IndictmentDecision.POSTPONING:
          update.postponedIndefinitelyExplanation = postponementReason
          break
        case IndictmentDecision.SCHEDULING:
          update.courtSessionType = selectedCourtSessionType
          if (courtDate?.date) {
            update.courtDate = {
              date: formatDateForServer(new Date(courtDate.date)),
              location: courtDate.location,
            }
          }
          break
        case IndictmentDecision.COMPLETING:
          update.indictmentRulingDecision = selectedDecision
          if (selectedDecision === CaseIndictmentRulingDecision.MERGE) {
            if (mergeCaseNumber) {
              update.mergeCaseNumber = mergeCaseNumber
            }

            if (workingCase.mergeCase?.id) {
              update.mergeCaseId = workingCase.mergeCase?.id
            }
          }
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

      if (
        update.indictmentDecision === IndictmentDecision.COMPLETING &&
        update.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
      ) {
        const defendantVerdictsToCreate = workingCase.defendants?.map(
          (item) => ({
            defendantId: item.id,
            isDefaultJudgement: item.verdict?.isDefaultJudgement || false,
            isDrivingLicenseSuspended:
              item.verdict?.isDrivingLicenseSuspended || false,
          }),
        )

        const createSuccess = await createVerdicts({
          caseId: workingCase.id,
          verdicts: defendantVerdictsToCreate,
        })

        if (!createSuccess) {
          return
        }
      }

      router.push(
        selectedAction === IndictmentDecision.REDISTRIBUTING
          ? destination
          : `${destination}/${workingCase.id}`,
      )
    },
    [
      courtDate.date,
      courtDate.location,
      createVerdicts,
      mergeCaseNumber,
      postponementReason,
      selectedAction,
      selectedCourtSessionType,
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

    switch (workingCase.indictmentDecision) {
      case IndictmentDecision.POSTPONING:
        if (workingCase.postponedIndefinitelyExplanation) {
          setPostponementReason(workingCase.postponedIndefinitelyExplanation)
        }

        break
      case IndictmentDecision.SCHEDULING:
        if (workingCase.courtSessionType) {
          setSelectedCourtSessionType(workingCase.courtSessionType)
        }

        break
      case IndictmentDecision.COMPLETING:
        if (workingCase.indictmentRulingDecision) {
          setSelectedDecision(workingCase.indictmentRulingDecision)
        }
        setSelectedAction(IndictmentDecision.COMPLETING)
        break
      default:
        return
    }
  }, [
    workingCase.courtSessionType,
    workingCase.indictmentDecision,
    workingCase.indictmentRulingDecision,
    workingCase.postponedIndefinitelyExplanation,
  ])

  useEffect(() => {
    if (
      workingCase.indictmentDecision &&
      workingCase.indictmentDecision !== IndictmentDecision.COMPLETING
    ) {
      setSelectedAction(IndictmentDecision.SCHEDULING)
    }
  }, [workingCase.indictmentDecision])

  useEffect(() => {
    if (workingCase.mergeCaseNumber) {
      setMergeCaseNumber(workingCase.mergeCaseNumber)
    }
  }, [workingCase.mergeCaseNumber])

  const handleMergeCaseNumberBlur = (value: string) => {
    const validation = validate([[value, ['S-case-number']]])

    setMergeCaseNumberErrorMessage(
      validation.isValid ? undefined : validation.errorMessage,
    )
  }

  const stepIsValid = () => {
    // Do not leave any uploads unfinished
    if (!allFilesDoneOrError) {
      return false
    }

    const isCourtRecordValid = (): boolean =>
      hasGeneratedCourtRecord ||
      uploadFiles.some(
        (file) =>
          file.category === CaseFileCategory.COURT_RECORD &&
          file.status === FileUploadStatus.done,
      )

    switch (selectedAction) {
      case IndictmentDecision.POSTPONING:
        return Boolean(postponementReason)
      case IndictmentDecision.SCHEDULING:
        return Boolean(selectedCourtSessionType && courtDate?.date)
      case IndictmentDecision.SPLITTING:
        return Boolean(selectedDefendant)
      case IndictmentDecision.COMPLETING:
        switch (selectedDecision) {
          case CaseIndictmentRulingDecision.RULING:
          case CaseIndictmentRulingDecision.DISMISSAL:
            return (
              isCourtRecordValid() &&
              uploadFiles.some(
                (file) =>
                  file.category === CaseFileCategory.RULING &&
                  file.status === FileUploadStatus.done,
              )
            )
          case CaseIndictmentRulingDecision.CANCELLATION:
          case CaseIndictmentRulingDecision.FINE:
            return isCourtRecordValid()
          case CaseIndictmentRulingDecision.MERGE:
            return (
              isCourtRecordValid() &&
              Boolean(
                workingCase.mergeCase?.id ||
                  validate([[mergeCaseNumber, ['empty', 'S-case-number']]])
                    .isValid,
              )
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

  const hasJudgementRuling =
    workingCase.courtSessions?.some(
      (courtSession) =>
        courtSession.rulingType === CourtSessionRulingType.JUDGEMENT &&
        Boolean(courtSession.ruling),
    ) ?? false

  const missingRulingInCourtSessions =
    !!workingCase.withCourtSessions &&
    selectedAction === IndictmentDecision.COMPLETING &&
    selectedDecision === CaseIndictmentRulingDecision.RULING &&
    !hasJudgementRuling

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
        <Box className={grid({ gap: 5, marginBottom: 10 })}>
          <Box component="section">
            <SectionHeading
              title={formatMessage(strings.decisionTitle)}
              required
            />
            <BlueBox className={grid({ gap: 2 })}>
              <RadioButton
                id="conclusion-postponing"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.POSTPONING}
                disabled={workingCase.state === CaseState.CORRECTING}
                onChange={() =>
                  setSelectedAction(IndictmentDecision.POSTPONING)
                }
                large
                backgroundColor="white"
                label={formatMessage(strings.postponing)}
              />
              <RadioButton
                id="conclusion-scheduling"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.SCHEDULING}
                disabled={workingCase.state === CaseState.CORRECTING}
                onChange={() =>
                  setSelectedAction(IndictmentDecision.SCHEDULING)
                }
                large
                backgroundColor="white"
                label={formatMessage(strings.scheduling)}
              />
              <RadioButton
                id="conclusion-postponing-until-verdict"
                name="conclusion-decision"
                checked={
                  selectedAction === IndictmentDecision.POSTPONING_UNTIL_VERDICT
                }
                disabled={workingCase.state === CaseState.CORRECTING}
                onChange={() =>
                  setSelectedAction(IndictmentDecision.POSTPONING_UNTIL_VERDICT)
                }
                large
                backgroundColor="white"
                label={formatMessage(strings.postponingUntilVerdict)}
              />
              <RadioButton
                id="conclusion-completing"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.COMPLETING}
                disabled={workingCase.state === CaseState.CORRECTING}
                onChange={() =>
                  setSelectedAction(IndictmentDecision.COMPLETING)
                }
                large
                backgroundColor="white"
                label={formatMessage(strings.completing)}
              />
              <RadioButton
                id="conclusion-redistributing"
                name="conclusion-redistribute"
                checked={selectedAction === IndictmentDecision.REDISTRIBUTING}
                disabled={workingCase.state === CaseState.CORRECTING}
                onChange={() =>
                  setSelectedAction(IndictmentDecision.REDISTRIBUTING)
                }
                large
                backgroundColor="white"
                label={formatMessage(strings.redistributing)}
              />
              {workingCase.defendants && workingCase.defendants.length > 1 && (
                <RadioButton
                  id="conclusion-splitting"
                  name="conclusion-splitting"
                  checked={selectedAction === IndictmentDecision.SPLITTING}
                  disabled={workingCase.state === CaseState.CORRECTING}
                  onChange={() =>
                    setSelectedAction(IndictmentDecision.SPLITTING)
                  }
                  large
                  backgroundColor="white"
                  label="Kljúfa mál"
                />
              )}
            </BlueBox>
          </Box>
          {selectedAction === IndictmentDecision.POSTPONING && (
            <Box component="section">
              <SectionHeading title={formatMessage(strings.postponingTitle)} />
              <Input
                name="reasonForPostponement"
                rows={10}
                label={formatMessage(strings.reasonForPostponementTitle)}
                placeholder={formatMessage(
                  strings.reasonForPostponementPlaceholder,
                )}
                value={postponementReason}
                disabled={workingCase.state === CaseState.CORRECTING}
                onChange={(event) => setPostponementReason(event.target.value)}
                textarea
                required
              />
            </Box>
          )}
          {selectedAction === IndictmentDecision.SCHEDULING && (
            <Box component="section">
              <SectionHeading title={formatMessage(strings.schedulingTitle)} />
              <BlueBox>
                <Box marginBottom={2}>
                  <Select
                    name="court-session-type"
                    label={formatMessage(strings.courtSessionLabel)}
                    placeholder={formatMessage(strings.courtSessionPlaceholder)}
                    options={courtSessionOptions}
                    value={
                      selectedCourtSessionType &&
                      courtSessionOptions.find(
                        (option) => option.value === selectedCourtSessionType,
                      )
                    }
                    isDisabled={workingCase.state === CaseState.CORRECTING}
                    onChange={(selectedOption) => {
                      const type = selectedOption?.value
                      setSelectedCourtSessionType(type)
                    }}
                    required
                  />
                </Box>
                <CourtArrangements
                  handleCourtDateChange={handleCourtDateChange}
                  handleCourtRoomChange={handleCourtRoomChange}
                  courtDate={workingCase.courtDate}
                  blueBox={false}
                />
              </BlueBox>
            </Box>
          )}
          {selectedAction === IndictmentDecision.COMPLETING && (
            <>
              <Box component="section">
                <SectionHeading
                  title={formatMessage(strings.completingTitle)}
                  required
                />
                <BlueBox className={grid({ gap: 2 })}>
                  <RadioButton
                    id="decision-ruling"
                    name="decision"
                    checked={
                      selectedDecision === CaseIndictmentRulingDecision.RULING
                    }
                    disabled={workingCase.state === CaseState.CORRECTING}
                    onChange={() => {
                      setSelectedDecision(CaseIndictmentRulingDecision.RULING)
                    }}
                    large
                    backgroundColor="white"
                    label={formatMessage(strings.ruling)}
                  />
                  <RadioButton
                    id="decision-fine"
                    name="decision"
                    checked={
                      selectedDecision === CaseIndictmentRulingDecision.FINE
                    }
                    disabled={workingCase.state === CaseState.CORRECTING}
                    onChange={() => {
                      setSelectedDecision(CaseIndictmentRulingDecision.FINE)
                    }}
                    large
                    backgroundColor="white"
                    label={formatMessage(strings.fine)}
                  />
                  <RadioButton
                    id="decision-dismissal"
                    name="decision"
                    checked={
                      selectedDecision ===
                      CaseIndictmentRulingDecision.DISMISSAL
                    }
                    disabled={workingCase.state === CaseState.CORRECTING}
                    onChange={() => {
                      setSelectedDecision(
                        CaseIndictmentRulingDecision.DISMISSAL,
                      )
                    }}
                    large
                    backgroundColor="white"
                    label={formatMessage(strings.dismissal)}
                  />
                  <RadioButton
                    id="decision-merge"
                    name="decision"
                    checked={
                      selectedDecision === CaseIndictmentRulingDecision.MERGE
                    }
                    disabled={workingCase.state === CaseState.CORRECTING}
                    onChange={() => {
                      setSelectedDecision(CaseIndictmentRulingDecision.MERGE)
                    }}
                    large
                    backgroundColor="white"
                    label={formatMessage(strings.merge)}
                  />
                  <RadioButton
                    id="decision-cancellation"
                    name="decision"
                    checked={
                      selectedDecision ===
                      CaseIndictmentRulingDecision.CANCELLATION
                    }
                    disabled={workingCase.state === CaseState.CORRECTING}
                    onChange={() => {
                      setSelectedDecision(
                        CaseIndictmentRulingDecision.CANCELLATION,
                      )
                    }}
                    large
                    backgroundColor="white"
                    label={formatMessage(strings.cancellation)}
                  />
                </BlueBox>
              </Box>
              {selectedDecision === CaseIndictmentRulingDecision.MERGE && (
                <Box component="section">
                  <SectionHeading
                    title={formatMessage(strings.connectedCaseNumbersTitle)}
                    required
                  />
                  <BlueBox className={grid({ gap: 2 })}>
                    <SelectConnectedCase
                      workingCase={workingCase}
                      setWorkingCase={setWorkingCase}
                      mergeCaseNumber={mergeCaseNumber}
                    />
                    <Input
                      name="mergeCaseNumber"
                      label={formatMessage(strings.mergeCaseNumberLabel)}
                      autoComplete="off"
                      value={mergeCaseNumber}
                      placeholder={formatMessage(
                        strings.mergeCaseNumberPlaceholder,
                      )}
                      onChange={(evt) => {
                        setMergeCaseNumberErrorMessage(undefined)
                        setMergeCaseNumber(evt.target.value)
                      }}
                      onBlur={(evt) => {
                        handleMergeCaseNumberBlur(evt.target.value)
                      }}
                      hasError={Boolean(mergeCaseNumberErrorMessage)}
                      errorMessage={mergeCaseNumberErrorMessage}
                      disabled={
                        Boolean(workingCase.mergeCase) ||
                        workingCase.state === CaseState.CORRECTING
                      }
                    />
                  </BlueBox>
                </Box>
              )}
            </>
          )}
          {selectedAction === IndictmentDecision.SPLITTING && (
            <Box component="section">
              <SectionHeading title="Hvern á að kljúfa frá málinu?" />
              <Select
                name="defendant"
                options={workingCase.defendants?.map((defendant) => ({
                  label: defendant.name ?? 'Nafn ekki skráð',
                  value: defendant.id,
                }))}
                label="Ákærði"
                placeholder="Veldu ákærða"
                value={
                  selectedDefendant
                    ? {
                        label: selectedDefendant.name ?? 'Nafn ekki skráð',
                        value: selectedDefendant.id,
                      }
                    : null
                }
                isDisabled={workingCase.state === CaseState.CORRECTING}
                onChange={(option) => {
                  const defendant = workingCase.defendants?.find(
                    (defendant) => defendant.id === option?.value,
                  )
                  setSelectedDefendant(defendant ?? null)
                }}
                noOptionsMessage="Enginn ákærði er skráður í málinu"
                isClearable
              />
            </Box>
          )}
          {selectedAction && !workingCase.withCourtSessions && (
            <Box component="section">
              <SectionHeading
                title={formatMessage(strings.courtRecordTitle)}
                required={selectedAction === IndictmentDecision.COMPLETING}
              />
              <InputFileUpload
                name="court-records"
                files={uploadFiles.filter(
                  (file) => file.category === CaseFileCategory.COURT_RECORD,
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
                      category: CaseFileCategory.COURT_RECORD,
                    }),
                    updateUploadFile,
                  )
                }}
                onRemove={(file) => handleRemove(file, removeUploadFile)}
                onRetry={(file) => handleRetry(file, updateUploadFile)}
                onOpenFile={(file) => onOpenFile(file)}
              />
            </Box>
          )}
          {selectedAction === IndictmentDecision.COMPLETING &&
            (selectedDecision === CaseIndictmentRulingDecision.RULING ||
              selectedDecision === CaseIndictmentRulingDecision.DISMISSAL) && (
              <Box component="section">
                <SectionHeading
                  title={formatMessage(
                    selectedDecision === CaseIndictmentRulingDecision.RULING
                      ? strings.verdictUploadTitle
                      : strings.rulingUploadTitle,
                  )}
                  required
                />
                <InputFileUpload
                  name="ruling"
                  files={uploadFiles.filter(
                    (file) => file.category === CaseFileCategory.RULING,
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
                        category: CaseFileCategory.RULING,
                      }),
                      updateUploadFile,
                    )
                  }}
                  onRemove={(file) => handleRemove(file, removeUploadFile)}
                  onRetry={(file) => handleRetry(file, updateUploadFile)}
                  onOpenFile={(file) => onOpenFile(file)}
                />
              </Box>
            )}
          {selectedAction === IndictmentDecision.COMPLETING &&
            (selectedDecision === CaseIndictmentRulingDecision.FINE ||
              selectedDecision === CaseIndictmentRulingDecision.RULING) &&
            workingCase.defendants &&
            workingCase.defendants?.length > 0 && (
              <Box component="section" className={grid({ gap: 3 })}>
                {workingCase.defendants.map((defendant) => (
                  <BlueBox key={defendant.id} className={grid({ gap: 2 })}>
                    <SectionHeading
                      title={defendant.name || ''}
                      variant="h5"
                      marginBottom={0}
                    />
                    {selectedDecision ===
                      CaseIndictmentRulingDecision.RULING && (
                      <Checkbox
                        id={`default-judgment-${defendant.id}`}
                        label="Útivistardómur"
                        checked={defendant.verdict?.isDefaultJudgement || false}
                        onChange={(evt) =>
                          updateDefendantVerdictState(
                            {
                              caseId: workingCase.id,
                              defendantId: defendant.id,
                              isDefaultJudgement: evt.target.checked,
                            },
                            setWorkingCase,
                          )
                        }
                        disabled={workingCase.state === CaseState.CORRECTING}
                        backgroundColor="white"
                        large
                        filled
                      />
                    )}
                    <Checkbox
                      id={`driving-license-revocation-${defendant.id}`}
                      label="Svipting ökuréttar"
                      checked={
                        defendant.verdict?.isDrivingLicenseSuspended || false
                      }
                      onChange={(evt) =>
                        updateDefendantVerdictState(
                          {
                            caseId: workingCase.id,
                            defendantId: defendant.id,
                            isDrivingLicenseSuspended: evt.target.checked,
                          },
                          setWorkingCase,
                        )
                      }
                      disabled={workingCase.state === CaseState.CORRECTING}
                      backgroundColor="white"
                      large
                      filled
                    />
                  </BlueBox>
                ))}
              </Box>
            )}
          {selectedAction && workingCase.withCourtSessions && (
            <Box component="section">
              <PdfButton
                caseId={workingCase.id}
                title="Þingbók - PDF"
                pdfType="courtRecord"
                elementId="Þingbók"
                disabled={!hasGeneratedCourtRecord}
              />
            </Box>
          )}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              selectedAction === IndictmentDecision.COMPLETING
                ? INDICTMENTS_SUMMARY_ROUTE
                : selectedAction === IndictmentDecision.REDISTRIBUTING
                ? getStandardUserDashboardRoute(user)
                : INDICTMENTS_COURT_OVERVIEW_ROUTE,
            )
          }
          nextButtonText={
            selectedAction === IndictmentDecision.COMPLETING
              ? undefined
              : formatMessage(strings.nextButtonTextConfirm)
          }
          nextIsDisabled={!stepIsValid()}
          nextIsLoading={isUpdatingCase}
          hideNextButton={missingRulingInCourtSessions}
          infoBoxText={
            missingRulingInCourtSessions
              ? 'Þegar máli lýkur með dómi þarf að skrá dómsorðið á þingbókarskjá.'
              : ''
          }
        />
      </FormContentContainer>
      {modalVisible === 'SPLIT' && selectedDefendant && (
        <Modal
          title="Viltu kljúfa mál?"
          text={`Ákærði ${selectedDefendant.name} verður klofinn frá málinu og nýtt mál stofnað.`}
          primaryButton={{
            text: 'Já, kljúfa mál',
            onClick: async () => {
              const newCaseId = await splitDefendantFromCase(
                workingCase.id,
                selectedDefendant.id,
              )

              if (!newCaseId) {
                return
              }

              setSplitCaseId(newCaseId)
              setModalVisible('CREATE_COURT_CASE_NUMBER')
            },
            isLoading: isSplittingDefendantFromCase,
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setModalVisible(undefined),
          }}
          onClose={() => setModalVisible(undefined)}
        />
      )}
      {modalVisible === 'CREATE_COURT_CASE_NUMBER' && splitCaseId && (
        <Modal
          title={`Nýtt mál - ${selectedDefendant?.name}`}
          text="Smelltu á hnappinn til að stofna nýtt mál eða skráðu inn málsnúmer sem er þegar til í Auði. Gögn ásamt sögu máls verða flutt á nýja málið."
          primaryButton={{
            text: 'Staðfesta',
            onClick: () => {
              router.push(
                `${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${workingCase.id}`,
              )
            },
            isDisabled: !validate([
              [splitCaseCourtCaseNumber, ['empty', 'S-case-number']],
            ]).isValid,
          }}
        >
          <CourtCaseNumberInput
            workingCase={{
              id: splitCaseId,
              state: CaseState.RECEIVED,
              type: CaseType.INDICTMENT,
            }}
            onCreateCourtCase={async () => {
              const courtCaseNumber = await createCourtCase(splitCaseId)
              return courtCaseNumber ?? ''
            }}
            onChange={(courtCaseNumber) => {
              setSplitCaseCourtCaseNumber(courtCaseNumber)
            }}
          />
        </Modal>
      )}
    </PageLayout>
  )
}

export default Conclusion
