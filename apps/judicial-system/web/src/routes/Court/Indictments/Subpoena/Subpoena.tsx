import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Button } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { titles } from '@island.is/judicial-system-web/messages'
import {
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
import {
  Case,
  CaseState,
  CourtSessionType,
  Defendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { SubpoenaType } from '@island.is/judicial-system-web/src/routes/Court/components'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useCreateSubpoenas,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
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

  const isArraignmentScheduled = Boolean(workingCase.arraignmentDate)
  const isSchedulingArraignmentDate = Boolean(
    !isArraignmentScheduled ||
      newSubpoenas.length > 0 ||
      newAlternativeServices.length > 0,
  )
  const [modalContent, setModalContent] = useState<ModalContent>()

  const { updateDefendant } = useDefendants()
  const { setAndSendCaseToServer } = useCase()
  const { createSubpoenas } = useCreateSubpoenas()
  const { formatMessage } = useIntl()

  const isIssuingSubpoenaForDefendant = (defendant: Defendant) =>
    !defendant.isAlternativeService &&
    (!isArraignmentScheduled || newSubpoenas.includes(defendant.id))

  const isIssuingSubpoenas = updates?.defendants?.some((defendant) =>
    isIssuingSubpoenaForDefendant(defendant),
  )

  const isRegisteringAlternativeServiceForDefendant = (defendant: Defendant) =>
    defendant.isAlternativeService &&
    (!isArraignmentScheduled || newAlternativeServices.includes(defendant.id))

  const isIssuingAlternativeServices = updates?.defendants?.some((defendant) =>
    isRegisteringAlternativeServiceForDefendant(defendant),
  )

  const toggleNewAlternativeService = (defendant: Defendant) => () => {
    setNewAlternativeServices((previous) =>
      defendant.isAlternativeService
        ? previous.filter((id) => id !== defendant.id)
        : [...previous, defendant.id],
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
    const defendantsToUpdate = isArraignmentScheduled
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
          // Only change the subpoena type if the defendant is not
          // being served by alternative means
          subpoenaType: defendant.isAlternativeService
            ? undefined
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
        ...(isArraignmentScheduled && workingCase.indictmentDecision
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
          arraignmentDate: {
            date: updates?.theCase.arraignmentDate?.date,
            location: updates?.theCase.arraignmentDate?.location,
          },
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

    // Create subpoenas for selected defendants (or all if first-time scheduling)
    const defendantIdsToCreateSubpoenasFor = isArraignmentScheduled
      ? newSubpoenas
      : updates?.defendants
          ?.filter((defendant) => !defendant.isAlternativeService)
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
    isArraignmentScheduled,
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
  }, [workingCase])

  useEffect(() => {
    if (navigateTo === undefined) {
      setModalContent(undefined)
      return
    }

    if (modalContent) {
      return
    }

    if (isIssuingAlternativeServices) {
      setModalContent({
        title: strings.modalAlternativeServiceTitle,
        text: strings.modalAlternativeServiceText,
        primaryButtonText: strings.modalAlternativeServicePrimaryButtonText,
      })
    } else if (isIssuingSubpoenas) {
      const hasCivilClaimants =
        workingCase.civilClaimants && workingCase.civilClaimants.length > 0
      setModalContent({
        title: formatMessage(strings.modalTitle),
        text: hasCivilClaimants
          ? 'Ákæra, fyrirkall og bótakrafa verða send til ákæranda.\nÁkærða verður birt ákæran, fyrirkallið og bótakrafan rafrænt á island.is eða af lögreglu.'
          : 'Ákæra og fyrirkall verða send til ákæranda.\nÁkærða verður birt ákæran og fyrirkallið rafrænt á island.is eða af lögreglu.',
        primaryButtonText: formatMessage(strings.modalPrimaryButtonText),
      })
    }
  }, [
    navigateTo,
    isIssuingAlternativeServices,
    isIssuingSubpoenas,
    formatMessage,
    modalContent,
    workingCase.civilClaimants,
  ])

  const stepIsValid = isSubpoenaStepValid(
    workingCase,
    updates?.defendants,
    updates?.theCase.arraignmentDate,
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
        {updates?.defendants && (
          <div className={grid({ gap: 5, marginBottom: 10 })}>
            <SubpoenaType
              subpoenaItems={updates?.defendants?.map((defendant) => ({
                defendant,
                alternativeServiceDescriptionDisabled:
                  !isRegisteringAlternativeServiceForDefendant(defendant),
                subpoenaDisabled: !isIssuingSubpoenaForDefendant(defendant),
                toggleNewAlternativeService: isArraignmentScheduled
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
                ) : isArraignmentScheduled ? (
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
          </div>
        )}
        <Box component="section">
          <SectionHeading
            title={formatMessage(strings.courtArrangementsHeading)}
          />
          <CourtArrangements
            handleCourtDateChange={handleCourtDateChange}
            handleCourtRoomChange={handleCourtRoomChange}
            courtDate={updates?.theCase.arraignmentDate}
            dateTimeDisabled={
              !isSchedulingArraignmentDate ||
              workingCase.state === CaseState.CORRECTING
            }
            courtRoomDisabled={
              !isSchedulingArraignmentDate ||
              workingCase.state === CaseState.CORRECTING
            }
            courtRoomRequired
          />
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
                  const fileName = `Fyrirkall - ${defendant.name} ${formatDate(
                    subpoena.created,
                  )} - PDF`

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
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() => {
            if (!isSchedulingArraignmentDate) {
              router.push(
                `${constants.INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`,
              )
            } else {
              setNavigateTo(constants.INDICTMENTS_DEFENDER_ROUTE)
            }
          }}
          nextButtonText={
            !isSchedulingArraignmentDate
              ? undefined
              : formatMessage(strings.nextButtonText)
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
      {modalContent && (
        <Modal
          title={modalContent.title}
          text={modalContent.text}
          primaryButton={{
            text: modalContent.primaryButtonText,
            onClick: () => scheduleArraignmentDate(),
            isLoading: isCreatingSubpoena,
          }}
          secondaryButton={{
            text: formatMessage(strings.modalSecondaryButtonText),
            onClick: () => setNavigateTo(undefined),
          }}
        />
      )}
    </PageLayout>
  )
}

export default Subpoena
