import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CaseState,
  CaseTransition,
  Institution,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  ProsecutorCaseInfo,
  FormContentContainer,
  FormFooter,
  Modal,
  PageLayout,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { Box, Input, Text } from '@island.is/island-ui/core'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  errors,
  rcRequestedHearingArrangements,
  titles,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { isHearingArrangementsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as constants from '@island.is/judicial-system/consts'

import ArrestDate from './ArrestDate'
import {
  RequestCourtDate,
  SelectCourt,
  ProsecutorSectionHeightenedSecurity,
} from '../../components'

export const HearingArrangements: React.FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const {
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    transitionCase,
    isTransitioningCase,
    updateCase,
    setAndSendToServer,
  } = useCase()

  const { courts, loading: institutionLoading } = useInstitution()

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
          `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
        )
      } else {
        setModalVisible(true)
      }
    } else {
      // TODO: Handle error
    }
  }

  const handleCourtChange = (court: Institution) => {
    if (workingCase) {
      setAndSendToServer(
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
      isLoading={isLoadingWorkingCase || institutionLoading}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(
          titles.prosecutor.restrictionCases.hearingArrangements,
        )}
      />
      {!institutionLoading ? (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                {formatMessage(rcRequestedHearingArrangements.heading)}
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
            {!workingCase.parentCase && (
              <ArrestDate
                title={formatMessage(
                  rcRequestedHearingArrangements.sections.arrestDate.heading,
                )}
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
              />
            )}
            <Box component="section" marginBottom={5}>
              <RequestCourtDate
                workingCase={workingCase}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    setAndSendToServer(
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
                  {formatMessage(
                    rcRequestedHearingArrangements.sections.translator.heading,
                  )}
                </Text>
              </Box>
              <Input
                data-testid="translator"
                name="translator"
                autoComplete="off"
                label={formatMessage(
                  rcRequestedHearingArrangements.sections.translator.label,
                )}
                placeholder={formatMessage(
                  rcRequestedHearingArrangements.sections.translator
                    .placeholder,
                )}
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
                    event.target.value,
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
              previousUrl={`${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${workingCase.id}`}
              onNextButtonClick={async () => await handleNextButtonClick()}
              nextIsDisabled={
                !isHearingArrangementsStepValidRC(workingCase) ||
                isTransitioningCase
              }
              nextIsLoading={isTransitioningCase}
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title={formatMessage(
                rcRequestedHearingArrangements.modal.heading,
              )}
              text={formatMessage(rcRequestedHearingArrangements.modal.textV2, {
                caseType: workingCase.type,
              })}
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              onClose={() => setModalVisible(false)}
              onSecondaryButtonClick={() =>
                router.push(
                  `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                )
              }
              errorMessage={
                sendNotificationError
                  ? formatMessage(errors.sendNotification)
                  : undefined
              }
              onPrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.HEADS_UP,
                )

                if (notificationSent) {
                  router.push(
                    `${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default HearingArrangements
