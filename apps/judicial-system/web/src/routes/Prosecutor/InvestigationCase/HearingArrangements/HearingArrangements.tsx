import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  ProsecutorCaseInfo,
  FormContentContainer,
  FormFooter,
  Modal,
  PageLayout,
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  CaseState,
  CaseTransition,
  Institution,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  errors,
  icRequestedHearingArrangements as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { isHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as constants from '@island.is/judicial-system/consts'

import {
  RequestCourtDate,
  SelectCourt,
  ProsecutorSectionHeightenedSecurity,
} from '../../components'

const HearingArrangements = () => {
  const router = useRouter()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { courts } = useInstitution()
  const { formatMessage } = useIntl()
  const {
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    transitionCase,
    isTransitioningCase,
    updateCase,
    setAndSendCaseToServer,
  } = useCase()

  const [
    isNotificationModalVisible,
    setIsNotificationModalVisible,
  ] = useState<boolean>(false)

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const caseOpened =
      workingCase.state === CaseState.NEW
        ? await transitionCase(workingCase, CaseTransition.OPEN, setWorkingCase)
        : true

    if (caseOpened) {
      if (
        (workingCase.state !== CaseState.NEW &&
          workingCase.state !== CaseState.DRAFT) ||
        // TODO: Ignore failed notifications
        workingCase.notifications?.find(
          (notification) => notification.type === NotificationType.HEADS_UP,
        )
      ) {
        router.push(
          `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
        )
      } else {
        setIsNotificationModalVisible(true)
      }
    } else {
      // TODO: Handle error
    }
  }

  const handleCourtChange = (court: Institution) => {
    if (workingCase) {
      setAndSendCaseToServer(
        [
          {
            courtId: court.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      return true
    }

    return false
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.STEP_TWO}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
    >
      <PageHeader
        title={formatMessage(
          titles.prosecutor.investigationCases.hearingArrangements,
        )}
      />
      {user && courts && (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                {formatMessage(m.heading)}
              </Text>
            </Box>
            <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
            <ProsecutorSectionHeightenedSecurity />
            <Box component="section" marginBottom={5}>
              <SelectCourt
                workingCase={workingCase}
                courts={courts}
                onChange={handleCourtChange}
              />
            </Box>
            <Box component="section" marginBottom={5}>
              <RequestCourtDate
                workingCase={workingCase}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    setAndSendCaseToServer(
                      [
                        {
                          requestedCourtDate: formatDateForServer(date),
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                }}
              />
            </Box>
            <Box component="section" marginBottom={10}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  {formatMessage(m.sections.translator.heading)}
                </Text>
              </Box>
              <Input
                data-testid="translator"
                name="translator"
                autoComplete="off"
                label={formatMessage(m.sections.translator.label)}
                placeholder={formatMessage(m.sections.translator.placeholder)}
                value={workingCase.translator || ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'translator',
                    event.target.value,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'translator',
                    event.target.value.trim(),
                    [],
                    workingCase,
                    updateCase,
                  )
                }
              />
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${workingCase.id}`}
              onNextButtonClick={async () => await handleNextButtonClick()}
              nextIsDisabled={!isHearingArrangementsStepValidIC(workingCase)}
              nextIsLoading={isLoadingWorkingCase || isTransitioningCase}
            />
          </FormContentContainer>
          {isNotificationModalVisible && (
            <Modal
              title={formatMessage(m.modal.heading)}
              text={formatMessage(m.modal.text)}
              primaryButtonText={formatMessage(m.modal.primaryButtonText)}
              secondaryButtonText={formatMessage(m.modal.secondaryButtonText)}
              onClose={() => setIsNotificationModalVisible(false)}
              onSecondaryButtonClick={() =>
                router.push(
                  `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                )
              }
              onPrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.HEADS_UP,
                )

                if (notificationSent) {
                  router.push(
                    `${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
              errorMessage={
                sendNotificationError
                  ? formatMessage(errors.sendNotification)
                  : undefined
              }
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HearingArrangements
