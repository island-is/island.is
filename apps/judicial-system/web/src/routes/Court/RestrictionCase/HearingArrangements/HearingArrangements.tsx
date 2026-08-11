import { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import {
  DISTRICT_COURT_RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE,
} from '@island.is/judicial-system/consts'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  ArraignmentAlert,
  CourtArrangements,
  CourtCaseInfo,
  DefenderInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseCustodyRestrictions,
  CaseType,
  TrackedNotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/utils'
import { isCourtHearingArrangemenstStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'

import { rcHearingArrangements as m } from './HearingArrangements.strings'

enum ModalButtonLoading {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export const HearingArrangements = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [modalButtonLoading, setModalButtonLoading] =
    useState<ModalButtonLoading>()

  const {
    setAndSendCaseToServer,
    sendNotification,
    isUpdatingCase,
    isSendingNotification,
    sendNotificationError,
  } = useCase()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    courtDateHasChanged,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'arraignmentDate')

  const initialize = useCallback(() => {
    if (!workingCase.arraignmentDate?.date && workingCase.requestedCourtDate) {
      setWorkingCase((theCase) => ({
        ...theCase,
        arraignmentDate: { date: theCase.requestedCourtDate },
      }))
    }

    setAndSendCaseToServer(
      [
        // validToDate, isolationToDate and isCustodyIsolation are autofilled here
        // so they are ready for conclusion autofill later
        {
          validToDate: workingCase.requestedValidToDate,
          isolationToDate:
            workingCase.type === CaseType.CUSTODY ||
            workingCase.type === CaseType.ADMISSION_TO_FACILITY
              ? workingCase.requestedValidToDate
              : undefined,
          isCustodyIsolation:
            workingCase.type === CaseType.CUSTODY ||
            workingCase.type === CaseType.ADMISSION_TO_FACILITY
              ? workingCase.requestedCustodyRestrictions &&
                workingCase.requestedCustodyRestrictions.includes(
                  CaseCustodyRestrictions.ISOLATION,
                )
                ? true
                : false
              : undefined,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [setAndSendCaseToServer, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const courtDateNotification = useMemo(
    () =>
      hasSentNotification(
        TrackedNotificationType.COURT_DATE,
        workingCase.notifications,
      ),
    [workingCase.notifications],
  )

  const isCorrectingRuling = Boolean(workingCase.requestCompletedDate)

  const handleNavigationTo = async (destination: keyof stepValidationsType) => {
    if (
      isCorrectingRuling ||
      (courtDateNotification.hasSent && !courtDateHasChanged)
    ) {
      await sendCourtDateToServer()
      router.push(`${destination}/${workingCase.id}`)
    } else {
      setNavigateTo(DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE)
    }
  }

  const stepIsValid = isCourtHearingArrangemenstStepValidRC(
    workingCase,
    courtDate,
  )

  const isModalConfirming = modalButtonLoading === ModalButtonLoading.PRIMARY
  const isModalDeferring = modalButtonLoading === ModalButtonLoading.SECONDARY
  const isModalLoading = isModalConfirming && isUpdatingCase
  const isModalDeferringLoading = isModalDeferring && isSendingNotification

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(titles.court.restrictionCases.hearingArrangements)}
      />
      <FormContentContainer>
        <ArraignmentAlert />
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.requestedCourtDate.title)}
            </Text>
          </Box>
          <Box marginBottom={3}>
            <CourtArrangements
              handleCourtDateChange={handleCourtDateChange}
              handleCourtRoomChange={handleCourtRoomChange}
              courtDate={workingCase.arraignmentDate}
              courtRoomDisabled={isCorrectingRuling}
              dateTimeDisabled={isCorrectingRuling}
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <DefenderInfo
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${DISTRICT_COURT_RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${workingCase.id}`}
          actions={[
            {
              text: 'Halda áfram',
              icon: 'arrowForward',
              onClick: () =>
                handleNavigationTo(
                  DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE,
                ),
              disabled: !stepIsValid,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title="Viltu staðfesta fyrirtökutíma?"
          loading={isModalConfirming}
          text={
            courtDateHasChanged
              ? 'Fyrirtökutíma hefur verið breytt. Tilkynning verður send á sækjanda, fangelsi og verjanda hafi verjandi verið skráður.'
              : 'Málið fer á dagskrá og tilkynning verður send á sækjanda, fangelsi og verjanda hafi verjandi verið skráður.'
          }
          buttons={[
            {
              text: 'Nei, staðfesta seinna',
              isDisabled: isModalConfirming,
              onClick: async () => {
                setModalButtonLoading(ModalButtonLoading.SECONDARY)

                // The arraignment date is not confirmed, so we only let a
                // registered advocate know that they are on the case. This is
                // their only notification, so we do not navigate away until it
                // has been sent.
                const notificationSent = await sendNotification(
                  workingCase.id,
                  TrackedNotificationType.ADVOCATE_ASSIGNED,
                )

                if (!notificationSent) {
                  setModalButtonLoading(undefined)
                  return
                }

                router.push(`${navigateTo}/${workingCase.id}`)
              },
              isLoading: isModalDeferringLoading,
              variant: 'ghost',
            },
            {
              text: 'Já, staðfesta',
              onClick: async () => {
                setModalButtonLoading(ModalButtonLoading.PRIMARY)

                // Saving the arraignment date triggers the court date notifications
                const courtDateSaved = await sendCourtDateToServer()

                if (!courtDateSaved) {
                  setModalButtonLoading(undefined)
                  return
                }

                router.push(`${navigateTo}/${workingCase.id}`)
              },
              isLoading: isModalLoading,
              isDisabled: isModalDeferring,
            },
          ]}
          errorMessage={
            isModalDeferring && sendNotificationError
              ? formatMessage(errors.sendNotification)
              : undefined
          }
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
