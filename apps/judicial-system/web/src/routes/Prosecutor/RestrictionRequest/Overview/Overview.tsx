import React, { useState, useEffect, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import { Box, Text, Accordion, AccordionItem } from '@island.is/island-ui/core'
import {
  NotificationType,
  CaseState,
  CaseType,
  CaseTransition,
} from '@island.is/judicial-system/types'
import type {
  Case,
  CaseLegalProvisions,
} from '@island.is/judicial-system/types'
import {
  formatDate,
  capitalize,
  laws,
} from '@island.is/judicial-system/formatters'
import {
  FormFooter,
  Modal,
  InfoCard,
  PageLayout,
  PdfButton,
  FormContentContainer,
  CaseFileList,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  TIME_FORMAT,
  formatRequestedCustodyRestrictions,
} from '@island.is/judicial-system/formatters'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  core,
  rcOverview,
  requestCourtDate,
} from '@island.is/judicial-system-web/messages'

import * as styles from './Overview.css'

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalText, setModalText] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()

  const router = useRouter()
  const id = router.query.id

  const { transitionCase, sendNotification, isSendingNotification } = useCase()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    try {
      const shouldSubmitCase = workingCase.state === CaseState.DRAFT

      const caseSubmitted = shouldSubmitCase
        ? await transitionCase(
            workingCase,
            CaseTransition.SUBMIT,
            setWorkingCase,
          )
        : workingCase.state !== CaseState.NEW

      const notificationSent = caseSubmitted
        ? await sendNotification(
            workingCase.id,
            NotificationType.READY_FOR_COURT,
          )
        : false

      // An SMS should have been sent
      if (notificationSent) {
        setModalText(formatMessage(rcOverview.sections.modal.notificationSent))
      } else {
        setModalText(
          formatMessage(rcOverview.sections.modal.notificationNotSent),
        )
      }

      setModalVisible(true)
    } catch (e) {
      // TODO: Handle error
    }
  }

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.PROSECUTOR_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                {formatMessage(rcOverview.heading, {
                  caseType: `${
                    workingCase.parentCase ? 'framlengingu á ' : ''
                  }${
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann'
                  }${workingCase.parentCase ? 'i' : ''}`,
                })}
              </Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <InfoCard
                data={[
                  {
                    title: 'LÖKE málsnúmer',
                    value: workingCase.policeCaseNumber,
                  },
                  {
                    title: 'Dómstóll',
                    value: workingCase.court?.name,
                  },
                  {
                    title: 'Embætti',
                    value: `${
                      workingCase.creatingProsecutor?.institution?.name ??
                      'Ekki skráð'
                    }`,
                  },
                  {
                    title: formatMessage(requestCourtDate.heading),
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
            <Box component="section" marginBottom={5} data-testid="demands">
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Dómkröfur
                </Text>
              </Box>
              <Text>{workingCase.demands}</Text>
            </Box>
            <Box component="section" marginBottom={10}>
              <Accordion>
                <AccordionItem
                  labelVariant="h3"
                  id="id_1"
                  label="Lagaákvæði sem brot varða við"
                >
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.lawsBroken}
                    </span>
                  </Text>
                </AccordionItem>
                <AccordionItem
                  labelVariant="h3"
                  id="id_2"
                  label="Lagaákvæði sem krafan er byggð á"
                >
                  {workingCase.legalProvisions &&
                    workingCase.legalProvisions.map(
                      (legalProvision: CaseLegalProvisions, index) => {
                        return (
                          <div key={index}>
                            <Text>{laws[legalProvision]}</Text>
                          </div>
                        )
                      },
                    )}
                  {workingCase.legalBasis && (
                    <Text>{workingCase.legalBasis}</Text>
                  )}
                </AccordionItem>
                <AccordionItem
                  labelVariant="h3"
                  id="id_3"
                  label={`Takmarkanir og tilhögun ${
                    workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
                  }`}
                >
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
                </AccordionItem>
                <AccordionItem
                  labelVariant="h3"
                  id="id_4"
                  label="Greinargerð um málsatvik og lagarök"
                >
                  {workingCase.caseFacts && (
                    <Box marginBottom={2}>
                      <Box marginBottom={2}>
                        <Text variant="h5">Málsatvik</Text>
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
                        <Text variant="h5">Lagarök</Text>
                      </Box>
                      <Text>
                        <span className={styles.breakSpaces}>
                          {workingCase.legalArguments}
                        </span>
                      </Text>
                    </Box>
                  )}
                </AccordionItem>
                {(Boolean(workingCase.comments) ||
                  Boolean(workingCase.caseFilesComments)) && (
                  <AccordionItem
                    id="id_5"
                    label="Athugasemdir"
                    labelVariant="h3"
                  >
                    {Boolean(workingCase.comments) && (
                      <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
                        <Box marginBottom={1}>
                          <Text variant="h4" as="h4">
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
                    {Boolean(workingCase.caseFilesComments) && (
                      <>
                        <Text variant="h4" as="h4">
                          Athugasemdir vegna rannsóknargagna
                        </Text>
                        <Text>
                          <span className={styles.breakSpaces}>
                            {workingCase.caseFilesComments}
                          </span>
                        </Text>
                      </>
                    )}
                  </AccordionItem>
                )}
                <AccordionItem
                  id="id_6"
                  label={`Rannsóknargögn ${`(${
                    workingCase.caseFiles ? workingCase.caseFiles.length : 0
                  })`}`}
                  labelVariant="h3"
                >
                  <Box marginY={3}>
                    <CaseFileList
                      caseId={workingCase.id}
                      files={workingCase.caseFiles ?? []}
                    />
                  </Box>
                </AccordionItem>
              </Accordion>
            </Box>
            <Box className={styles.prosecutorContainer}>
              <Text variant="h3">
                {workingCase.prosecutor
                  ? `${workingCase.prosecutor.name} ${workingCase.prosecutor.title}`
                  : `${user?.name} ${user?.title}`}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <PdfButton
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRequest)}
                pdfType="request"
              />
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.STEP_FIVE_ROUTE}/${workingCase.id}`}
              nextButtonText={
                workingCase.state === CaseState.NEW ||
                workingCase.state === CaseState.DRAFT
                  ? 'Senda kröfu á héraðsdóm'
                  : 'Endursenda kröfu á héraðsdóm'
              }
              nextIsLoading={isSendingNotification}
              onNextButtonClick={handleNextButtonClick}
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title={formatMessage(rcOverview.sections.modal.heading, {
                caseType:
                  workingCase.type === CaseType.CUSTODY
                    ? 'gæsluvarðhald'
                    : 'farbann',
              })}
              text={modalText}
              handleClose={() => router.push(Constants.REQUEST_LIST_ROUTE)}
              handlePrimaryButtonClick={() => {
                window.open(Constants.FEEDBACK_FORM_URL, '_blank')
                router.push(Constants.REQUEST_LIST_ROUTE)
              }}
              handleSecondaryButtonClick={() => {
                router.push(Constants.REQUEST_LIST_ROUTE)
              }}
              primaryButtonText="Senda ábendingu"
              secondaryButtonText="Loka glugga"
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default Overview
