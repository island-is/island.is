import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, Select } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  hasSentNotification,
  isReopenedCOACase,
} from '@island.is/judicial-system-web/src/utils/utils'
import { isCourtOfAppealCaseStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { CaseNumberInput } from '../components'
import { useAppealCaseUsersQuery } from './appealCaseUsers.generated'
import { appealCase as strings } from './AppealCase.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type AssistantSelectOption = ReactSelectOption & { assistant: User }

const AppealCase: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const {
    updateCase,
    sendNotification,
    sendNotificationError,
    isSendingNotification,
  } = useCase()

  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const { data: usersData } = useAppealCaseUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const assistants = (usersData?.users ?? [])
    .filter((user: User) => user.role === UserRole.COURT_OF_APPEALS_ASSISTANT)
    .map((assistant: User) => {
      return { label: assistant.name ?? '', value: assistant.id, assistant }
    })

  const judges = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.COURT_OF_APPEALS_JUDGE &&
        workingCase.appealJudge1?.id !== user.id &&
        workingCase.appealJudge2?.id !== user.id &&
        workingCase.appealJudge3?.id !== user.id,
    )
    .map((judge: User) => {
      return { label: judge.name ?? '', value: judge.id, judge }
    })

  const defaultJudges = [
    workingCase.appealJudge1,
    workingCase.appealJudge2,
    workingCase.appealJudge3,
  ]

  const defaultAssistant = assistants?.find(
    (assistant: AssistantSelectOption) =>
      assistant.value === workingCase.appealAssistant?.id,
  )

  const sendNotifications = () => {
    return sendNotification(
      workingCase.id,
      NotificationType.APPEAL_JUDGES_ASSIGNED,
    )
  }

  const previousUrl = `${constants.COURT_OF_APPEAL_OVERVIEW_ROUTE}/${id}`
  const handleNavigationTo = async (destination: keyof stepValidationsType) => {
    setNavigateTo(destination)

    if (
      hasSentNotification(
        NotificationType.APPEAL_JUDGES_ASSIGNED,
        workingCase.notifications,
      ).hasSent ||
      isReopenedCOACase(workingCase.appealState, workingCase.notifications)
    ) {
      router.push(`${destination}/${id}`)
    } else {
      await sendNotifications()
      setModalVisible(true)
    }
  }

  const handleChange = async (coaJudgeId: string, coaJudgeProperty: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        [coaJudgeProperty]: coaJudgeId,
      })

      if (!updatedCase) {
        return
      }

      const coaJudge =
        coaJudgeProperty === 'appealJudge1Id'
          ? { appealJudge1: updatedCase?.appealJudge1 }
          : coaJudgeProperty === 'appealJudge2Id'
          ? { appealJudge2: updatedCase?.appealJudge2 }
          : { appealJudge3: updatedCase?.appealJudge3 }

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        ...coaJudge,
      }))
    }
  }

  const handleAssistantChange = async (appealAssistantId: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        appealAssistantId,
      })

      if (!updatedCase) {
        return
      }

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        appealAssistant: updatedCase?.appealAssistant,
      }))
    }
  }

  return (
    <>
      <PageLayout
        workingCase={workingCase}
        isLoading={false}
        notFound={false}
        onNavigationTo={handleNavigationTo}
      >
        <PageHeader title={formatMessage(strings.title)} />
        <FormContentContainer>
          <PageTitle>{formatMessage(strings.title)}</PageTitle>
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(core.appealCaseNumberHeading)}
            />
            <CaseNumberInput />
          </Box>

          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(core.appealAssistantHeading)}
            />
            <Select
              name="assistant"
              label={formatMessage(strings.assistantLabel)}
              placeholder={formatMessage(strings.assistantPlaceholder)}
              value={defaultAssistant}
              options={assistants}
              onChange={(selectedOption) => {
                handleAssistantChange(
                  (selectedOption as AssistantSelectOption).assistant.id,
                )
              }}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <SectionHeading title={formatMessage(core.appealJudgesHeading)} />
            <BlueBox>
              {defaultJudges.map((judge, index) => (
                <Box marginBottom={2} key={`${index}`}>
                  <Select
                    name="judge"
                    label={formatMessage(
                      index === 0
                        ? strings.judgeForepersonLabel
                        : strings.judgeLabel,
                    )}
                    placeholder={formatMessage(
                      index === 0
                        ? strings.judgeForepersonPlaceholder
                        : strings.judgePlaceholder,
                    )}
                    value={
                      judge?.id
                        ? { label: judge.name ?? '', value: judge.id }
                        : undefined
                    }
                    options={judges}
                    onChange={(selectedOption) => {
                      const judgeUpdate = (selectedOption as JudgeSelectOption)
                        .judge.id
                      const judgeProperty = `appealJudge${index + 1}Id`

                      handleChange(judgeUpdate, judgeProperty)
                    }}
                    required
                  />
                </Box>
              ))}
            </BlueBox>
          </Box>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={previousUrl}
            nextButtonIcon="arrowForward"
            onNextButtonClick={() => {
              handleNavigationTo(constants.COURT_OF_APPEAL_RULING_ROUTE)
            }}
            nextButtonText={formatMessage(strings.nextButtonText)}
            nextIsDisabled={!isCourtOfAppealCaseStepValid(workingCase)}
          />
        </FormContentContainer>
      </PageLayout>
      <AnimatePresence>
        {modalVisible && (
          <Modal
            title={formatMessage(
              sendNotificationError
                ? strings.notificationsFailedModalHeading
                : strings.modalHeading,
            )}
            text={formatMessage(
              sendNotificationError
                ? strings.notificationsFailedModalMessage
                : strings.modalMessage,
            )}
            primaryButton={{
              text: formatMessage(strings.modalPrimaryButton),
              onClick: () => router.push(`${navigateTo}/${id}`),
            }}
            secondaryButton={
              sendNotificationError
                ? {
                    text: formatMessage(
                      strings.notificationFailedModalSecondaryButton,
                    ),
                    onClick: () => {
                      sendNotifications()
                    },
                    isLoading: isSendingNotification,
                  }
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default AppealCase
