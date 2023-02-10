import React, { useState, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
} from '@island.is/island-ui/core'
import {
  NotificationType,
  CaseState,
  CaseTransition,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import {
  AccordionListItem,
  CaseFileList,
  ProsecutorCaseInfo,
  CommentsAccordionItem,
  FormContentContainer,
  FormFooter,
  InfoCard,
  Modal,
  PageLayout,
  PdfButton,
  CaseResubmitModal,
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  core,
  icOverview as m,
  requestCourtDate,
  titles,
} from '@island.is/judicial-system-web/messages'
import { createCaseResentExplanation } from '@island.is/judicial-system-web/src/utils/stepHelper'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  formatDate,
  caseTypes,
  capitalize,
} from '@island.is/judicial-system/formatters'
import { Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'

import * as styles from './Overview.css'
import { CopyLinkForDefenderButton } from '../../components'

export const Overview: React.FC = () => {
  const router = useRouter()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const {
    transitionCase,
    sendNotification,
    isSendingNotification,
    updateCase,
  } = useCase()
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const [modal, setModal] = useState<
    'noModal' | 'caseSubmittedModal' | 'caseResubmitModal'
  >('noModal')
  const [modalText, setModalText] = useState('')

  const handleNextButtonClick = async (caseResentExplanation?: string) => {
    if (!workingCase) {
      return
    }

    const shouldSubmitCase = workingCase.state === CaseState.DRAFT

    const caseSubmitted = shouldSubmitCase
      ? await transitionCase(
          workingCase.id,
          CaseTransition.SUBMIT,
          setWorkingCase,
        )
      : workingCase.state !== CaseState.NEW

    const notificationSent = caseSubmitted
      ? await sendNotification(workingCase.id, NotificationType.READY_FOR_COURT)
      : false

    // An SMS should have been sent
    if (notificationSent) {
      setModalText(formatMessage(m.sections.modal.notificationSent))
    } else {
      setModalText(formatMessage(m.sections.modal.notificationNotSent))
    }

    if (workingCase.state === CaseState.RECEIVED) {
      updateCase(workingCase.id, {
        caseResentExplanation: createCaseResentExplanation(
          workingCase,
          caseResentExplanation,
        ),
      })
    }

    setModal('caseSubmittedModal')
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={
        RestrictionCaseProsecutorSubsections.PROSECUTOR_OVERVIEW
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.overview)}
      />
      <FormContentContainer>
        {workingCase.state === CaseState.RECEIVED && (
          <Box
            marginBottom={workingCase.seenByDefender ? 3 : 5}
            data-testid="ic-overview-info-panel"
          >
            <AlertMessage
              title={formatMessage(m.receivedAlert.title)}
              message={formatMessage(m.receivedAlert.message)}
              type="info"
            />
          </Box>
        )}
        {workingCase.seenByDefender && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(m.seenByDefenderAlert.title)}
              message={formatMessage(m.seenByDefenderAlert.text, {
                when: formatDate(workingCase.seenByDefender, 'PPPp'),
              })}
              type="info"
              testid="alertMessageSeenByDefender"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumbers.map((n) => (
                  <Text key={n}>{n}</Text>
                )),
              },
              ...(workingCase.courtCaseNumber
                ? [
                    {
                      title: 'Málsnúmer héraðsdóms',
                      value: workingCase.courtCaseNumber,
                    },
                  ]
                : []),
              {
                title: formatMessage(core.court),
                value: workingCase.court?.name,
              },
              {
                title: formatMessage(core.prosecutor),
                value: `${workingCase.creatingProsecutor?.institution?.name}`,
              },
              ...(workingCase.judge
                ? [
                    {
                      title: formatMessage(core.judge),
                      value: workingCase.judge.name,
                    },
                  ]
                : []),
              {
                title: formatMessage(requestCourtDate.heading),
                value: `${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP', true) ??
                    '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  constants.TIME_FORMAT,
                )}`,
              },
              ...(workingCase.registrar
                ? [
                    {
                      title: formatMessage(core.registrar),
                      value: workingCase.registrar.name,
                    },
                  ]
                : []),
              {
                title: formatMessage(core.prosecutorPerson),
                value: workingCase.prosecutor?.name,
              },
              {
                title: formatMessage(core.caseType),
                value: capitalize(caseTypes[workingCase.type]),
              },
              ...(workingCase.courtDate
                ? [
                    {
                      title: formatMessage(core.confirmedCourtDate),
                      value: `${capitalize(
                        formatDate(workingCase.courtDate, 'PPPP', true) ?? '',
                      )} kl. ${formatDate(
                        workingCase.courtDate,
                        constants.TIME_FORMAT,
                      )}`,
                    },
                  ]
                : []),
            ]}
            defendants={
              workingCase.defendants
                ? {
                    title: capitalize(
                      formatMessage(core.defendant, {
                        suffix: workingCase.defendants.length > 1 ? 'ar' : 'i',
                      }),
                    ),
                    items: workingCase.defendants,
                  }
                : undefined
            }
            defenders={[
              {
                name: workingCase.defenderName ?? '',
                defenderNationalId: workingCase.defenderNationalId,
                sessionArrangement: workingCase.sessionArrangements,
                email: workingCase.defenderEmail,
                phoneNumber: workingCase.defenderPhoneNumber,
              },
            ]}
          />
        </Box>
        {workingCase.description && (
          <Box component="section" marginBottom={5}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Efni kröfu
              </Text>
            </Box>
            <Text>{workingCase.description}</Text>
          </Box>
        )}
        <Box component="section" marginBottom={5} data-testid="demands">
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómkröfur
            </Text>
          </Box>
          <Text>{workingCase.demands}</Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <Accordion>
            <AccordionItem
              labelVariant="h3"
              id="id_1"
              label="Lagaákvæði sem brot varða við"
            >
              <Text whiteSpace="breakSpaces">{workingCase.lawsBroken}</Text>
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_2"
              label="Lagaákvæði sem krafan er byggð á"
            >
              <Text>{workingCase.legalBasis}</Text>
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_4"
              label="Greinargerð um málsatvik og lagarök"
            >
              {workingCase.caseFacts && (
                <AccordionListItem title="Málsatvik">
                  <Text whiteSpace="breakSpaces">{workingCase.caseFacts}</Text>
                </AccordionListItem>
              )}
              {workingCase.legalArguments && (
                <AccordionListItem title="Lagarök">
                  <Text whiteSpace="breakSpaces">
                    {workingCase.legalArguments}
                  </Text>
                </AccordionListItem>
              )}
              {workingCase.requestProsecutorOnlySession && (
                <AccordionListItem title="Beiðni um dómþing að varnaraðila fjarstöddum">
                  <Text>{workingCase.prosecutorOnlySessionRequest}</Text>
                </AccordionListItem>
              )}
            </AccordionItem>
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
                  isCaseCompleted={completedCaseStates.includes(
                    workingCase.state,
                  )}
                />
              </Box>
            </AccordionItem>
            {(workingCase.comments ||
              workingCase.caseFilesComments ||
              workingCase.caseResentExplanation) && (
              <CommentsAccordionItem workingCase={workingCase} />
            )}
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
          {workingCase.defenderNationalId && (
            <Box marginTop={3}>
              <CopyLinkForDefenderButton
                caseId={workingCase.id}
                type={workingCase.type}
                disabled={
                  workingCase.state !== CaseState.RECEIVED ||
                  !workingCase.courtDate
                }
              >
                {formatMessage(m.sections.copyLinkForDefenderButton)}
              </CopyLinkForDefenderButton>
            </Box>
          )}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INVESTIGATION_CASE_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextButtonText={
            workingCase.state === CaseState.NEW ||
            workingCase.state === CaseState.DRAFT
              ? 'Senda kröfu á héraðsdóm'
              : 'Endursenda kröfu á héraðsdóm'
          }
          nextIsLoading={
            workingCase.state !== CaseState.RECEIVED &&
            (isLoadingWorkingCase || isSendingNotification)
          }
          onNextButtonClick={
            workingCase.state === CaseState.RECEIVED
              ? () => {
                  setModal('caseResubmitModal')
                }
              : handleNextButtonClick
          }
        />
      </FormContentContainer>
      <AnimatePresence>
        {modal === 'caseResubmitModal' && (
          <CaseResubmitModal
            workingCase={workingCase}
            isLoading={isSendingNotification}
            onClose={() => setModal('noModal')}
            onContinue={(explaination) => handleNextButtonClick(explaination)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modal === 'caseSubmittedModal' && (
          <Modal
            title={formatMessage(m.sections.modal.heading)}
            text={modalText}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onSecondaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            secondaryButtonText={formatMessage(core.closeModal)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
