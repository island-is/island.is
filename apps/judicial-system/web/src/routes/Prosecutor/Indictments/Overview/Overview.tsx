import React, { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  Box,
  RadioButton,
  Text,
  toast,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  InfoCardCaseScheduledIndictment,
  Modal,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { DefendantInfo } from '@island.is/judicial-system-web/src/components/InfoCard/DefendantInfo/DefendantInfo'
import { NameAndEmail } from '@island.is/judicial-system-web/src/components/InfoCard/InfoCard'
import InfoCardNew from '@island.is/judicial-system-web/src/components/InfoCard/InfoCard__new'
import { strings as aa } from '@island.is/judicial-system-web/src/components/InfoCard/InfoCardIndictment.strings'
import {
  CaseState,
  CaseTransition,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import DenyIndictmentCaseModal from './DenyIndictmentCaseModal/DenyIndictmentCaseModal'
import { overview as strings } from './Overview.strings'
import * as styles from './Overview.css'

const Overview: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState<
    | 'noModal'
    | 'caseSubmitModal'
    | 'caseSentForConfirmationModal'
    | 'caseDeniedModal'
    | 'askForCancellationModal'
  >('noModal')
  const [indictmentConfirmationDecision, setIndictmentConfirmationDecision] =
    useState<'confirm' | 'deny'>()
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { transitionCase, isTransitioningCase } = useCase()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate

  const isIndictmentNew = workingCase.state === CaseState.DRAFT
  const isIndictmentSubmitted = workingCase.state === CaseState.SUBMITTED
  const isIndictmentWaitingForCancellation =
    workingCase.state === CaseState.WAITING_FOR_CANCELLATION
  const isIndictmentReceived = workingCase.state === CaseState.RECEIVED

  const userCanSendIndictmentToCourt =
    Boolean(user?.canConfirmIndictment) &&
    workingCase.state === CaseState.WAITING_FOR_CONFIRMATION
  const userCanCancelIndictment =
    (workingCase.state === CaseState.SUBMITTED ||
      workingCase.state === CaseState.RECEIVED) &&
    !workingCase.indictmentDecision

  const handleTransition = async (transitionType: CaseTransition) => {
    const caseTransitioned = await transitionCase(
      workingCase.id,
      transitionType,
      setWorkingCase,
    )

    if (!caseTransitioned) {
      toast.error(formatMessage(errors.transitionCase))
      return false
    }

    return true
  }

  const handleNextButtonClick = async () => {
    let transitionType
    let modalType: typeof modal = 'noModal'

    if (userCanSendIndictmentToCourt) {
      if (indictmentConfirmationDecision === 'confirm') {
        modalType = 'caseSubmitModal'
      } else if (indictmentConfirmationDecision === 'deny') {
        modalType = 'caseDeniedModal'
      } else if (isIndictmentSubmitted) {
        transitionType = CaseTransition.ASK_FOR_CONFIRMATION
      }
    } else if (isIndictmentNew || isIndictmentSubmitted) {
      transitionType = CaseTransition.ASK_FOR_CONFIRMATION
      modalType = 'caseSentForConfirmationModal'
    } else if (workingCase.state === CaseState.WAITING_FOR_CONFIRMATION) {
      modalType = 'caseSentForConfirmationModal'
    }

    if (transitionType) {
      const transitionSuccess = await handleTransition(transitionType)

      if (!transitionSuccess) {
        return
      }
    }

    if (modalType !== 'noModal') {
      setModal(modalType)
    }
  }

  const handleConfirmIndictment = async () => {
    const transitionSuccess = await handleTransition(CaseTransition.SUBMIT)

    if (!transitionSuccess) {
      return
    }

    router.push(constants.CASES_ROUTE)
  }

  const handleAskForCancellation = async () => {
    const transitionSuccess = await handleTransition(
      CaseTransition.ASK_FOR_CANCELLATION,
    )

    if (!transitionSuccess) {
      return
    }

    router.push(constants.CASES_ROUTE)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.overview)}
      />
      <FormContentContainer>
        {workingCase.indictmentDeniedExplanation && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(strings.indictmentDeniedExplanationTitle)}
              message={workingCase.indictmentDeniedExplanation}
              type="info"
            />
          </Box>
        )}
        {workingCase.indictmentReturnedExplanation && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(strings.indictmentReturnedExplanationTitle)}
              message={workingCase.indictmentReturnedExplanation}
              type="warning"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        {workingCase.court &&
          latestDate?.date &&
          workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
          workingCase.indictmentDecision !==
            IndictmentDecision.REDISTRIBUTING && (
            <Box component="section" marginBottom={5}>
              <InfoCardCaseScheduledIndictment
                court={workingCase.court}
                indictmentDecision={workingCase.indictmentDecision}
                courtDate={latestDate.date}
                courtRoom={latestDate.location}
                postponedIndefinitelyExplanation={
                  workingCase.postponedIndefinitelyExplanation
                }
                courtSessionType={workingCase.courtSessionType}
              />
            </Box>
          )}
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment />
          <InfoCardNew
            sections={[
              ...(workingCase.defendants
                ? [
                    {
                      id: 'defendant-section',
                      items: [
                        {
                          id: 'defendant-item',
                          title: capitalize(
                            workingCase.defendants.length > 1
                              ? formatMessage(core.indictmentDefendants)
                              : formatMessage(core.indictmentDefendant, {
                                  gender: workingCase.defendants[0].gender,
                                }),
                          ),
                          values: workingCase.defendants.map((defendant) => (
                            <DefendantInfo
                              defendant={defendant}
                              displayDefenderInfo
                            />
                          )),
                        },
                      ],
                    },
                  ]
                : []),
              {
                id: 'case-info-section',
                items: [
                  {
                    title: formatMessage(strings.indictmentCreated),
                    values: [formatDate(workingCase.created, 'PP')],
                    id: 'indictment-created-item',
                  },
                  {
                    title: formatMessage(strings.prosecutor),
                    values: [
                      NameAndEmail(
                        workingCase.prosecutor?.name,
                        workingCase.prosecutor?.email,
                      ),
                    ],
                    id: 'prosector-item',
                  },
                  {
                    title: formatMessage(core.policeCaseNumber),
                    values:
                      workingCase.policeCaseNumbers?.map((n) => (
                        <Text key={n}>{n}</Text>
                      )) || [],
                    id: 'police-case-number-item',
                  },
                  {
                    title: formatMessage(core.court),
                    values: [workingCase.court?.name || ''],
                    id: 'court-item',
                  },
                  {
                    title: formatMessage(aa.offence),
                    values: [
                      <>
                        {readableIndictmentSubtypes(
                          workingCase.policeCaseNumbers,
                          workingCase.indictmentSubtypes,
                        ).map((subtype, index) => (
                          <Text key={`${subtype}-${index}`}>
                            {capitalize(subtype)}
                          </Text>
                        ))}
                      </>,
                    ],
                    id: 'offence-item',
                  },
                ],
                columns: 2,
              },
              ...(workingCase.mergedCases && workingCase.mergedCases.length > 0
                ? workingCase.mergedCases.map((mergedCase) => ({
                    id: mergedCase.id,
                    items: [
                      {
                        id: 'merged-case-police-case-number-item',
                        title: formatMessage(core.policeCaseNumber),
                        values:
                          mergedCase.policeCaseNumbers?.map((n) => (
                            <Text key={n}>{n}</Text>
                          )) || [],
                      },
                      {
                        id: 'merged-case-court-case-number-item',
                        title: formatMessage(aa.mergedFromTitle),
                        values: [<Text>{mergedCase.courtCaseNumber}</Text>],
                      },
                      {
                        id: 'merged-case-prosecutor-item',
                        title: formatMessage(core.prosecutor),
                        values: [mergedCase.prosecutorsOffice?.name || ''],
                      },
                      {
                        id: 'merged-case-judge-item',
                        title: formatMessage(core.judge),
                        values: [mergedCase.judge?.name || ''],
                      },
                      {
                        id: 'merged-case-court-item',
                        title: formatMessage(core.court),
                        values: [mergedCase.court?.name || ''],
                      },
                    ],
                    columns: 2,
                  }))
                : []),
            ]}
          />
        </Box>
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )}
        <Box marginBottom={userCanSendIndictmentToCourt ? 5 : 10}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {userCanSendIndictmentToCourt && (
          <Box marginBottom={10}>
            <SectionHeading
              title={formatMessage(strings.indictmentConfirmationTitle)}
              required
            />
            <BlueBox>
              <div className={styles.gridRowEqual}>
                <RadioButton
                  large
                  name="indictmentConfirmationRequest"
                  id="confirmIndictment"
                  backgroundColor="white"
                  label={formatMessage(strings.confirmIndictment)}
                  checked={indictmentConfirmationDecision === 'confirm'}
                  onChange={() => setIndictmentConfirmationDecision('confirm')}
                />
                <RadioButton
                  large
                  name="indictmentConfirmationRequest"
                  id="denyIndictment"
                  backgroundColor="white"
                  label={formatMessage(strings.denyIndictment)}
                  checked={indictmentConfirmationDecision === 'deny'}
                  onChange={() => setIndictmentConfirmationDecision('deny')}
                />
              </div>
            </BlueBox>
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={
            isIndictmentReceived || isIndictmentWaitingForCancellation
              ? constants.CASES_ROUTE
              : `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`
          }
          nextButtonText={
            userCanSendIndictmentToCourt
              ? undefined
              : formatMessage(strings.nextButtonText, {
                  isNewIndictment: isIndictmentNew,
                })
          }
          hideNextButton={
            isIndictmentReceived || isIndictmentWaitingForCancellation
          }
          infoBoxText={
            isIndictmentReceived
              ? formatMessage(strings.indictmentSentToCourt)
              : undefined
          }
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={
            userCanSendIndictmentToCourt && !indictmentConfirmationDecision
          }
          hideActionButton={isIndictmentWaitingForCancellation}
          actionButtonText={formatMessage(strings.askForCancellationButtonText)}
          actionButtonColorScheme="destructive"
          actionButtonIsDisabled={!userCanCancelIndictment}
          onActionButtonClick={() => setModal('askForCancellationModal')}
        />
      </FormContentContainer>
      <AnimatePresence>
        {modal === 'caseSubmitModal' ? (
          <Modal
            title={formatMessage(strings.caseSubmitModalTitle)}
            text={formatMessage(strings.caseSubmitModalText)}
            onClose={() => setModal('noModal')}
            secondaryButtonText={formatMessage(
              strings.caseSubmitSecondaryButtonText,
            )}
            onSecondaryButtonClick={() => setModal('noModal')}
            onPrimaryButtonClick={handleConfirmIndictment}
            primaryButtonText={formatMessage(
              strings.caseSubmitPrimaryButtonText,
            )}
            isPrimaryButtonLoading={isTransitioningCase}
          />
        ) : modal === 'caseSentForConfirmationModal' ? (
          <Modal
            title={formatMessage(strings.indictmentSentForConfirmationTitle)}
            text={formatMessage(strings.indictmentSentForConfirmationText)}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onPrimaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            primaryButtonText={formatMessage(core.closeModal)}
          />
        ) : modal === 'caseDeniedModal' ? (
          <DenyIndictmentCaseModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            onClose={() => setModal('noModal')}
            onComplete={() => router.push(constants.CASES_ROUTE)}
          />
        ) : modal === 'askForCancellationModal' ? (
          <Modal
            title={formatMessage(strings.askForCancellationModalTitle)}
            text={formatMessage(strings.askForCancellationModalText)}
            onClose={() => setModal('noModal')}
            secondaryButtonText={formatMessage(
              strings.askForCancellationSecondaryButtonText,
            )}
            onSecondaryButtonClick={() => setModal('noModal')}
            onPrimaryButtonClick={handleAskForCancellation}
            primaryButtonText={formatMessage(
              strings.askForCancellationPrimaryButtonText,
            )}
            isPrimaryButtonLoading={isTransitioningCase}
          />
        ) : null}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
