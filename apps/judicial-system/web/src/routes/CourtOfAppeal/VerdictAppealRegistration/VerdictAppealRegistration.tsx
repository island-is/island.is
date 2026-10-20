import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, Button, Select, Text } from '@island.is/island-ui/core'
import {
  COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  IconButton,
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
  addBenchSeat,
  type AssistantSelectOption,
  type BenchSlot,
  buildAppealCaseUpdate,
  canAddBenchSeat,
  canRemoveBenchSeat,
  getAssistantOptions,
  getBenchSlots,
  getJudgeOptions,
  getNewlyAssignedUserIds,
  hasUnsavedRoleChanges,
  type JudgeSelectOption,
  removeBenchSeat,
  setBenchSeat,
  toPreviewAppealCase,
} from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/components/AppealRoles/appealRoles.logic'
import { useAppealCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import {
  appendAppealCaseIdQuery,
  applyAppealCaseUpdate,
} from '@island.is/judicial-system-web/src/utils/utils'
import { isVerdictAppealRegistrationStepValid } from '@island.is/judicial-system-web/src/utils/validate'

/**
 * Where the Court of Appeals records its own case number for a verdict appeal
 * and, when the time comes, seats the bench.
 *
 * The number is entered when the appeal is received and the court does not
 * move on without it. The bench is assigned later, once the statements and
 * the case files are in, so the assistant and the judges are optional here
 * and are confirmed with their own button rather than on the way forward:
 * a judge is told of the assignment the moment it is confirmed, so the court
 * says so explicitly. The bench is a list of seats in order; the first seat
 * is the presiding judge.
 */
const VerdictAppealRegistration = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // given on the overview: the resolver falls back to the case-level ruling
  // appeal when the URL names no appeal, and this page is never about that
  // one.
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { updateAppealCase, isUpdatingAppealCase } = useAppealCase()

  const [modalVisible, setModalVisible] = useState(false)
  const [appealAssistant, setAppealAssistant] = useState<
    User | null | undefined
  >(() => verdictAppealCase?.appealAssistant)
  const [judges, setJudges] = useState<BenchSlot[]>(() =>
    getBenchSlots(verdictAppealCase),
  )

  const savedAssistant = verdictAppealCase?.appealAssistant
  const savedJudges = verdictAppealCase?.appealJudges

  useEffect(() => {
    setAppealAssistant(savedAssistant)
    setJudges(getBenchSlots({ appealJudges: savedJudges }))
  }, [savedAssistant, savedJudges])

  const { data: usersData } = useAppealCaseUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const assistantOptions = getAssistantOptions(usersData?.users)
  const judgeOptions = getJudgeOptions(usersData?.users, judges)

  const roles = { appealAssistant, judges }
  const stepIsValid = isVerdictAppealRegistrationStepValid(verdictAppealCase)
  // A judge is told of the assignment by the case number, so the bench waits
  // for the number.
  const canConfirmRoles =
    stepIsValid && hasUnsavedRoleChanges(verdictAppealCase, roles)

  const previousUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE}/${workingCase.id}`,
    verdictAppealCase?.id,
  )

  const handleNavigationTo = (destination: string) =>
    router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        verdictAppealCase?.id,
      ),
    )

  const handleConfirmRoles = async () => {
    if (!verdictAppealCase?.id) {
      return
    }

    const hasNewlyAssignedUser =
      getNewlyAssignedUserIds(verdictAppealCase, roles).length > 0

    const updatedAppealCase = await updateAppealCase(
      workingCase.id,
      verdictAppealCase.id,
      buildAppealCaseUpdate(verdictAppealCase, roles),
    )

    if (!updatedAppealCase) {
      return
    }

    // The server returns the bench as stored when it changed; otherwise the
    // local selection already matches it.
    const savedAppealCase = toPreviewAppealCase(verdictAppealCase, roles)

    setWorkingCase((prev) =>
      applyAppealCaseUpdate(prev, verdictAppealCase.id, {
        appealAssistant,
        appealJudges:
          updatedAppealCase.appealJudges ?? savedAppealCase.appealJudges,
      }),
    )

    if (hasNewlyAssignedUser) {
      setModalVisible(true)
    }
  }

  return (
    <>
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
        isValid={stepIsValid}
        onNavigationTo={handleNavigationTo}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <PageTitle>Skráning og úthlutun</PageTitle>
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(core.appealCaseNumberHeading)}
            />
            <CaseNumberInput appealCase={verdictAppealCase} />
          </Box>
          <Box component="section" marginBottom={8}>
            <SectionHeading title="Úthlutun" />
            <BlueBox>
              <Text as="h4" variant="h4" marginBottom={2}>
                {formatMessage(core.appealAssistantHeading)}
              </Text>
              <Box marginBottom={3}>
                <Select
                  name="assistant"
                  label="Veldu aðstoðarmann"
                  placeholder="Velja aðstoðarmann"
                  value={
                    appealAssistant
                      ? {
                          label: appealAssistant.name ?? '',
                          value: appealAssistant.id,
                        }
                      : null
                  }
                  options={assistantOptions}
                  onChange={(selectedOption) => {
                    setAppealAssistant(
                      (selectedOption as AssistantSelectOption).assistant,
                    )
                  }}
                />
              </Box>
              <Text as="h4" variant="h4" marginBottom={2}>
                {formatMessage(core.appealJudgesHeading)}
              </Text>
              {judges.map((judge, seat) => (
                <Box
                  key={`${seat}`}
                  display="flex"
                  alignItems="center"
                  columnGap={2}
                  marginBottom={2}
                >
                  <Box flexGrow={1}>
                    <Select
                      name={`judge-${seat}`}
                      label={seat === 0 ? 'Veldu dómsformann' : 'Veldu dómara'}
                      placeholder="Velja dómara"
                      value={
                        judge
                          ? { label: judge.name ?? '', value: judge.id }
                          : null
                      }
                      options={judgeOptions}
                      onChange={(selectedOption) => {
                        setJudges((prev) =>
                          setBenchSeat(
                            prev,
                            seat,
                            (selectedOption as JudgeSelectOption).judge,
                          ),
                        )
                      }}
                    />
                  </Box>
                  {canRemoveBenchSeat(judges, seat) && (
                    <IconButton
                      icon="trash"
                      colorScheme="transparent"
                      ariaLabel="Fjarlægja dómara"
                      onClick={() =>
                        setJudges((prev) => removeBenchSeat(prev, seat))
                      }
                    />
                  )}
                </Box>
              ))}
              <Box display="flex" justifyContent="flexEnd" columnGap={3}>
                <Button
                  variant="text"
                  size="small"
                  disabled={!canAddBenchSeat(judges)}
                  onClick={() => setJudges((prev) => addBenchSeat(prev))}
                >
                  Bæta við dómara
                </Button>
                <Button
                  variant="text"
                  size="small"
                  disabled={!canConfirmRoles}
                  loading={isUpdatingAppealCase}
                  onClick={handleConfirmRoles}
                >
                  Staðfesta val
                </Button>
              </Box>
            </BlueBox>
          </Box>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={previousUrl}
            actions={[
              {
                text: formatMessage(core.continue),
                icon: 'arrowForward',
                disabled: !stepIsValid,
                onClick: () =>
                  handleNavigationTo(
                    COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE,
                  ),
                testId: 'continueButton',
              },
            ]}
          />
        </FormContentContainer>
      </PageLayout>
      <AnimatePresence>
        {modalVisible && (
          <Modal
            title="Tilkynningar sendar"
            text="Tilkynningar voru sendar á landsréttardómara og aðstoðarmann dómara."
            buttons={[
              {
                text: 'Loka',
                onClick: () => setModalVisible(false),
              },
            ]}
            onClose={() => setModalVisible(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default VerdictAppealRegistration
