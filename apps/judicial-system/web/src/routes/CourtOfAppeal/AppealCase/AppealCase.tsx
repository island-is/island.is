import { FC, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, Select } from '@island.is/island-ui/core'
import {
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_RULING_ROUTE,
} from '@island.is/judicial-system/consts'
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
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useAppealCase,
  useTargetAppealCaseByAppealCaseId,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  appendAppealCaseIdQuery,
  applyAppealCaseUpdate,
} from '@island.is/judicial-system-web/src/utils/utils'
import { isCourtOfAppealCaseStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { CaseNumberInput } from '../components'
import { useAppealCaseUsersQuery } from './appealCaseUsers.generated'
import { appealCase as strings } from './AppealCase.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type AssistantSelectOption = ReactSelectOption & { assistant: User }

// The roles a Court of Appeals case can assign, in display order.
type AssignedUsers = {
  appealAssistant?: User | null
  appealJudge1?: User | null
  appealJudge2?: User | null
  appealJudge3?: User | null
}

const AppealCase: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()
  const { updateAppealCase, isUpdatingAppealCase } = useAppealCase()

  const { formatMessage } = useIntl()
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  // Role selections are collected locally and only persisted to the server when
  // the continue button is pressed.
  const [assignedUsers, setAssignedUsers] = useState<AssignedUsers>(() => ({
    appealAssistant: targetAppealCase?.appealAssistant,
    appealJudge1: targetAppealCase?.appealJudge1,
    appealJudge2: targetAppealCase?.appealJudge2,
    appealJudge3: targetAppealCase?.appealJudge3,
  }))

  useEffect(() => {
    setAssignedUsers({
      appealAssistant: targetAppealCase?.appealAssistant,
      appealJudge1: targetAppealCase?.appealJudge1,
      appealJudge2: targetAppealCase?.appealJudge2,
      appealJudge3: targetAppealCase?.appealJudge3,
    })
  }, [
    targetAppealCase?.appealAssistant,
    targetAppealCase?.appealJudge1,
    targetAppealCase?.appealJudge2,
    targetAppealCase?.appealJudge3,
  ])

  const { data: usersData } = useAppealCaseUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const assistants = (usersData?.users ?? [])
    .filter((user: User) => user.role === UserRole.COURT_OF_APPEALS_ASSISTANT)
    .map((assistant: User) => {
      return { label: assistant.name ?? '', value: assistant.id, assistant }
    })

  const selectedJudgeIds = [
    assignedUsers.appealJudge1?.id,
    assignedUsers.appealJudge2?.id,
    assignedUsers.appealJudge3?.id,
  ]

  const judges = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.COURT_OF_APPEALS_JUDGE &&
        !selectedJudgeIds.includes(user.id),
    )
    .map((judge: User) => {
      return { label: judge.name ?? '', value: judge.id, judge }
    })

  const judgeSlots: {
    field: keyof AssignedUsers
    judge: User | undefined | null
  }[] = [
    { field: 'appealJudge1', judge: assignedUsers.appealJudge1 },
    { field: 'appealJudge2', judge: assignedUsers.appealJudge2 },
    { field: 'appealJudge3', judge: assignedUsers.appealJudge3 },
  ]

  // Validate against the locally selected users (not yet persisted).
  const previewAppealCase = targetAppealCase
    ? { ...targetAppealCase, ...assignedUsers }
    : targetAppealCase

  const isAnyRoleUnfilled =
    !assignedUsers.appealAssistant?.id ||
    !assignedUsers.appealJudge1?.id ||
    !assignedUsers.appealJudge2?.id ||
    !assignedUsers.appealJudge3?.id

  const hasUnsavedRoleChanges =
    assignedUsers.appealAssistant?.id !==
      targetAppealCase?.appealAssistant?.id ||
    assignedUsers.appealJudge1?.id !== targetAppealCase?.appealJudge1?.id ||
    assignedUsers.appealJudge2?.id !== targetAppealCase?.appealJudge2?.id ||
    assignedUsers.appealJudge3?.id !== targetAppealCase?.appealJudge3?.id

  // Prompt the user to confirm the allocation while a role is still unfilled or
  // an allocation differs from what is saved; otherwise it is already confirmed.
  const nextButtonText =
    isAnyRoleUnfilled || hasUnsavedRoleChanges
      ? 'Staðfesta úthlutun'
      : 'Halda áfram'

  const handleChangedAssignee = (
    field: keyof AssignedUsers,
    assignee: User,
  ) => {
    setAssignedUsers((prev) => ({ ...prev, [field]: assignee }))
  }

  const previousUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${workingCase.id}`,
    targetAppealCase?.id,
  )

  const handleNavigationTo = async (destination: keyof stepValidationsType) => {
    setNavigateTo(destination)

    if (!targetAppealCase?.id) {
      return
    }

    // Collect any role changes since the last save.
    const update: {
      appealAssistantId?: string
      appealJudge1Id?: string
      appealJudge2Id?: string
      appealJudge3Id?: string
    } = {}

    if (
      assignedUsers.appealAssistant?.id !== targetAppealCase.appealAssistant?.id
    ) {
      update.appealAssistantId = assignedUsers.appealAssistant?.id
    }
    if (assignedUsers.appealJudge1?.id !== targetAppealCase.appealJudge1?.id) {
      update.appealJudge1Id = assignedUsers.appealJudge1?.id
    }
    if (assignedUsers.appealJudge2?.id !== targetAppealCase.appealJudge2?.id) {
      update.appealJudge2Id = assignedUsers.appealJudge2?.id
    }
    if (assignedUsers.appealJudge3?.id !== targetAppealCase.appealJudge3?.id) {
      update.appealJudge3Id = assignedUsers.appealJudge3?.id
    }

    // A "newly assigned" user is one that was not already assigned to any of
    // the roles before this change. This mirrors the backend logic that decides
    // whether to send the APPEAL_JUDGES_ASSIGNED notification.
    const previouslyAssignedIds = [
      targetAppealCase.appealAssistant?.id,
      targetAppealCase.appealJudge1?.id,
      targetAppealCase.appealJudge2?.id,
      targetAppealCase.appealJudge3?.id,
    ].filter((id): id is string => Boolean(id))

    const selectedIds = [
      assignedUsers.appealAssistant?.id,
      assignedUsers.appealJudge1?.id,
      assignedUsers.appealJudge2?.id,
      assignedUsers.appealJudge3?.id,
    ].filter((id): id is string => Boolean(id))

    const hasNewlyAssignedUser = selectedIds.some(
      (id) => !previouslyAssignedIds.includes(id),
    )

    if (Object.keys(update).length > 0) {
      const updatedAppealCase = await updateAppealCase(
        workingCase.id,
        targetAppealCase.id,
        update,
      )

      if (!updatedAppealCase) {
        return
      }

      setWorkingCase((prev) =>
        applyAppealCaseUpdate(prev, targetAppealCase.id, {
          appealAssistant: assignedUsers.appealAssistant,
          appealJudge1: assignedUsers.appealJudge1,
          appealJudge2: assignedUsers.appealJudge2,
          appealJudge3: assignedUsers.appealJudge3,
        }),
      )
    }

    if (hasNewlyAssignedUser) {
      setModalVisible(true)
    } else {
      router.push(
        appendAppealCaseIdQuery(
          `${destination}/${workingCase.id}`,
          targetAppealCase.id,
        ),
      )
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
              value={
                assignedUsers.appealAssistant
                  ? {
                      label: assignedUsers.appealAssistant.name ?? '',
                      value: assignedUsers.appealAssistant.id,
                    }
                  : null
              }
              options={assistants}
              onChange={(selectedOption) => {
                handleChangedAssignee(
                  'appealAssistant',
                  (selectedOption as AssistantSelectOption).assistant,
                )
              }}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <SectionHeading title={formatMessage(core.appealJudgesHeading)} />
            <BlueBox>
              {judgeSlots.map(({ field, judge }, index) => (
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
                      judge
                        ? { label: judge.name ?? '', value: judge.id }
                        : undefined
                    }
                    options={judges}
                    onChange={(selectedOption) => {
                      handleChangedAssignee(
                        field,
                        (selectedOption as JudgeSelectOption).judge,
                      )
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
              handleNavigationTo(COURT_OF_APPEAL_RULING_ROUTE)
            }}
            nextButtonText={nextButtonText}
            nextIsLoading={isUpdatingAppealCase}
            nextIsDisabled={!isCourtOfAppealCaseStepValid(previewAppealCase)}
          />
        </FormContentContainer>
      </PageLayout>
      <AnimatePresence>
        {modalVisible && (
          <Modal
            title={formatMessage(strings.modalHeading)}
            text={formatMessage(strings.modalMessage)}
            primaryButton={{
              text: formatMessage(strings.modalPrimaryButton),
              onClick: () =>
                router.push(
                  appendAppealCaseIdQuery(
                    `${navigateTo}/${workingCase.id}`,
                    targetAppealCase?.id,
                  ),
                ),
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default AppealCase
