import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input, Text, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  errors,
  icRequestedHearingArrangements as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageLayout,
  ProsecutorCaseInfo,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { Institution } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  stepValidationsType,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { isHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

import {
  ProsecutorSectionHeightenedSecurity,
  RequestCourtDate,
  SelectCourt,
} from '../../components'

const HearingArrangements = () => {
  const router = useRouter()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
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

  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (!workingCase) {
        return
      }

      const caseOpened =
        workingCase.state === CaseState.NEW
          ? await transitionCase(
              workingCase.id,
              CaseTransition.OPEN,
              setWorkingCase,
            )
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
          router.push(`${destination}/${workingCase.id}`)
        } else {
          setNavigateTo(destination)
        }
      } else {
        toast.error(formatMessage(errors.transitionCase))
      }
    },
    [formatMessage, router, setWorkingCase, transitionCase, workingCase],
  )

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

  const stepIsValid = isHearingArrangementsStepValidIC(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={!!workingCase.parentCase}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
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
              nextButtonIcon="arrowForward"
              previousUrl={`${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${workingCase.id}`}
              onNextButtonClick={async () =>
                await handleNavigationTo(
                  constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
                )
              }
              nextIsDisabled={!stepIsValid}
              nextIsLoading={isLoadingWorkingCase || isTransitioningCase}
            />
          </FormContentContainer>
          {navigateTo !== undefined && (
            <Modal
              title={formatMessage(m.modal.heading)}
              text={formatMessage(m.modal.text)}
              primaryButtonText={formatMessage(m.modal.primaryButtonText)}
              secondaryButtonText={formatMessage(m.modal.secondaryButtonText)}
              onClose={() => setNavigateTo(undefined)}
              onSecondaryButtonClick={() =>
                router.push(`${navigateTo}/${workingCase.id}`)
              }
              onPrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.HEADS_UP,
                )

                if (notificationSent) {
                  router.push(`${navigateTo}/${workingCase.id}`)
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
