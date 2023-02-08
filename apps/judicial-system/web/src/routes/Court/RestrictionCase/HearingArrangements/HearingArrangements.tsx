import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'
import compareAsc from 'date-fns/compareAsc'
import parseISO from 'date-fns/parseISO'

import { Box, Text, AlertMessage } from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  CourtCaseInfo,
  FormContentContainer,
  Modal,
  useCourtArrangements,
  CourtArrangements,
  DefenderInfo,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { isCourtHearingArrangemenstStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  CaseCustodyRestrictions,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  RestrictionCaseCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import * as constants from '@island.is/judicial-system/consts'

import { rcHearingArrangements as m } from './HearingArrangements.strings'

export const HearingArrangements: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const {
    setAndSendCaseToServer,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    setCourtDate,
    courtDateHasChanged,
    handleCourtDateChange,
  } = useCourtArrangements(workingCase)

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      if (!workingCase.courtDate) {
        setCourtDate(workingCase.requestedCourtDate)

        setInitialAutoFillDone(true)
      }

      setAndSendCaseToServer(
        [
          // validToDate, isolationToDate and isCustodyIsolation are autofilled here
          // so they are ready for conclusion autofill later
          {
            validToDate: workingCase.requestedValidToDate,
            isolationToDate:
              workingCase.type === CaseType.Custody ||
              workingCase.type === CaseType.AdmissionToFacility
                ? workingCase.requestedValidToDate
                : undefined,
            isCustodyIsolation:
              workingCase.type === CaseType.Custody ||
              workingCase.type === CaseType.AdmissionToFacility
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
    }
  }, [
    setAndSendCaseToServer,
    initialAutoFillDone,
    isCaseUpToDate,
    setCourtDate,
    setWorkingCase,
    workingCase,
  ])

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      const courtDateNotifications = workingCase.notifications?.filter(
        (notification) => notification.type === NotificationType.COURT_DATE,
      )

      const latestCourtDateNotification = courtDateNotifications?.sort((a, b) =>
        compareAsc(parseISO(b.created), parseISO(a.created)),
      )[0]

      const hasSentNotification = latestCourtDateNotification?.recipients.some(
        (recipient) => recipient.success,
      )

      await setAndSendCaseToServer(
        [
          {
            courtDate: courtDate
              ? formatDateForServer(new Date(courtDate))
              : undefined,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      if (hasSentNotification && !courtDateHasChanged) {
        router.push(`${destination}/${workingCase.id}`)
      } else {
        setNavigateTo(constants.RESTRICTION_CASE_RULING_ROUTE)
      }
    },
    [
      workingCase,
      setAndSendCaseToServer,
      courtDate,
      setWorkingCase,
      courtDateHasChanged,
    ],
  )

  const stepIsValid = isCourtHearingArrangemenstStepValidRC(
    workingCase,
    courtDate,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={RestrictionCaseCourtSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(titles.court.restrictionCases.hearingArrangements)}
      />
      <FormContentContainer>
        {workingCase.comments && (
          <Box marginBottom={5}>
            <AlertMessage
              type="warning"
              title={formatMessage(m.comments.title)}
              message={workingCase.comments}
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.requestedCourtDate.title)}
            </Text>
          </Box>
          <Box marginBottom={3}>
            <CourtArrangements
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              handleCourtDateChange={handleCourtDateChange}
              selectedCourtDate={courtDate}
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
          previousUrl={`${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.RESTRICTION_CASE_RULING_ROUTE)
          }
          nextButtonText={formatMessage(m.continueButton.label)}
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title={formatMessage(
            workingCase.type === CaseType.Custody ||
              workingCase.type === CaseType.AdmissionToFacility
              ? m.modal.custodyCases.heading
              : m.modal.travelBanCases.heading,
          )}
          text={formatMessage(
            workingCase.type === CaseType.Custody ||
              workingCase.type === CaseType.AdmissionToFacility
              ? m.modal.custodyCases.text
              : m.modal.travelBanCases.text,
            {
              courtDateHasChanged,
            },
          )}
          isPrimaryButtonLoading={isSendingNotification}
          onSecondaryButtonClick={() => {
            sendNotification(workingCase.id, NotificationType.COURT_DATE, true)

            router.push(`${navigateTo}/${workingCase.id}`)
          }}
          onPrimaryButtonClick={async () => {
            const notificationSent = await sendNotification(
              workingCase.id,
              NotificationType.COURT_DATE,
            )

            if (notificationSent) {
              router.push(`${navigateTo}/${workingCase.id}`)
            }
          }}
          primaryButtonText={formatMessage(m.modal.shared.primaryButtonText)}
          secondaryButtonText={formatMessage(
            m.modal.shared.secondaryButtonText,
            {
              courtDateHasChanged,
            },
          )}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
