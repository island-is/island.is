import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import { Box, Input, Select } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { NotificationType } from '@island.is/judicial-system/types'
import { core, errors } from '@island.is/judicial-system-web/messages'
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
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ReactSelectOption,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import {
  removeTabsValidateAndSet,
  stepValidationsType,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { isCourtOfAppealCaseStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { appealCase as strings } from './AppealCase.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type AssistantSelectOption = ReactSelectOption & { assistant: User }

const AppealCase = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const {
    updateCase,
    setAndSendCaseToServer,
    sendNotification,
    sendNotificationError,
    isSendingNotification,
  } = useCase()

  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query

  const [appealCaseNumberErrorMessage, setAppealCaseNumberErrorMessage] =
    useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const { data: userData } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const assistants = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.ASSISTANT &&
        user.institution?.type === InstitutionType.COURT_OF_APPEALS,
    )
    .map((assistant: User) => {
      return { label: assistant.name, value: assistant.id, assistant }
    })

  const judges = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.type === InstitutionType.COURT_OF_APPEALS &&
        workingCase.appealJudge1?.id !== user.id &&
        workingCase.appealJudge2?.id !== user.id &&
        workingCase.appealJudge3?.id !== user.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id, judge }
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
      )
    ) {
      router.push(`${destination}/${id}`)
    } else {
      await sendNotifications()
      setModalVisible(true)
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
            <Input
              name="appealCaseNumber"
              label={formatMessage(strings.caseNumberLabel)}
              value={workingCase.appealCaseNumber ?? ''}
              placeholder={formatMessage(strings.caseNumberPlaceholder, {
                year: new Date().getFullYear(),
              })}
              errorMessage={appealCaseNumberErrorMessage}
              onChange={(event) => {
                removeTabsValidateAndSet(
                  'appealCaseNumber',
                  event.target.value,
                  ['empty', 'appeal-case-number-format'],
                  workingCase,
                  setWorkingCase,
                  appealCaseNumberErrorMessage,
                  setAppealCaseNumberErrorMessage,
                )
              }}
              onBlur={(event) => {
                validateAndSendToServer(
                  'appealCaseNumber',
                  event.target.value,
                  ['empty', 'appeal-case-number-format'],
                  workingCase,
                  updateCase,
                  setAppealCaseNumberErrorMessage,
                )
              }}
              required
            />
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
              onChange={(so) => {
                const assistantUpdate = (so as AssistantSelectOption).assistant

                setAndSendCaseToServer(
                  [
                    {
                      appealAssistantId: assistantUpdate.id ?? null,
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <SectionHeading title={formatMessage(core.appealJudgesHeading)} />
            <BlueBox>
              {defaultJudges.map((judge, index) => {
                return (
                  <Box marginBottom={2} key={`judgeBox${index + 1}`}>
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
                          ? { label: judge.name, value: judge.id }
                          : undefined
                      }
                      options={judges}
                      onChange={(so) => {
                        const judgeUpdate = (so as JudgeSelectOption).judge
                        const judgeProperty = `appealJudge${index + 1}Id`

                        setAndSendCaseToServer(
                          [
                            {
                              [judgeProperty]: judgeUpdate.id ?? null,
                              force: true,
                            },
                          ],
                          workingCase,
                          setWorkingCase,
                        )
                      }}
                      required
                    />
                  </Box>
                )
              })}
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
              sendNotificationError || isSendingNotification
                ? strings.notificationsFailedModalHeading
                : strings.modalHeading,
            )}
            text={formatMessage(
              sendNotificationError || isSendingNotification
                ? strings.notificationsFailedModalMessage
                : strings.modalMessage,
            )}
            primaryButtonText={formatMessage(strings.modalPrimaryButton)}
            onPrimaryButtonClick={() => router.push(`${navigateTo}/${id}`)}
            onClose={() => setModalVisible(false)}
            onSecondaryButtonClick={() => {
              sendNotifications()
            }}
            secondaryButtonText={
              sendNotificationError || isSendingNotification
                ? formatMessage(strings.notificationFailedModalSecondaryButton)
                : undefined
            }
            isSecondaryButtonLoading={isSendingNotification}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default AppealCase
