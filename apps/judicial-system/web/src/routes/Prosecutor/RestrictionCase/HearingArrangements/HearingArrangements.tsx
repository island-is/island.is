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
  rcRequestedHearingArrangements,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageLayout,
  ProsecutorCaseInfo,
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
import { isHearingArrangementsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'

import {
  ProsecutorSectionHeightenedSecurity,
  RequestCourtDate,
  SelectCourt,
} from '../../components'
import ArrestDate from './ArrestDate'

export const HearingArrangements: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const {
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    transitionCase,
    isTransitioningCase,
    updateCase,
    setAndSendCaseToServer,
  } = useCase()

  const { courts, loading: institutionLoading } = useInstitution()

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

  const stepIsValid =
    isHearingArrangementsStepValidRC(workingCase) || isTransitioningCase

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase || institutionLoading}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={stepIsValid ? handleNavigationTo : undefined}
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
              previousUrl={`${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${workingCase.id}`}
              onNextButtonClick={async () =>
                await handleNavigationTo(
                  constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
                )
              }
              nextIsDisabled={!stepIsValid || isTransitioningCase}
              nextIsLoading={isTransitioningCase}
            />
          </FormContentContainer>
          {navigateTo !== undefined && (
            <Modal
              title={formatMessage(
                rcRequestedHearingArrangements.modal.heading,
              )}
              text={formatMessage(rcRequestedHearingArrangements.modal.textV2, {
                caseType: workingCase.type,
              })}
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              onClose={() => setNavigateTo(undefined)}
              onSecondaryButtonClick={() =>
                router.push(`${navigateTo}/${workingCase.id}`)
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
                  router.push(`${navigateTo}/${workingCase.id}`)
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
