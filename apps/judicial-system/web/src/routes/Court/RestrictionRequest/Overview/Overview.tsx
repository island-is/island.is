import React, { useEffect, useState, useContext } from 'react'
import { Box, Text, Input, Button } from '@island.is/island-ui/core'
import {
  formatDate,
  capitalize,
  formatRequestedCustodyRestrictions,
  laws,
} from '@island.is/judicial-system/formatters'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  FormFooter,
  PageLayout,
  InfoCard,
  PdfButton,
  BlueBox,
  Modal,
  FormContentContainer,
  CaseFileList,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseCustodyProvisions,
  CaseState,
  CaseTransition,
  CaseType,
  IntegratedCourts,
} from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import * as styles from './Overview.treat'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import ConclusionDraft from './Components/ConclusionDraft'
import { AnimatePresence } from 'framer-motion'
import OverviewForm from './OverviewForm'

export const JudgeOverview: React.FC = () => {
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] = useState<boolean>(
    false,
  )

  const router = useRouter()
  const id = router.query.id

  const { user } = useContext(UserContext)
  const { createCourtCase, transitionCase, isTransitioningCase } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  if (workingCase?.state === CaseState.SUBMITTED && !isTransitioningCase) {
    transitionCase(workingCase, CaseTransition.RECEIVE, setWorkingCase)
  }

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  const handleCreateCourtCase = (workingCase: Case) => {
    createCourtCase(workingCase, setWorkingCase, setCourtCaseNumberEM)

    if (courtCaseNumberEM === '') {
      setCreateCourtCaseSuccess(true)
    }
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.JUDGE_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
          <OverviewForm
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            handleCreateCourtCase={handleCreateCourtCase}
            createCourtCaseSuccess={createCourtCaseSuccess}
            setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
            courtCaseNumberEM={courtCaseNumberEM}
            setCourtCaseNumberEM={setCourtCaseNumberEM}
          />
          <FormContentContainer>
            <Box component="section" marginBottom={5}>
              <InfoCard
                data={[
                  {
                    title: 'Embætti',
                    value: `${
                      workingCase.prosecutor?.institution?.name ?? 'Ekki skráð'
                    }`,
                  },
                  {
                    title: 'Ósk um fyrirtökudag og tíma',
                    value: `${capitalize(
                      formatDate(
                        workingCase.requestedCourtDate,
                        'PPPP',
                        true,
                      ) ?? '',
                    )} eftir kl. ${formatDate(
                      workingCase.requestedCourtDate,
                      TIME_FORMAT,
                    )}`,
                  },
                  { title: 'Ákærandi', value: workingCase.prosecutor?.name },
                  {
                    title: workingCase.parentCase
                      ? `${
                          workingCase.type === CaseType.CUSTODY
                            ? 'Fyrri gæsla'
                            : 'Fyrra farbann'
                        }`
                      : 'Tími handtöku',
                    value: workingCase.parentCase
                      ? `${capitalize(
                          formatDate(
                            workingCase.parentCase.validToDate,
                            'PPPP',
                            true,
                          ) ?? '',
                        )} kl. ${formatDate(
                          workingCase.parentCase.validToDate,
                          TIME_FORMAT,
                        )}`
                      : workingCase.arrestDate
                      ? `${capitalize(
                          formatDate(workingCase.arrestDate, 'PPPP', true) ??
                            '',
                        )} kl. ${formatDate(
                          workingCase.arrestDate,
                          TIME_FORMAT,
                        )}`
                      : 'Var ekki skráður',
                  },
                ]}
                accusedName={workingCase.accusedName}
                accusedNationalId={workingCase.accusedNationalId}
                accusedAddress={workingCase.accusedAddress}
                defender={{
                  name: workingCase.defenderName ?? '',
                  email: workingCase.defenderEmail,
                  phoneNumber: workingCase.defenderPhoneNumber,
                }}
              />
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={9}>
                <Box marginBottom={2}>
                  <Text variant="h3" as="h2">
                    Dómkröfur
                  </Text>
                </Box>
                <Text>{workingCase.demands}</Text>
              </Box>
              <div className={styles.infoSection}>
                <Box marginBottom={6} data-testid="lawsBroken">
                  <Box marginBottom={1}>
                    <Text as="h2" variant="h3">
                      Lagaákvæði sem brot varða við
                    </Text>
                  </Box>
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.lawsBroken}
                    </span>
                  </Text>
                </Box>
                <Box data-testid="custodyProvisions">
                  <Box marginBottom={1}>
                    <Text as="h2" variant="h3">
                      Lagaákvæði sem krafan er byggð á
                    </Text>
                  </Box>
                  {workingCase.custodyProvisions?.map(
                    (custodyProvision: CaseCustodyProvisions, index) => {
                      return (
                        <div key={index}>
                          <Text>{laws[custodyProvision]}</Text>
                        </div>
                      )
                    },
                  )}
                </Box>
              </div>
              <div
                className={styles.infoSection}
                data-testid="custodyRestrictions"
              >
                <Box marginBottom={1}>
                  <Text variant="h3" as="h2">
                    {`Takmarkanir og tilhögun ${
                      workingCase.type === CaseType.CUSTODY
                        ? 'gæslu'
                        : 'farbanns'
                    }`}
                  </Text>
                </Box>
                {formatRequestedCustodyRestrictions(
                  workingCase.type,
                  workingCase.requestedCustodyRestrictions,
                  workingCase.requestedOtherRestrictions,
                )
                  .split('\n')
                  .map((requestedCustodyRestriction, index) => {
                    return (
                      <div key={index}>
                        <Text>{requestedCustodyRestriction}</Text>
                      </div>
                    )
                  })}
              </div>
              {(workingCase.caseFacts || workingCase.legalArguments) && (
                <div className={styles.infoSection}>
                  <Box marginBottom={1}>
                    <Text variant="h3" as="h2">
                      Greinargerð um málsatvik og lagarök
                    </Text>
                  </Box>
                  {workingCase.caseFacts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Text variant="eyebrow" color="blue400">
                          Málsatvik
                        </Text>
                      </Box>
                      <Text>
                        <span className={styles.breakSpaces}>
                          {workingCase.caseFacts}
                        </span>
                      </Text>
                    </Box>
                  )}
                  {workingCase.legalArguments && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Text variant="eyebrow" color="blue400">
                          Lagarök
                        </Text>
                      </Box>
                      <Text>
                        <span className={styles.breakSpaces}>
                          {workingCase.legalArguments}
                        </span>
                      </Text>
                    </Box>
                  )}
                </div>
              )}
              {(workingCase.comments || workingCase.caseFilesComments) && (
                <div className={styles.infoSection}>
                  <Box marginBottom={2}>
                    <Text variant="h3" as="h2">
                      Athugasemdir
                    </Text>
                  </Box>
                  {workingCase.comments && (
                    <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
                      <Box marginBottom={1}>
                        <Text variant="h4" as="h3" color="blue400">
                          Athugasemdir vegna málsmeðferðar
                        </Text>
                      </Box>
                      <Text>
                        <span className={styles.breakSpaces}>
                          {workingCase.comments}
                        </span>
                      </Text>
                    </Box>
                  )}
                  {workingCase.caseFilesComments && (
                    <>
                      <Box marginBottom={1}>
                        <Text variant="h4" as="h3" color="blue400">
                          Athugasemdir vegna rannsóknargagna
                        </Text>
                      </Box>
                      <Text>
                        <span className={styles.breakSpaces}>
                          {workingCase.caseFilesComments}
                        </span>
                      </Text>
                    </>
                  )}
                </div>
              )}

              <div className={styles.infoSection}>
                <Box marginBottom={1}>
                  <Text as="h2" variant="h3">
                    {`Rannsóknargögn (${
                      workingCase.files ? workingCase.files.length : 0
                    })`}
                  </Text>
                </Box>
                <CaseFileList
                  caseId={workingCase.id}
                  files={workingCase.files ?? []}
                  canOpenFiles={
                    workingCase.judge !== null &&
                    workingCase.judge?.id === user?.id
                  }
                />
              </div>
              <Box marginBottom={3}>
                <PdfButton
                  caseId={workingCase.id}
                  title="Opna PDF kröfu"
                  pdfType="request"
                />
              </Box>
              <Button
                variant="ghost"
                icon="pencil"
                size="small"
                onClick={() => setIsDraftingConclusion(true)}
              >
                Skrifa drög að niðurstöðu
              </Button>
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={Constants.REQUEST_LIST_ROUTE}
              nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
              nextIsDisabled={isNextDisabled([
                {
                  value: workingCase.courtCaseNumber ?? '',
                  validations: ['empty'],
                },
              ])}
            />
          </FormContentContainer>
          <AnimatePresence>
            {isDraftingConclusion && (
              <Modal
                title="Skrifa drög að niðurstöðu"
                text={
                  <ConclusionDraft
                    workingCase={workingCase}
                    setWorkingCase={setWorkingCase}
                  />
                }
                primaryButtonText="Loka glugga"
                handlePrimaryButtonClick={() => setIsDraftingConclusion(false)}
              />
            )}
          </AnimatePresence>
        </>
      ) : null}
    </PageLayout>
  )
}

export default JudgeOverview
