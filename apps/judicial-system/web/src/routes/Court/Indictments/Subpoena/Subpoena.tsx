import { FC, useCallback, useContext, useState } from 'react'
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
  CourtSessionType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { SubpoenaType } from '@island.is/judicial-system-web/src/routes/Court/components'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import { isSubpoenaStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { subpoena as strings } from './Subpoena.strings'

const Subpoena: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [newSubpoenas, setNewSubpoenas] = useState<string[]>([])
  // Note: we keep the arraignment scheduled state in a subpoena specific state otherwise
  // re-renders (when updating case and defendants) will cause unexpected states within the subpoena component
  const [isArraignmentScheduled, _] = useState(
    Boolean(workingCase.arraignmentDate),
  )
  const [newAlternativeServices, setNewAlternativeServices] = useState<
    string[]
  >([])
  const [isCreatingSubpoena, setIsCreatingSubpoena] = useState<boolean>(false)

  const { updateDefendantState, updateDefendant } = useDefendants()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'arraignmentDate')

  const isSchedulingArraignmentDate =
    !isArraignmentScheduled ||
    newSubpoenas.length > 0 ||
    newAlternativeServices.length > 0

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

  const stepIsValid = isSubpoenaStepValid(workingCase, courtDate)

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
        {workingCase.defendants && (
          <Box component="section" marginBottom={5}>
            {
              <SubpoenaType
                subpoenaItems={workingCase.defendants.map((defendant) => ({
                  defendant,
                  alternativeServiceDescriptionDisabled:
                    !isRegisteringAlternativeServiceForDefendant(defendant),
                  subpoenaDisabled: !isIssuingSubpoenaForDefendant(defendant),
                  toggleNewAlternativeService: isArraignmentScheduled
                    ? toggleNewAlternativeService(defendant)
                    : undefined,
                  children: isArraignmentScheduled && (
                    <Button
                      variant="text"
                      icon="reload"
                      disabled={newSubpoenas.includes(defendant.id)}
                      onClick={() => {
                        setNewSubpoenas((previous) => [
                          ...previous,
                          defendant.id,
                        ])
                        // Clear any alternative service for the defendant
                        toggleNewAlternativeService(defendant)()
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
                  ),
                }))}
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                updateDefendantState={updateDefendantState}
                showAlternativeServiceOption
              />
            }
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.courtArrangementsHeading)}
          />
          <CourtArrangements
            handleCourtDateChange={handleCourtDateChange}
            handleCourtRoomChange={handleCourtRoomChange}
            courtDate={workingCase.arraignmentDate}
            dateTimeDisabled={!isSchedulingArraignmentDate}
            courtRoomDisabled={!isSchedulingArraignmentDate}
            courtRoomRequired
          />
        </Box>
        <Box component="section" marginBottom={10}>
          {workingCase.defendants?.map((defendant, dIndex) => (
            <>
              {isIssuingSubpoenaForDefendant(defendant) && (
                <Box
                  key={`subpoena-${defendant.id}`}
                  marginBottom={
                    dIndex + 1 === workingCase.defendants?.length &&
                    (!defendant.subpoenas || defendant.subpoenas.length === 0)
                      ? 0
                      : 2
                  }
                >
                  <PdfButton
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
                </Box>
              )}
              {defendant.subpoenas?.map((subpoena, sIndex) => {
                const fileName = `Fyrirkall - ${defendant.name} ${formatDate(
                  subpoena.created,
                )} - PDF`

                return (
                  <Box
                    key={`subpoena-${subpoena.id}`}
                    marginBottom={
                      dIndex + 1 === workingCase.defendants?.length &&
                      sIndex + 1 === defendant.subpoenas?.length
                        ? 0
                        : 2
                    }
                  >
                    <PdfButton
                      caseId={workingCase.id}
                      title={fileName}
                      pdfType="subpoena"
                      elementId={[defendant.id, subpoena.id, fileName]}
                    />
                  </Box>
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
