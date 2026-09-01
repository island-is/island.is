import type { FC } from 'react'
import { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import router from 'next/router'

import { Box, Button, Checkbox } from '@island.is/island-ui/core'
import {
  DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
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
} from '@island.is/judicial-system-web/src/components'
import type {
  Case,
  Defendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseState,
  CourtSessionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { SubpoenaType } from '@island.is/judicial-system-web/src/routes/Court/components'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useCreateSubpoenas,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { canSkipArraignmentSummons as isArraignmentSummonsSkippable } from '@island.is/judicial-system-web/src/utils/utils'
import { isSubpoenaStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { subpoena as strings } from './Subpoena.strings'
import { pdfButtonGrid } from './Subpoena.css'

export interface Updates {
  defendants?: Defendant[] | null
  theCase: Case
}

interface ModalContent {
  title: string
  text: string
  primaryButtonText: string
}

const Subpoena: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [updates, setUpdates] = useState<Updates>()
  const [newSubpoenas, setNewSubpoenas] = useState<string[]>([])
  const [newAlternativeServices, setNewAlternativeServices] = useState<
    string[]
  >([])
  const [isCreatingSubpoena, setIsCreatingSubpoena] = useState<boolean>(false)

  const [skipArraignmentSummons, setSkipArraignmentSummons] =
    useState<boolean>(false)

  const isArraignmentScheduled = Boolean(workingCase.arraignmentDate)
  const hasSkippedArraignmentSummons = Boolean(
    workingCase.isArraignmentSummonsSkipped,
  )
  // The step is settled once the court has either scheduled an arraignment
  // or decided not to summon to one at all
  const hasArraignmentBeenSettled =
    isArraignmentScheduled || hasSkippedArraignmentSummons

  // Skipping is only on the table while nobody is receiving a subpoena.
  // After an arraignment has already been scheduled, it also unlocks when
  // the court re-enters alternative service for every defendant.
  const canSkipArraignmentSummons = isArraignmentSummonsSkippable(
    // Fall back to the server's defendants for the first render, before the
    // effect below seeds `updates`, so the step does not flash as invalid
    updates?.defendants ?? workingCase.defendants,
    {
      isArraignmentScheduled,
      newAlternativeServiceDefendantIds: newAlternativeServices,
    },
  )
  const isSkippingArraignmentSummons =
    canSkipArraignmentSummons && skipArraignmentSummons

  const isSchedulingArraignmentDate = Boolean(
    !hasArraignmentBeenSettled ||
      newSubpoenas.length > 0 ||
      newAlternativeServices.length > 0 ||
      isSkippingArraignmentSummons !== hasSkippedArraignmentSummons,
  )
  const [modalContent, setModalContent] = useState<ModalContent>()

  const { updateDefendant } = useDefendants()
  const { setAndSendCaseToServer } = useCase()
  const { createSubpoenas } = useCreateSubpoenas()
  const { formatMessage } = useIntl()

  const isIssuingSubpoenaForDefendant = (defendant: Defendant) =>
    !defendant.isAlternativeService &&
    (!hasArraignmentBeenSettled || newSubpoenas.includes(defendant.id))

  const isIssuingSubpoenas = updates?.defendants?.some((defendant) =>
    isIssuingSubpoenaForDefendant(defendant),
  )

  const isRegisteringAlternativeServiceForDefendant = (defendant: Defendant) =>
    defendant.isAlternativeService &&
    (!hasArraignmentBeenSettled ||
      newAlternativeServices.includes(defendant.id))

  const isIssuingAlternativeServices = updates?.defendants?.some((defendant) =>
    isRegisteringAlternativeServiceForDefendant(defendant),
  )

  const toggleNewAlternativeService = (defendant: Defendant) => () => {
    if (!defendant.isAlternativeService) {
      setNewAlternativeServices((previous) => [...previous, defendant.id])
      return
    }

    setNewAlternativeServices((previous) =>
      previous.filter((id) => id !== defendant.id),
    )

    // Turning alternative service off means a new subpoena is being issued,
    // just like when the new subpoena button is used
    setNewSubpoenas((previous) =>
      previous.includes(defendant.id) ? previous : [...previous, defendant.id],
    )
  }

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (!isSchedulingArraignmentDate) {
        router.push(`${destination}/${workingCase.id}`)
        return
      }

      setNavigateTo(destination)
    },
    [isSchedulingArraignmentDate, workingCase.id],
  )

  const scheduleArraignmentDate = useCallback(async () => {
    setIsCreatingSubpoena(true)

    // When rescheduling, only update defendants we're issuing new subpoenas or alternative services for
    const defendantsToUpdate = hasArraignmentBeenSettled
      ? updates?.defendants?.filter(
          (defendant) =>
            newSubpoenas.includes(defendant.id) ||
            newAlternativeServices.includes(defendant.id),
        )
      : updates?.defendants

    const promises: Promise<boolean>[] = []

    defendantsToUpdate?.forEach((defendant) => {
      promises.push(
        updateDefendant({
          caseId: workingCase.id,
          defendantId: defendant.id,
          isAlternativeService: defendant.isAlternativeService,
          // Clear the alternative service description if the defendant
          // is not being served by alternative means
          alternativeServiceDescription: defendant.isAlternativeService
            ? defendant.alternativeServiceDescription
            : null,
          // Clear the subpoena type if the defendant is
          // being served by alternative means
          subpoenaType: defendant.isAlternativeService
            ? null
            : defendant.subpoenaType,
        }),
      )
    })

    // Make sure defendants are updated before submitting the court date
    const allDefendantsUpdated = await Promise.all(promises)

    if (!allDefendantsUpdated.every((result) => result)) {
      setIsCreatingSubpoena(false)
      return
    }

    const additionalUpdates = [
      {
        // This should always be an arraignment type
        courtSessionType: CourtSessionType.ARRAIGNMENT,
        // if the case is being rescheduled after the court has met,
        // then clear the current conclusion
        ...(hasArraignmentBeenSettled && workingCase.indictmentDecision
          ? {
              indictmentDecision: null,
              courtDate: null,
              postponedIndefinitelyExplanation: null,
              indictmentRulingDecision: null,
              mergeCaseId: null,
              force: true,
            }
          : {}),
      },
    ]

    const courtDateUpdated = await setAndSendCaseToServer(
      [
        ...additionalUpdates,
        {
          ...(isSkippingArraignmentSummons
            ? {
                isArraignmentSummonsSkipped: true,
                arraignmentDate: null,
              }
            : {
                isArraignmentSummonsSkipped: false,
                arraignmentDate: {
                  date: updates?.theCase.arraignmentDate?.date,
                  location: updates?.theCase.arraignmentDate?.location,
                },
              }),
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )

    if (!courtDateUpdated) {
      setIsCreatingSubpoena(false)
      return
    }

    // Create subpoenas for selected defendants (or all if first-time scheduling),
    // never for defendants being served by alternative means
    const defendantIdsToCreateSubpoenasFor =
      updates?.defendants
        ?.filter(
          (defendant) =>
            !defendant.isAlternativeService &&
            (!hasArraignmentBeenSettled || newSubpoenas.includes(defendant.id)),
        )
        .map((defendant) => defendant.id) ?? []

    if (defendantIdsToCreateSubpoenasFor.length > 0) {
      const arraignmentDate = updates?.theCase.arraignmentDate?.date
      if (!arraignmentDate) {
        setIsCreatingSubpoena(false)
        return
      }

      const location = updates?.theCase.arraignmentDate?.location
      const subpoenasCreated = await createSubpoenas(workingCase.id, {
        defendantIds: defendantIdsToCreateSubpoenasFor,
        arraignmentDate,
        location: location ?? undefined,
      })

      if (!subpoenasCreated) {
        setIsCreatingSubpoena(false)
        return
      }
    }

    router.push(`${navigateTo}/${workingCase.id}`)
  }, [
    createSubpoenas,
    hasArraignmentBeenSettled,
    isSkippingArraignmentSummons,
    navigateTo,
    newAlternativeServices,
    newSubpoenas,
    setAndSendCaseToServer,
    setWorkingCase,
    updateDefendant,
    updates?.defendants,
    updates?.theCase.arraignmentDate,
    workingCase,
  ])

  const handleDefendantUpdates = (update: UpdateDefendantInput) => {
    setUpdates((prev) => {
      if (!prev) return

      return {
        defendants: prev.defendants?.map((item) =>
          item.id === update.defendantId ? { ...item, ...update } : item,
        ),
        theCase: prev.theCase,
      }
    })
  }

  const updateCourtArrangement = (update: {
    date?: Date | null
    location?: string
  }) => {
    setUpdates((prev) => {
      if (!prev) return

      return {
        defendants: prev.defendants,
        theCase: {
          ...prev.theCase,
          arraignmentDate: {
            date:
              update.date !== undefined
                ? update.date
                  ? update.date.toISOString()
                  : null
                : prev.theCase.arraignmentDate?.date,
            location:
              update.location !== undefined
                ? update.location
                : prev.theCase.arraignmentDate?.location,
          },
        },
      }
    })
  }

  const handleCourtDateChange = (
    date: Date | undefined | null,
    valid: boolean,
  ) => {
    if (!valid) return

    updateCourtArrangement({ date })
  }

  const handleCourtRoomChange = (courtRoom?: string) => {
    updateCourtArrangement({ location: courtRoom })
  }

  useEffect(() => {
    setUpdates({ defendants: workingCase.defendants, theCase: workingCase })
    setSkipArraignmentSummons(Boolean(workingCase.isArraignmentSummonsSkipped))
  }, [workingCase])

  useEffect(() => {
    if (!canSkipArraignmentSummons) {
      setSkipArraignmentSummons(false)
    }
  }, [canSkipArraignmentSummons])

  useEffect(() => {
    if (navigateTo === undefined) {
      setModalContent(undefined)
      return
    }

    if (modalContent) {
      return
    }

    const hasCivilClaimants =
      workingCase.civilClaimants && workingCase.civilClaimants.length > 0
    const subpoenaText = hasCivilClaimants
      ? 'Ákæra, fyrirkall og bótakrafa verða send til ákæranda.\nÁkærða verður birt ákæran, fyrirkallið og bótakrafan rafrænt á island.is eða af lögreglu.'
      : 'Ákæra og fyrirkall verða send til ákæranda.\nÁkærða verður birt ákæran og fyrirkallið rafrænt á island.is eða af lögreglu.'

    if (isSkippingArraignmentSummons) {
      setModalContent({
        title: strings.modalAlternativeServiceTitle,
        text: 'Ekki verður send boðun í þingfestingu.',
        primaryButtonText: strings.modalAlternativeServicePrimaryButtonText,
      })
    } else if (isIssuingAlternativeServices && isIssuingSubpoenas) {
      // Some defendants were served by other means while others are being
      // summoned, so the modal has to cover both
      setModalContent({
        title: strings.modalAlternativeServiceTitle,
        text: `${strings.modalAlternativeServiceText}\n\n${subpoenaText}`,
        primaryButtonText: strings.modalAlternativeServicePrimaryButtonText,
      })
    } else if (isIssuingAlternativeServices) {
      setModalContent({
        title: strings.modalAlternativeServiceTitle,
        text: strings.modalAlternativeServiceText,
        primaryButtonText: strings.modalAlternativeServicePrimaryButtonText,
      })
    } else if (isIssuingSubpoenas) {
      setModalContent({
        title: formatMessage(strings.modalTitle),
        text: subpoenaText,
        primaryButtonText: formatMessage(strings.modalPrimaryButtonText),
      })
    } else if (isSchedulingArraignmentDate) {
      setModalContent({
        title: strings.modalAlternativeServiceTitle,
        text: strings.modalAlternativeServiceText,
        primaryButtonText: strings.modalAlternativeServicePrimaryButtonText,
      })
    }
  }, [
    navigateTo,
    isSkippingArraignmentSummons,
    isIssuingAlternativeServices,
    isIssuingSubpoenas,
    isSchedulingArraignmentDate,
    formatMessage,
    modalContent,
    workingCase.civilClaimants,
  ])

  const stepIsValid = isSubpoenaStepValid(
    workingCase,
    updates?.defendants,
    updates?.theCase.arraignmentDate,
    isSkippingArraignmentSummons,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.subpoena)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          {updates?.defendants && (
            <SubpoenaType
              subpoenaItems={updates?.defendants?.map((defendant) => ({
                defendant,
                alternativeServiceDescriptionDisabled:
                  !isRegisteringAlternativeServiceForDefendant(defendant),
                subpoenaDisabled: !isIssuingSubpoenaForDefendant(defendant),
                toggleNewAlternativeService: hasArraignmentBeenSettled
                  ? toggleNewAlternativeService(defendant)
                  : undefined,
                onUpdate: handleDefendantUpdates,
                children: newSubpoenas.includes(defendant.id) ? (
                  <Button
                    variant="text"
                    colorScheme="destructive"
                    icon="trash"
                    iconType="outline"
                    disabled={workingCase.state === CaseState.CORRECTING}
                    onClick={() => {
                      setNewSubpoenas((previous) =>
                        previous.filter((v) => v !== defendant.id),
                      )
                      setNewAlternativeServices((previous) =>
                        previous.filter((v) => v !== defendant.id),
                      )
                      setUpdates((prev) => {
                        if (!prev) return prev

                        const originalDefendant = workingCase.defendants?.find(
                          (d) => d.id === defendant.id,
                        )

                        if (!originalDefendant) return prev

                        return {
                          ...prev,
                          defendants: prev.defendants?.map((item) =>
                            item.id === defendant.id ? originalDefendant : item,
                          ),
                        }
                      })
                    }}
                  >
                    Hætta við
                  </Button>
                ) : hasArraignmentBeenSettled ? (
                  <Button
                    variant="text"
                    icon="reload"
                    disabled={workingCase.state === CaseState.CORRECTING}
                    onClick={() => {
                      setNewSubpoenas((previous) => [...previous, defendant.id])
                      if (defendant.isAlternativeService) {
                        toggleNewAlternativeService(defendant)()
                      }
                      handleDefendantUpdates({
                        defendantId: defendant.id,
                        caseId: workingCase.id,
                        isAlternativeService: false,
                        alternativeServiceDescription: null,
                      })
                    }}
                  >
                    {formatMessage(strings.newSubpoenaButtonText)}
                  </Button>
                ) : null,
              }))}
              workingCase={workingCase}
            />
          )}
          <Box component="section">
            <SectionHeading
              title={formatMessage(strings.courtArrangementsHeading)}
            />
            <BlueBox>
              {canSkipArraignmentSummons && (
                <Box marginBottom={2}>
                  <Checkbox
                    id="skipArraignmentSummons"
                    name="skipArraignmentSummons"
                    label="Ekki boða til þingfestingar"
                    checked={skipArraignmentSummons}
                    onChange={() => {
                      const nextSkipArraignmentSummons = !skipArraignmentSummons

                      setSkipArraignmentSummons(nextSkipArraignmentSummons)

                      // Drop anything already typed so a stale date is not
                      // submitted along with the skip
                      if (nextSkipArraignmentSummons) {
                        updateCourtArrangement({ date: null, location: '' })
                      }
                    }}
                    tooltip="Ef ekki er þörf á því að boða til þingfestingar, til dæmis vegna sameiningu mála, er hægt að haka við þennan reit."
                    disabled={workingCase.state === CaseState.CORRECTING}
                    backgroundColor="white"
                    large
                    filled
                  />
                </Box>
              )}
              <CourtArrangements
                blueBox={false}
                handleCourtDateChange={handleCourtDateChange}
                handleCourtRoomChange={handleCourtRoomChange}
                courtDate={updates?.theCase.arraignmentDate}
                dateTimeDisabled={
                  !isSchedulingArraignmentDate ||
                  isSkippingArraignmentSummons ||
                  workingCase.state === CaseState.CORRECTING
                }
                courtRoomDisabled={
                  !isSchedulingArraignmentDate ||
                  isSkippingArraignmentSummons ||
                  workingCase.state === CaseState.CORRECTING
                }
                courtRoomRequired
              />
            </BlueBox>
          </Box>
          <Box component="section" className={pdfButtonGrid}>
            {updates?.defendants?.map((defendant) => {
              const courtDate = updates.theCase.arraignmentDate?.date
              const location = updates.theCase.arraignmentDate?.location

              return (
                <Fragment key={defendant.id}>
                  {isIssuingSubpoenaForDefendant(defendant) && (
                    <PdfButton
                      key={`subpoena-${defendant.id}`}
                      caseId={workingCase.id}
                      title={`Fyrirkall - ${defendant.name} nýtt - PDF`}
                      pdfType="subpoena"
                      disabled={
                        !courtDate || !location || !defendant.subpoenaType
                      }
                      elementId={[
                        defendant.id,
                        `Fyrirkall - ${defendant.name} nýtt - PDF`,
                      ]}
                      queryParameters={`arraignmentDate=${courtDate}&location=${location}&subpoenaType=${defendant.subpoenaType}`}
                    />
                  )}
                  {defendant.subpoenas?.map((subpoena) => {
                    const fileName = `Fyrirkall - ${
                      defendant.name
                    } ${formatDate(subpoena.created)} - PDF`

                    return (
                      <PdfButton
                        key={`subpoena-${subpoena.id}`}
                        caseId={workingCase.id}
                        title={fileName}
                        pdfType="subpoena"
                        elementId={[defendant.id, subpoena.id, fileName]}
                      />
                    )
                  })}
                </Fragment>
              )
            })}
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          actions={[
            {
              text: !isSchedulingArraignmentDate
                ? formatMessage(core.continue)
                : formatMessage(strings.nextButtonText),
              icon: 'arrowForward',
              onClick: () => {
                if (!isSchedulingArraignmentDate) {
                  router.push(
                    `${DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE}/${workingCase.id}`,
                  )
                } else {
                  setNavigateTo(DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE)
                }
              },
              disabled: !stepIsValid,
              loading: isLoadingWorkingCase,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
      <AnimatePresence>
        {modalContent && (
          <Modal
            title={modalContent.title}
            text={modalContent.text}
            buttons={[
              {
                text: formatMessage(strings.modalSecondaryButtonText),
                onClick: () => setNavigateTo(undefined),
                variant: 'ghost',
              },
              {
                text: modalContent.primaryButtonText,
                onClick: () => scheduleArraignmentDate(),
                isLoading: isCreatingSubpoena,
              },
            ]}
            onClose={() => setNavigateTo(undefined)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Subpoena
