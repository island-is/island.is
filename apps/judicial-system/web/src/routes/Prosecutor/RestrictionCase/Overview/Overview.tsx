import React, { useState, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  Input,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  NotificationType,
  CaseState,
  CaseTransition,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import { formatDate, capitalize } from '@island.is/judicial-system/formatters'
import {
  FormFooter,
  Modal,
  InfoCard,
  PageLayout,
  PdfButton,
  FormContentContainer,
  CaseFileList,
  CaseInfo,
  AccordionListItem,
} from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  core,
  laws,
  rcOverview,
  requestCourtDate,
  restrictionsV2,
  titles,
} from '@island.is/judicial-system-web/messages'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import CommentsAccordionItem from '@island.is/judicial-system-web/src/components/AccordionItems/CommentsAccordionItem/CommentsAccordionItem'
import { createCaseResentExplanation } from '@island.is/judicial-system-web/src/utils/stepHelper'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import type { CaseLegalProvisions } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'
import { formatRequestedCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'

import * as styles from './Overview.css'

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [resendCaseModalVisible, setResendCaseModalVisible] = useState(false)
  const [caseResentExplanation, setCaseResentExplanation] = useState('')
  const [modalText, setModalText] = useState('')
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const router = useRouter()
  const {
    transitionCase,
    sendNotification,
    isSendingNotification,
    updateCase,
  } = useCase()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const shouldSubmitCase = workingCase.state === CaseState.DRAFT

    const caseSubmitted = shouldSubmitCase
      ? await transitionCase(workingCase, CaseTransition.SUBMIT, setWorkingCase)
      : workingCase.state !== CaseState.NEW

    const notificationSent = caseSubmitted
      ? await sendNotification(workingCase.id, NotificationType.READY_FOR_COURT)
      : false

    // An SMS should have been sent
    if (notificationSent) {
      setModalText(formatMessage(rcOverview.sections.modal.notificationSent))
    } else {
      setModalText(formatMessage(rcOverview.sections.modal.notificationNotSent))
    }

    if (workingCase.state === CaseState.RECEIVED) {
      updateCase(workingCase.id, {
        caseResentExplanation: createCaseResentExplanation(
          workingCase,
          caseResentExplanation,
        ),
      })

      setResendCaseModalVisible(false)
    }

    setModalVisible(true)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.PROSECUTOR_OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.overview)}
      />
      <FormContentContainer>
        {workingCase.state === CaseState.RECEIVED && (
          <div
            className={styles.resendInfoPanelContainer}
            data-testid="rc-overview-info-panel"
          >
            <AlertMessage
              title={formatMessage(rcOverview.receivedAlert.title)}
              message={formatMessage(rcOverview.receivedAlert.message)}
              type="info"
            />
          </div>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcOverview.headingV2, {
              isExtended: workingCase?.parentCase ? 'yes' : 'no',
              caseType: workingCase.type,
            })}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo
            workingCase={workingCase}
            userRole={user?.role}
            showAdditionalInfo
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumber,
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
                value: `${
                  workingCase.creatingProsecutor?.institution?.name ??
                  'Ekki skráð'
                }`,
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
                  Constants.TIME_FORMAT,
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
                      Constants.TIME_FORMAT,
                    )}`
                  : workingCase.arrestDate
                  ? `${capitalize(
                      formatDate(workingCase.arrestDate, 'PPPP', true) ?? '',
                    )} kl. ${formatDate(
                      workingCase.arrestDate,
                      Constants.TIME_FORMAT,
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
                        Constants.TIME_FORMAT,
                      )}`,
                    },
                  ]
                : []),
            ]}
            defendants={workingCase.defendants ?? []}
            defender={{
              name: workingCase.defenderName ?? '',
              defenderNationalId: workingCase.defenderNationalId,
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
            }}
            sessionArrangement={workingCase.sessionArrangements}
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
          nextIsLoading={
            workingCase.state !== CaseState.RECEIVED && isSendingNotification
          }
          onNextButtonClick={
            workingCase.state === CaseState.RECEIVED
              ? () => {
                  setResendCaseModalVisible(true)
                }
              : handleNextButtonClick
          }
        />
      </FormContentContainer>
      <AnimatePresence>
        {resendCaseModalVisible && (
          <Modal
            title={formatMessage(rcOverview.sections.caseResentModal.heading)}
            text={formatMessage(rcOverview.sections.caseResentModal.text)}
            handleClose={() => setResendCaseModalVisible(false)}
            primaryButtonText={formatMessage(
              rcOverview.sections.caseResentModal.primaryButtonText,
            )}
            secondaryButtonText={formatMessage(
              rcOverview.sections.caseResentModal.secondaryButtonText,
            )}
            handleSecondaryButtonClick={() => {
              setResendCaseModalVisible(false)
            }}
            handlePrimaryButtonClick={() => {
              handleNextButtonClick()
            }}
            isPrimaryButtonLoading={isSendingNotification}
            isPrimaryButtonDisabled={!caseResentExplanation}
          >
            <Box marginBottom={10}>
              <Input
                name="caseResentExplanation"
                label={formatMessage(
                  rcOverview.sections.caseResentModal.input.label,
                )}
                placeholder={formatMessage(
                  rcOverview.sections.caseResentModal.input.placeholder,
                )}
                onChange={(evt) => setCaseResentExplanation(evt.target.value)}
                textarea
                rows={7}
              />
            </Box>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modalVisible && (
          <Modal
            title={formatMessage(rcOverview.sections.modal.headingV2, {
              caseType: workingCase.type,
            })}
            text={modalText}
            handleClose={() => router.push(Constants.CASE_LIST_ROUTE)}
            handlePrimaryButtonClick={() => {
              window.open(Constants.FEEDBACK_FORM_URL, '_blank')
              router.push(Constants.CASE_LIST_ROUTE)
            }}
            handleSecondaryButtonClick={() => {
              router.push(Constants.CASE_LIST_ROUTE)
            }}
            primaryButtonText="Senda ábendingu"
            secondaryButtonText="Loka glugga"
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
