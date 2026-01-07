import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
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
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  useCase,
  useDebouncedInput,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/utils'
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
  const translatorInput = useDebouncedInput('translator')
  const { formatMessage } = useIntl()
  const {
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    transitionCase,
    isTransitioningCase,
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
          hasSentNotification(
            NotificationType.HEADS_UP,
            workingCase.notifications,
          ).hasSent
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
      <FormContentContainer>
        <PageTitle>{formatMessage(m.heading)}</PageTitle>
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
          <ProsecutorSectionHeightenedSecurity />
          <Box component="section">
            <SelectCourt />
          </Box>
          <Box component="section">
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
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.translator.heading)}
            />
            <Input
              data-testid="translator"
              name="translator"
              autoComplete="off"
              label={formatMessage(m.sections.translator.label)}
              placeholder={formatMessage(m.sections.translator.placeholder)}
              value={translatorInput.value}
              onChange={(evt) => translatorInput.onChange(evt.target.value)}
              onBlur={(evt) => translatorInput.onBlur(evt.target.value)}
            />
          </Box>
        </div>
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
          primaryButton={{
            text: formatMessage(m.modal.primaryButtonText),
            onClick: async () => {
              const notificationSent = await sendNotification(
                workingCase.id,
                NotificationType.HEADS_UP,
              )

              if (notificationSent) {
                router.push(`${navigateTo}/${workingCase.id}`)
              }
            },
            isLoading: isSendingNotification,
          }}
          secondaryButton={{
            text: formatMessage(m.modal.secondaryButtonText),
            onClick: () => router.push(`${navigateTo}/${workingCase.id}`),
          }}
          onClose={() => setNavigateTo(undefined)}
          errorMessage={
            sendNotificationError
              ? formatMessage(errors.sendNotification)
              : undefined
          }
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
