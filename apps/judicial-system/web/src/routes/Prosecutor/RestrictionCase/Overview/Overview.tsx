import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  core,
  errors,
  laws,
  rcOverview as m,
  requestCourtDate,
  restrictionsV2,
  titles,
} from '@island.is/judicial-system-web/messages'
import { lawsBrokenAccordion } from '@island.is/judicial-system-web/messages/Core/lawsBrokenAccordion'
import {
  AccordionListItem,
  CaseFileList,
  CaseResubmitModal,
  CommentsAccordionItem,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  Modal,
  PageHeader,
  PageLayout,
  PdfButton,
  ProsecutorCaseInfo,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseLegalProvisions } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { formatRequestedCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'
import { createCaseResentExplanation } from '@island.is/judicial-system-web/src/utils/stepHelper'

import * as styles from './Overview.css'

export const Overview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [modal, setModal] = useState<
    'noModal' | 'caseResubmitModal' | 'caseSubmittedModal'
  >('noModal')
  const [modalText, setModalText] = useState('')
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const router = useRouter()
  const {
    transitionCase,
    isTransitioningCase,
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    updateCase,
  } = useCase()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

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

  const caseFiles =
    workingCase.caseFiles?.filter((file) => !file.category) ?? []

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.overview)}
      />
      <FormContentContainer>
        {workingCase.state === CaseState.RECEIVED && (
          <Box
            marginBottom={workingCase.openedByDefender ? 3 : 5}
            data-testid="rc-overview-info-panel"
          >
            <AlertMessage
              title={formatMessage(m.receivedAlert.title)}
              message={formatMessage(m.receivedAlert.message)}
              type="info"
            />
          </Box>
        )}
        {workingCase.openedByDefender && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(m.openedByDefenderAlert.title)}
              message={formatMessage(m.openedByDefenderAlert.text, {
                when: formatDate(workingCase.openedByDefender, 'PPPp'),
              })}
              type="info"
              testid="alertMessageOpenedByDefender"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.headingV3, {
              isExtended: Boolean(workingCase.parentCase),
              caseType: workingCase.type,
            })}
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
                      title: formatMessage(core.courtCaseNumber),
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
                title: workingCase.parentCase
                  ? formatMessage(core.pastRestrictionCase, {
                      caseType: workingCase.type,
                    })
                  : formatMessage(core.arrestDate),
                value: workingCase.parentCase
                  ? `${capitalize(
                      formatDate(
                        workingCase.parentCase.validToDate,
                        'PPPP',
                        true,
                      ) ?? '',
                    )} kl. ${formatDate(
                      workingCase.parentCase.validToDate,
                      constants.TIME_FORMAT,
                    )}`
                  : workingCase.arrestDate
                  ? `${capitalize(
                      formatDate(workingCase.arrestDate, 'PPPP', true) ?? '',
                    )} kl. ${formatDate(
                      workingCase.arrestDate,
                      constants.TIME_FORMAT,
                    )}`
                  : 'Var ekki skráður',
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
              label={formatMessage(lawsBrokenAccordion.heading)}
            >
              <Text whiteSpace="breakSpaces">{workingCase.lawsBroken}</Text>
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_2"
              label="Lagaákvæði sem krafan er byggð á"
            >
              {workingCase.legalProvisions &&
                workingCase.legalProvisions.map(
                  (legalProvision: CaseLegalProvisions, index: number) => {
                    return (
                      <div key={index}>
                        <Text>{formatMessage(laws[legalProvision].title)}</Text>
                      </div>
                    )
                  },
                )}
              {workingCase.legalBasis && <Text>{workingCase.legalBasis}</Text>}
            </AccordionItem>
            <AccordionItem
              labelVariant="h3"
              id="id_3"
              label={formatMessage(restrictionsV2.title, {
                caseType: workingCase.type,
              })}
            >
              {formatRequestedCustodyRestrictions(
                formatMessage,
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
            </AccordionItem>
            <AccordionItem
              id="id_6"
              label={`Rannsóknargögn ${`(${caseFiles.length})`}`}
              labelVariant="h3"
            >
              <Box marginY={3}>
                <CaseFileList caseId={workingCase.id} files={caseFiles} />
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
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.RESTRICTION_CASE_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={workingCase.state === CaseState.NEW}
          nextButtonText={
            workingCase.state === CaseState.NEW ||
            workingCase.state === CaseState.DRAFT
              ? 'Senda kröfu á héraðsdóm'
              : 'Endursenda kröfu á héraðsdóm'
          }
          nextIsLoading={
            workingCase.state !== CaseState.RECEIVED &&
            (isTransitioningCase || isSendingNotification)
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
            onContinue={(explanation) => handleNextButtonClick(explanation)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modal === 'caseSubmittedModal' && (
          <Modal
            title={formatMessage(m.sections.modal.headingV2, {
              caseType: workingCase.type,
            })}
            text={modalText}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onSecondaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            errorMessage={
              sendNotificationError
                ? formatMessage(errors.sendNotification)
                : undefined
            }
            secondaryButtonText={formatMessage(core.closeModal)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
