import type { FC } from 'react'
import { useContext, useEffect, useState } from 'react'
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
import type { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseNumberInput } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/components'
import { useAppealCaseUsersQuery } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/components/AppealRoles/appealCaseUsers.generated'
import {
  type AssistantSelectOption,
  type BenchSlot,
  buildAppealCaseUpdate,
  getAssistantOptions,
  getBenchSlots,
  getJudgeOptions,
  getNewlyAssignedUserIds,
  hasUnsavedRoleChanges,
  isAnyRoleUnfilled,
  type JudgeSelectOption,
  setBenchSeat,
  toPreviewAppealCase,
} from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/components/AppealRoles/appealRoles.logic'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useAppealCase,
  useTargetAppealCaseByAppealCaseId,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  appendAppealCaseIdQuery,
  applyAppealCaseUpdate,
} from '@island.is/judicial-system-web/src/utils/utils'
import { isCourtOfAppealCaseStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { appealCase as strings } from './AppealCase.strings'

const AppealCase: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()
  const { updateAppealCase, isUpdatingAppealCase } = useAppealCase()

  const { formatMessage } = useIntl()
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  // Role selections are collected locally and only persisted to the server when
  // the continue button is pressed. The bench is a list of seats in order; the
  // first seat is the presiding judge.
  const [appealAssistant, setAppealAssistant] = useState<
    User | null | undefined
  >(() => targetAppealCase?.appealAssistant)
  const [judges, setJudges] = useState<BenchSlot[]>(() =>
    getBenchSlots(targetAppealCase),
  )

  const savedAssistant = targetAppealCase?.appealAssistant
  const savedJudges = targetAppealCase?.appealJudges

  useEffect(() => {
    setAppealAssistant(savedAssistant)
    setJudges(getBenchSlots({ appealJudges: savedJudges }))
  }, [savedAssistant, savedJudges])

  const { data: usersData } = useAppealCaseUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const assistants = getAssistantOptions(usersData?.users)
  const judgeOptions = getJudgeOptions(usersData?.users, judges)

  const roles = { appealAssistant, judges }

  // Validate against the locally selected users (not yet persisted).
  const previewAppealCase = targetAppealCase
    ? toPreviewAppealCase(targetAppealCase, roles)
    : targetAppealCase

  // Prompt the user to confirm the allocation while a role is still unfilled or
  // an allocation differs from what is saved; otherwise it is already confirmed.
  const nextButtonText =
    isAnyRoleUnfilled(roles) || hasUnsavedRoleChanges(targetAppealCase, roles)
      ? 'Staðfesta úthlutun'
      : 'Halda áfram'

  const handleChangedJudge = (seat: number, judge: User) => {
    setJudges((prev) => setBenchSeat(prev, seat, judge))
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
    const update = buildAppealCaseUpdate(targetAppealCase, roles)
    const hasNewlyAssignedUser =
      getNewlyAssignedUserIds(targetAppealCase, roles).length > 0

    if (Object.keys(update).length > 0) {
      const updatedAppealCase = await updateAppealCase(
        workingCase.id,
        targetAppealCase.id,
        update,
      )

      if (!updatedAppealCase) {
        return
      }

      // The server returns the bench as stored when it changed; otherwise the
      // local selection already matches it.
      const savedAppealCase = toPreviewAppealCase(targetAppealCase, roles)

      setWorkingCase((prev) =>
        applyAppealCaseUpdate(prev, targetAppealCase.id, {
          appealAssistant,
          appealJudges:
            updatedAppealCase.appealJudges ?? savedAppealCase.appealJudges,
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
            <CaseNumberInput appealCase={targetAppealCase} />
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
                appealAssistant
                  ? {
                      label: appealAssistant.name ?? '',
                      value: appealAssistant.id,
                    }
                  : null
              }
              options={assistants}
              onChange={(selectedOption) => {
                setAppealAssistant(
                  (selectedOption as AssistantSelectOption).assistant,
                )
              }}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <SectionHeading title={formatMessage(core.appealJudgesHeading)} />
            <BlueBox>
              {judges.map((judge, seat) => (
                <Box marginBottom={2} key={`${seat}`}>
                  <Select
                    name="judge"
                    label={formatMessage(
                      seat === 0
                        ? strings.judgeForepersonLabel
                        : strings.judgeLabel,
                    )}
                    placeholder={formatMessage(
                      seat === 0
                        ? strings.judgeForepersonPlaceholder
                        : strings.judgePlaceholder,
                    )}
                    value={
                      judge
                        ? { label: judge.name ?? '', value: judge.id }
                        : undefined
                    }
                    options={judgeOptions}
                    onChange={(selectedOption) => {
                      handleChangedJudge(
                        seat,
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
            actions={[
              {
                text: nextButtonText,
                icon: 'arrowForward',
                onClick: () => {
                  handleNavigationTo(COURT_OF_APPEAL_RULING_ROUTE)
                },
                disabled: !isCourtOfAppealCaseStepValid(previewAppealCase),
                loading: isUpdatingAppealCase,
                testId: 'continueButton',
              },
            ]}
          />
        </FormContentContainer>
      </PageLayout>
      <AnimatePresence>
        {modalVisible && (
          <Modal
            title={formatMessage(strings.modalHeading)}
            text={formatMessage(strings.modalMessage)}
            buttons={[
              {
                text: formatMessage(strings.modalPrimaryButton),
                onClick: () =>
                  router.push(
                    appendAppealCaseIdQuery(
                      `${navigateTo}/${workingCase.id}`,
                      targetAppealCase?.id,
                    ),
                  ),
              },
            ]}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default AppealCase
