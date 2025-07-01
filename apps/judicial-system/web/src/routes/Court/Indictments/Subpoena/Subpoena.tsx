import { FC, useCallback, useContext, useEffect, useState } from 'react'
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
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CourtSessionType,
  Defendant,
  UpdateCaseInput,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { SubpoenaType } from '@island.is/judicial-system-web/src/routes/Court/components'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import { isSubpoenaStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { subpoena as strings } from './Subpoena.strings'
import { pdfButtonGrid } from './Subpoena.css'

const Subpoena: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [updates, setUpdates] = useState<{
    defendants?: Defendant[] | null
    theCase: Case
  }>()
  const [newSubpoenas, setNewSubpoenas] = useState<string[]>([])
  // Note: we keep the arraignment scheduled state in a subpoena specific state otherwise
  // re-renders (when updating case and defendants) will cause unexpected states within the subpoena component
  const [isArraignmentScheduled, setIsArraignmentScheduled] =
    useState<boolean>()
  const [newAlternativeServices, setNewAlternativeServices] = useState<
    string[]
  >([])
  const [isCreatingSubpoena, setIsCreatingSubpoena] = useState<boolean>(false)
  const [isSchedulingArraignmentDate, setIsSchedulingArraignmentDate] =
    useState<boolean>()

  const { updateDefendantState, updateDefendant } = useDefendants()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'arraignmentDate')

  const isIssuingSubpoenaForDefendant = (defendant: Defendant) =>
    !defendant.isAlternativeService &&
    (!isArraignmentScheduled || newSubpoenas.includes(defendant.id))

  const isIssuingSubpoenas = workingCase.defendants?.some((defendant) =>
    isIssuingSubpoenaForDefendant(defendant),
  )

  const isRegisteringAlternativeServiceForDefendant = (defendant: Defendant) =>
    defendant.isAlternativeService &&
    (!isArraignmentScheduled || newAlternativeServices.includes(defendant.id))

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

    const promises: Promise<boolean>[] = []

    if (workingCase.defendants) {
      workingCase.defendants.forEach((defendant) => {
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
    }

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

    const courtDateUpdated = await sendCourtDateToServer(additionalUpdates)

    if (!courtDateUpdated) {
      setIsCreatingSubpoena(false)

      return
    }

    router.push(`${navigateTo}/${workingCase.id}`)
  }, [
    isArraignmentScheduled,
    navigateTo,
    sendCourtDateToServer,
    updateDefendant,
    workingCase.defendants,
    workingCase.id,
    workingCase.indictmentDecision,
  ])

  const handleDefendantUpdates = (update: UpdateDefendantInput) => {
    setUpdates((prev) => {
      if (!prev) {
        return updates
      }

      return {
        defendants: prev.defendants?.map((item) =>
          item.id === update.defendantId ? { ...item, ...update } : item,
        ),
        theCase: prev.theCase,
      }
    })
  }

  const handleCourtArrangementUpdates = (update?: string) => {
    setUpdates((prev) => {
      if (!prev) {
        return updates
      }

      return {
        defendants: prev.defendants,
        theCase: {
          ...prev.theCase,
          arraignmentDate: {
            date: prev.theCase.arraignmentDate?.date,
            location: update,
          },
        },
      }
    })
  }

  useEffect(() => {
    setUpdates({ defendants: workingCase.defendants, theCase: workingCase })
  }, [workingCase])

  useEffect(() => {
    setIsArraignmentScheduled(Boolean(workingCase.arraignmentDate))
  }, [workingCase.arraignmentDate])

  useEffect(() => {
    setIsSchedulingArraignmentDate(
      Boolean(
        !isArraignmentScheduled ||
          newSubpoenas.length > 0 ||
          newAlternativeServices.length > 0,
      ),
    )
  }, [
    isArraignmentScheduled,
    newAlternativeServices.length,
    newSubpoenas.length,
  ])

  const stepIsValid = isSubpoenaStepValid(workingCase, courtDate)

  console.log(updates)

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
          <Box component="section" marginBottom={5}>
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
                children: isArraignmentScheduled ? (
                  <Button
                    variant="text"
                    icon="reload"
                    disabled={newSubpoenas.includes(defendant.id)}
                    onClick={() => {
                      setNewSubpoenas((previous) => [...previous, defendant.id])
                      // Clear any alternative service for the defendant
                      toggleNewAlternativeService(defendant)()
                      setIsArraignmentScheduled(false)
                      updateDefendantState(
                        {
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          isAlternativeService: false,
                        },
                        setWorkingCase,
                      )
                    }}
                  >
                    {formatMessage(strings.newSubpoenaButtonText)}
                  </Button>
                ) : (
                  <Button
                    variant="text"
                    colorScheme="destructive"
                    icon="trash"
                    iconType="outline"
                    onClick={() => {
                      setNewSubpoenas((previous) =>
                        previous.filter((v) => v !== defendant.id),
                      )

                      setUpdates({
                        defendants: workingCase.defendants,
                        theCase: workingCase,
                      })

                      setIsArraignmentScheduled(true)
                    }}
                  >
                    Hætta við
                  </Button>
                ),
              }))}
              workingCase={workingCase}
            />
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.courtArrangementsHeading)}
          />
          <CourtArrangements
            handleCourtDateChange={handleCourtDateChange}
            handleCourtRoomChange={handleCourtArrangementUpdates}
            courtDate={updates?.theCase.arraignmentDate}
            dateTimeDisabled={!isSchedulingArraignmentDate}
            courtRoomDisabled={!isSchedulingArraignmentDate}
            courtRoomRequired
          />
        </Box>
        <Box component="section" className={pdfButtonGrid} marginBottom={10}>
          {workingCase.defendants?.map((defendant) => (
            <>
              {isIssuingSubpoenaForDefendant(defendant) && (
                <PdfButton
                  key={`subpoena-${defendant.id}`}
                  caseId={workingCase.id}
                  title={`Fyrirkall - ${defendant.name} nýtt - PDF`}
                  pdfType="subpoena"
                  disabled={
                    !courtDate?.date ||
                    !courtDate?.location ||
                    !defendant.subpoenaType
                  }
                  elementId={[
                    defendant.id,
                    `Fyrirkall - ${defendant.name} nýtt - PDF`,
                  ]}
                  queryParameters={`arraignmentDate=${courtDate?.date}&location=${courtDate?.location}&subpoenaType=${defendant.subpoenaType}`}
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
            </>
          ))}
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
      {navigateTo !== undefined && (
        <Modal
          title={
            isIssuingSubpoenas
              ? formatMessage(strings.modalTitle)
              : strings.modalAlternativeServiceTitle
          }
          text={
            isIssuingSubpoenas
              ? formatMessage(strings.modalText)
              : strings.modalAlternativeServiceText
          }
          onPrimaryButtonClick={() => {
            scheduleArraignmentDate()
          }}
          onSecondaryButtonClick={() => {
            setNavigateTo(undefined)
          }}
          primaryButtonText={
            isIssuingSubpoenas
              ? formatMessage(strings.modalPrimaryButtonText)
              : strings.modalAlternativeServicePrimaryButtonText
          }
          secondaryButtonText={formatMessage(strings.modalSecondaryButtonText)}
          isPrimaryButtonLoading={isCreatingSubpoena}
        />
      )}
    </PageLayout>
  )
}

export default Subpoena
