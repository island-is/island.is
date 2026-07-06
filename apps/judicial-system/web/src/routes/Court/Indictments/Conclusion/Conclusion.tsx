import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'
import { AnimatePresence } from 'motion/react'
import router from 'next/router'

import {
  Box,
  FileUploadStatus,
  Input,
  InputFileUpload,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import {
  DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_SUMMARY_ROUTE,
  getStandardUserDashboardRoute,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  courtSessionTypeNames,
  hasGeneratedCourtRecordPdf,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CheckboxList,
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
  CourtSessionRulingType,
  CourtSessionType,
  Defendant,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import {
  formatDateForServer,
  UpdateCase,
  useCase,
  useDefendants,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  isGeneratedIndictmentCourtRecordValid,
  isNoGeneratedIndictmentCourtRecord,
  validate,
} from '@island.is/judicial-system-web/src/utils/validate'

import InputDate from '../../../../components/Inputs/InputDate'
import { CourtCaseNumberInput } from '../../components'
import SelectCandidateMergeCase from './SelectCandidateMergeCase'
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

const completingForSomeOptions: ReactSelectOption[] = [
  {
    label: 'Frávísun',
    value: CaseIndictmentRulingDecision.DISMISSAL,
  },
  {
    label: 'Niðurfelling máls',
    value: CaseIndictmentRulingDecision.CANCELLATION,
  },
]

const Conclusion: FC = () => {
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const {
    isUpdatingCase,
    setAndSendCaseToServer,
    splitDefendantFromCase,
    isSplittingDefendantFromCase,
  } = useCase()
  const { courtDate, handleCourtDateChange, handleCourtRoomChange } =
    useCourtArrangements(workingCase, setWorkingCase, 'courtDate')
  const { createVerdicts, updateDefendantVerdictState } = useVerdict()
  const { updateDefendantState, updateDefendant } = useDefendants()
  const { uploadFiles, addUploadFiles, updateUploadFile, removeUploadFile } =
    useUploadFiles(workingCase.caseFiles)
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
  const [completingForSomeSelections, setCompletingForSomeSelections] =
    useState<Record<string, CaseIndictmentRulingDecision | undefined>>({})
  const [splitCaseId, setSplitCaseId] = useState<string>()
  const [splitCaseCourtCaseNumber, setSplitCaseCourtCaseNumber] =
    useState<string>()
  const [conclusionDate, setConclusionDate] = useState<string>()
  const [isSubmittingForSome, setIsSubmittingForSome] = useState(false)
  const [modalVisible, setModalVisible] = useState<
    | 'SPLIT'
    | 'CREATE_COURT_CASE_NUMBER'
    | 'COMPLETING_FOR_SOME'
    | 'CONFIRM_COMPLETION_FOR_SOME'
  >()

  const activeDefendants = workingCase.defendants?.filter(
    (defendant) => defendant.indictmentCancelledOrDismissedState === null,
  )

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
        case IndictmentDecision.COMPLETING_FOR_SOME: {
          const parsed = conclusionDate
            ? parse(conclusionDate, 'dd.MM.yyyy', new Date())
            : null
          const parsedConclusionDate =
            parsed && isValid(parsed) ? parsed : undefined

          const remainingDefendants =
            workingCase.defendants?.filter(
              (d) =>
                d.indictmentCancelledOrDismissedState === null &&
                !completingForSomeSelections[d.id],
            ) ?? []

          const isLastDefendantRemaining = remainingDefendants.length === 1

          if (isLastDefendantRemaining) {
            update.indictmentDecision = null
          }
          update.defendantEventLogDecisions = Object.entries(
            completingForSomeSelections,
          ).flatMap(([defendantId, rulingDecision]) =>
            rulingDecision
              ? [
                  {
                    defendantId,
                    rulingDecision,
                    ...(parsedConclusionDate
                      ? {
                          rulingDate: formatDateForServer(parsedConclusionDate),
                        }
                      : {}),
                  },
                ]
              : [],
          )

          break
        }

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
        update.indictmentRulingDecision &&
        [
          CaseIndictmentRulingDecision.RULING,
          CaseIndictmentRulingDecision.FINE,
        ].includes(update.indictmentRulingDecision)
      ) {
        const promises = []

        if (
          update.indictmentRulingDecision ===
          CaseIndictmentRulingDecision.RULING
        ) {
          const defendantVerdictsToCreate = activeDefendants?.map((item) => ({
            defendantId: item.id,
            isDefaultJudgement: item.verdict?.isDefaultJudgement || false,
          }))

          promises.push(
            createVerdicts({
              caseId: workingCase.id,
              verdicts: defendantVerdictsToCreate,
            }),
          )
        }

        promises.push(
          ...(activeDefendants?.map((defendant) =>
            updateDefendant({
              caseId: workingCase.id,
              defendantId: defendant.id,
              isDrivingLicenseSuspended: defendant.isDrivingLicenseSuspended,
            }),
          ) || []),
        )

        const createSuccess = await Promise.all(promises)

        if (createSuccess.length === 0) {
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
      selectedAction,
      setAndSendCaseToServer,
      workingCase,
      setWorkingCase,
      postponementReason,
      selectedCourtSessionType,
      courtDate.date,
      courtDate.location,
      selectedDecision,
      mergeCaseNumber,
      completingForSomeSelections,
      conclusionDate,
      activeDefendants,
      createVerdicts,
      updateDefendant,
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
    if (workingCase.indictmentDecision) {
      setSelectedAction(workingCase.indictmentDecision)
    }
  }, [workingCase.indictmentDecision])

  useEffect(() => {
    if (workingCase.mergeCaseNumber) {
      setMergeCaseNumber(workingCase.mergeCaseNumber)
    }
  }, [workingCase.mergeCaseNumber])

  useEffect(() => {
    if (modalVisible === undefined) {
      setConclusionDate(undefined)
    }
  }, [modalVisible])

  const handleMergeCaseNumberBlur = (value: string) => {
    const validation = validate([[value, ['S-case-number']]])

    setMergeCaseNumberErrorMessage(
      validation.isValid ? undefined : validation.errorMessage,
    )
  }

  const isValidGeneratedIndictmentCourtRecord =
    isGeneratedIndictmentCourtRecordValid(workingCase)
  const isEmptyGeneratedIndictmentCourtRecord =
    isNoGeneratedIndictmentCourtRecord(workingCase)
  const isCourtRecordValid = workingCase.withCourtSessions
    ? isValidGeneratedIndictmentCourtRecord
    : uploadFiles.some(
        (file) =>
          file.category === CaseFileCategory.COURT_RECORD &&
          file.status === FileUploadStatus.done,
      )

  const stepIsValid = () => {
    // Do not leave any uploads unfinished (staged DEFENDANT_RULING files are uploaded on confirm)
    const hasUnfinishedUploads = uploadFiles.some(
      (file) =>
        file.status !== FileUploadStatus.done &&
        file.status !== FileUploadStatus.error &&
        !(file.category === CaseFileCategory.DEFENDANT_RULING && !file.key),
    )
    if (hasUnfinishedUploads) {
      return false
    }

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
              isCourtRecordValid &&
              uploadFiles.some(
                (file) =>
                  file.category === CaseFileCategory.RULING &&
                  file.status === FileUploadStatus.done,
              )
            )
          case CaseIndictmentRulingDecision.CANCELLATION:
          case CaseIndictmentRulingDecision.FINE:
            return isCourtRecordValid
          case CaseIndictmentRulingDecision.MERGE:
            return (
              (workingCase.withCourtSessions
                ? isValidGeneratedIndictmentCourtRecord ||
                  isEmptyGeneratedIndictmentCourtRecord
                : true) &&
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
      case IndictmentDecision.COMPLETING_FOR_SOME:
        return (
          Object.values(completingForSomeSelections).filter(Boolean).length > 0
        )
      default:
        return false
    }
  }
  const hasJudgementRuling = Boolean(
    workingCase.courtSessions?.some(
      (courtSession) =>
        courtSession.rulingType === CourtSessionRulingType.JUDGEMENT &&
        courtSession.ruling,
    ),
  )

  const missingValidGeneratedCourtRecordForCompletion = Boolean(
    workingCase.withCourtSessions &&
      !isValidGeneratedIndictmentCourtRecord &&
      selectedAction === IndictmentDecision.COMPLETING &&
      (selectedDecision === CaseIndictmentRulingDecision.RULING ||
        selectedDecision === CaseIndictmentRulingDecision.FINE ||
        selectedDecision === CaseIndictmentRulingDecision.DISMISSAL ||
        selectedDecision === CaseIndictmentRulingDecision.CANCELLATION),
  )

  const missingValidGeneratedCourtRecordForCompletionWithMerge = Boolean(
    workingCase.withCourtSessions &&
      !isEmptyGeneratedIndictmentCourtRecord &&
      !isValidGeneratedIndictmentCourtRecord &&
      selectedAction === IndictmentDecision.COMPLETING &&
      selectedDecision === CaseIndictmentRulingDecision.MERGE,
  )

  const missingValidGeneratedCourtRecordForSplitting = Boolean(
    workingCase.withCourtSessions &&
      !isValidGeneratedIndictmentCourtRecord &&
      selectedAction === IndictmentDecision.SPLITTING,
  )

  const missingRulingInGeneratedCourtSessions = Boolean(
    workingCase.withCourtSessions &&
      selectedAction === IndictmentDecision.COMPLETING &&
      selectedDecision === CaseIndictmentRulingDecision.RULING &&
      !hasJudgementRuling,
  )

  const completingForSomeSelectedCount = Object.values(
    completingForSomeSelections,
  ).filter(Boolean).length

  const radioButtons = [
    {
      id: 'conclusion-postponing',
      value: IndictmentDecision.POSTPONING,
      label: formatMessage(strings.postponing),
    },
    {
      id: 'conclusion-scheduling',
      value: IndictmentDecision.SCHEDULING,
      label: formatMessage(strings.scheduling),
    },
    {
      id: 'conclusion-postponing-until-verdict',
      value: IndictmentDecision.POSTPONING_UNTIL_VERDICT,
      label: formatMessage(strings.postponingUntilVerdict),
    },
    {
      id: 'conclusion-completing',
      value: IndictmentDecision.COMPLETING,
      label: formatMessage(strings.completing),
    },
    {
      id: 'conclusion-redistributing',
      value: IndictmentDecision.REDISTRIBUTING,
      label: formatMessage(strings.redistributing),
    },
    ...(activeDefendants && activeDefendants.length > 1
      ? [
          {
            id: 'conclusion-splitting',
            value: IndictmentDecision.SPLITTING,
            label: 'Kljúfa mál',
          },
          {
            id: 'conclusion-completing-for-some',
            value: IndictmentDecision.COMPLETING_FOR_SOME,
            label: 'Skrá lyktir á einstaka aðila án þess að ljúka máli',
          },
        ]
      : []),
  ]

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
              {radioButtons.map(({ id, value, label }) => (
                <RadioButton
                  key={id}
                  id={id}
                  name={id}
                  checked={selectedAction === value}
                  disabled={workingCase.state === CaseState.CORRECTING}
                  onChange={() => setSelectedAction(value)}
                  label={label}
                  backgroundColor="white"
                  large
                />
              ))}
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
                    <SelectCandidateMergeCase
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
                options={activeDefendants?.map((defendant) => ({
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
                  const defendant = activeDefendants?.find(
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
          {selectedAction === IndictmentDecision.COMPLETING_FOR_SOME &&
            isNonEmptyArray(activeDefendants) && (
              <>
                {activeDefendants.map((defendant) => (
                  <BlueBox
                    key={`completing-for-some-${defendant.id}`}
                    className={grid({ gap: 2 })}
                  >
                    <SectionHeading
                      title={defendant.name || ''}
                      variant="h4"
                      marginBottom={0}
                    />
                    <Select
                      id={`completing-for-some-${defendant.id}`}
                      label="Lyktir"
                      placeholder="Veldu lyktir ef á við"
                      options={completingForSomeOptions}
                      value={completingForSomeOptions.find(
                        (option) =>
                          option.value ===
                          completingForSomeSelections[defendant.id],
                      )}
                      onChange={(selectedOption) => {
                        setCompletingForSomeSelections((prevSelections) => ({
                          ...prevSelections,
                          [defendant.id]: selectedOption?.value as
                            | CaseIndictmentRulingDecision
                            | undefined,
                        }))
                      }}
                      isDisabled={
                        workingCase.state === CaseState.CORRECTING ||
                        (!completingForSomeSelections[defendant.id] &&
                          completingForSomeSelectedCount >=
                            activeDefendants.length - 1)
                      }
                      size="sm"
                      isClearable
                    />
                  </BlueBox>
                ))}
              </>
            )}
          {((selectedAction === IndictmentDecision.COMPLETING &&
            (selectedDecision === CaseIndictmentRulingDecision.RULING ||
              selectedDecision === CaseIndictmentRulingDecision.DISMISSAL)) ||
            (selectedAction === IndictmentDecision.COMPLETING_FOR_SOME &&
              Object.values(completingForSomeSelections).some(
                (value) => value === CaseIndictmentRulingDecision.DISMISSAL,
              ))) && (
            <Box component="section">
              <SectionHeading
                title={formatMessage(
                  selectedAction === IndictmentDecision.COMPLETING &&
                    selectedDecision === CaseIndictmentRulingDecision.RULING
                    ? strings.verdictUploadTitle
                    : strings.rulingUploadTitle,
                )}
                required={
                  selectedAction !== IndictmentDecision.COMPLETING_FOR_SOME
                }
              />
              <InputFileUpload
                name="ruling"
                files={uploadFiles.filter(
                  (file) =>
                    file.category ===
                    (selectedAction === IndictmentDecision.COMPLETING_FOR_SOME
                      ? CaseFileCategory.DEFENDANT_RULING
                      : CaseFileCategory.RULING),
                )}
                accept="application/pdf"
                title={formatMessage(strings.inputFieldLabel)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(strings.uploadButtonText)}
                onChange={(files) => {
                  if (
                    selectedAction === IndictmentDecision.COMPLETING_FOR_SOME
                  ) {
                    addUploadFiles(files, {
                      category: CaseFileCategory.DEFENDANT_RULING,
                    })
                  } else {
                    handleUpload(
                      addUploadFiles(files, {
                        category: CaseFileCategory.RULING,
                      }),
                      updateUploadFile,
                    )
                  }
                }}
                onRemove={(file) =>
                  selectedAction === IndictmentDecision.COMPLETING_FOR_SOME &&
                  !file.key
                    ? removeUploadFile(file)
                    : handleRemove(file, removeUploadFile)
                }
                onRetry={(file) => handleRetry(file, updateUploadFile)}
                onOpenFile={(file) => onOpenFile(file)}
              />
            </Box>
          )}
          {selectedAction === IndictmentDecision.COMPLETING &&
            (selectedDecision === CaseIndictmentRulingDecision.FINE ||
              selectedDecision === CaseIndictmentRulingDecision.RULING) &&
            isNonEmptyArray(activeDefendants) && (
              <Box component="section" className={grid({ gap: 3 })}>
                {activeDefendants.map((defendant) => (
                  <BlueBox key={defendant.id} className={grid({ gap: 2 })}>
                    <SectionHeading
                      title={defendant.name || ''}
                      variant="h5"
                      marginBottom={0}
                    />
                    <CheckboxList
                      blueBox={false}
                      fullWidth
                      checkboxes={[
                        ...(selectedDecision ===
                        CaseIndictmentRulingDecision.RULING
                          ? [
                              {
                                id: `default-judgment-${defendant.id}`,
                                title: 'Útivistardómur',
                                checked:
                                  defendant.verdict?.isDefaultJudgement ||
                                  false,
                                onChange: (checked: boolean) =>
                                  updateDefendantVerdictState(
                                    {
                                      caseId: workingCase.id,
                                      defendantId: defendant.id,
                                      isDefaultJudgement: checked,
                                    },
                                    setWorkingCase,
                                  ),
                              },
                            ]
                          : []),
                        {
                          id: `driving-license-revocation-${defendant.id}`,
                          title: 'Svipting ökuréttar',
                          checked: defendant.isDrivingLicenseSuspended || false,
                          onChange: (checked: boolean) =>
                            updateDefendantState(
                              {
                                caseId: workingCase.id,
                                defendantId: defendant.id,
                                isDrivingLicenseSuspended: checked,
                              },
                              setWorkingCase,
                            ),
                        },
                      ]}
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
          previousUrl={`${DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() => {
            if (
              selectedAction === IndictmentDecision.COMPLETING_FOR_SOME ||
              selectedAction === IndictmentDecision.SPLITTING
            ) {
              if (selectedAction === IndictmentDecision.COMPLETING_FOR_SOME) {
                setConclusionDate(formatDate(new Date()))
                setModalVisible('COMPLETING_FOR_SOME')
              } else {
                setModalVisible('SPLIT')
              }
              return
            }

            handleNavigationTo(
              selectedAction === IndictmentDecision.COMPLETING
                ? DISTRICT_COURT_INDICTMENT_CASE_SUMMARY_ROUTE
                : selectedAction === IndictmentDecision.REDISTRIBUTING
                ? getStandardUserDashboardRoute(user)
                : DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE,
            )
          }}
          nextButtonText={
            selectedAction === IndictmentDecision.COMPLETING
              ? undefined
              : formatMessage(strings.nextButtonTextConfirm)
          }
          nextIsDisabled={!stepIsValid()}
          nextIsLoading={isUpdatingCase}
          hideNextButton={
            missingValidGeneratedCourtRecordForCompletion ||
            missingValidGeneratedCourtRecordForCompletionWithMerge ||
            missingRulingInGeneratedCourtSessions ||
            missingValidGeneratedCourtRecordForSplitting
          }
          infoBoxText={
            missingValidGeneratedCourtRecordForCompletion
              ? 'Til að ljúka máli öðruvísi en með sameiningu þarf að staðfesta þingbók á þingbókarskjá.'
              : missingValidGeneratedCourtRecordForCompletionWithMerge
              ? 'Til að ljúka máli með sameiningu þarf að staðfesta þingbók á þingbókarskjá eða þingbók þarf að vera tóm.'
              : missingRulingInGeneratedCourtSessions
              ? 'Þegar máli lýkur með dómi þarf að skrá dómsorðið á þingbókarskjá.'
              : missingValidGeneratedCourtRecordForSplitting
              ? 'Til að kljúfa máli þarf að staðfesta þingbók á þingbókarskjá.'
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
          footerJustifyContent="flexEnd"
          primaryButton={{
            text: 'Staðfesta',
            onClick: () => {
              router.push(
                `${DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE}/${workingCase.id}`,
              )
            },
            isDisabled: !validate([
              [splitCaseCourtCaseNumber, ['empty', 'S-case-number']],
            ]).isValid,
          }}
        >
          <CourtCaseNumberInput
            caseId={splitCaseId}
            isIndictmentCase={true}
            courtCaseNumber={splitCaseCourtCaseNumber}
            isDisabled={false}
            setCourtCaseNumber={setSplitCaseCourtCaseNumber}
          />
        </Modal>
      )}
      <AnimatePresence>
        {modalVisible === 'COMPLETING_FOR_SOME' && (
          <Modal
            title="Skrá lyktir á aðila án þess að ljúka máli"
            text="Lyktir verða skráðar á valda aðila."
            primaryButton={{
              text: 'Halda áfram',
              onClick: () => setModalVisible('CONFIRM_COMPLETION_FOR_SOME'),
              isDisabled: !(
                conclusionDate &&
                validate([[conclusionDate, ['date-of-birth']]]).isValid
              ),
            }}
            secondaryButton={{
              text: 'Hætta við',
              onClick: () => setModalVisible(undefined),
            }}
            onClose={() => setModalVisible(undefined)}
          >
            <Box className={grid({ gap: 3, marginBottom: 3 })}>
              {workingCase.defendants
                ?.filter(
                  (defendant) =>
                    completingForSomeSelections[defendant.id] !== undefined,
                )
                .map((defendant) => (
                  <Text
                    key={`${defendant.id}-completing-for-some`}
                    variant="h4"
                    as="h4"
                  >
                    {`${defendant.name}: `}
                    <Text as="span">
                      {
                        completingForSomeOptions.find(
                          (option) =>
                            option.value ===
                            completingForSomeSelections[defendant.id],
                        )?.label
                      }
                    </Text>
                  </Text>
                ))}
              <InputDate
                onChange={(date) => setConclusionDate(date)}
                onBlur={(date) => setConclusionDate(date)}
                value={conclusionDate}
              />
            </Box>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modalVisible === 'CONFIRM_COMPLETION_FOR_SOME' && (
          <Modal
            title="Viltu staðfesta lyktir?"
            primaryButton={{
              text: 'Staðfesta',
              onClick: async () => {
                setIsSubmittingForSome(true)
                try {
                  const pendingFiles = uploadFiles.filter(
                    (file) =>
                      file.category === CaseFileCategory.DEFENDANT_RULING &&
                      !file.key,
                  )
                  if (pendingFiles.length > 0) {
                    const result = await handleUpload(
                      pendingFiles,
                      updateUploadFile,
                    )
                    if (result === 'NONE_SUCCEEDED') {
                      return
                    }
                  }
                  handleNavigationTo(
                    DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE,
                  )
                } finally {
                  setIsSubmittingForSome(false)
                }
              },
              icon: 'checkmark',
              isLoading: isSubmittingForSome || isUpdatingCase,
            }}
            secondaryButton={{
              text: 'Hætta við',
              onClick: () => setModalVisible(undefined),
            }}
            onClose={() => setModalVisible(undefined)}
          >
            <Box className={grid({ marginBottom: 3 })}>
              {workingCase.defendants
                ?.filter(
                  (defendant) =>
                    completingForSomeSelections[defendant.id] !== undefined,
                )
                .map((defendant) => (
                  <Text key={defendant.id} variant="h4" as="h4">
                    {`${defendant.name}: `}
                    <Text as="span">
                      {
                        completingForSomeOptions.find(
                          (option) =>
                            option.value ===
                            completingForSomeSelections[defendant.id],
                        )?.label
                      }
                    </Text>
                  </Text>
                ))}
              <Text variant="h4" as="h4">
                {`Dagsetning lykta: `}
                <Text as="span">{conclusionDate ?? ''}</Text>
              </Text>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Conclusion
