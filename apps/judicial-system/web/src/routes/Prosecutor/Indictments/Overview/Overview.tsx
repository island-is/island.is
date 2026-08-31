import type { FC } from 'react'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  RadioButton,
  Text,
  toast,
} from '@island.is/island-ui/core'
import {
  getStandardUserDashboardRoute,
  PROSECUTION_INDICTMENT_CASE_ADD_FILES_ROUTE,
  PROSECUTION_INDICTMENT_CASE_INDICTMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import type { FormFooterAction } from '@island.is/judicial-system-web/src/components'
import {
  AllIndictmentCaseFiles,
  AppealRulingModifiedAlert,
  BlueBox,
  ChangeProsecutorModal,
  DuplicateIndictmentModal,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseScheduledCard,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardActiveIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  ProsecutorSelection,
  SectionHeading,
  ServiceAnnouncements,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
import {
  CaseState,
  CaseTransition,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import DenyIndictmentCaseModal from './DenyIndictmentCaseModal/DenyIndictmentCaseModal'
import ReturnIndictmentModal from './ReturnIndictmentModal/ReturnIndictmentModal'
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
    | 'caseSentForReviewModal'
    | 'caseReviewedModal'
    | 'reviewDeniedModal'
    | 'recallReviewModal'
    | 'caseDeniedModal'
    | 'askForCancellationModal'
    | 'duplicateIndictmentModal'
    | 'editProsecutor'
  >('noModal')
  const [indictmentConfirmationDecision, setIndictmentConfirmationDecision] =
    useState<'confirm' | 'deny'>()
  const [wantsReview, setWantsReview] = useState(false)
  const [selectedApproverId, setSelectedApproverId] = useState<string>()
  const [reviewDecision, setReviewDecision] = useState<'accept' | 'deny'>()

  const router = useRouter()
  const { formatMessage } = useIntl()
  const { updateCase, transitionCase, isTransitioningCase } = useCase()

  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate

  const isIndictmentNew =
    workingCase.state === CaseState.DRAFT || modal !== 'noModal'
  const isIndictmentWaitingForConfirmation =
    workingCase.state === CaseState.WAITING_FOR_CONFIRMATION
  const isIndictmentWaitingForReview =
    workingCase.state === CaseState.WAITING_FOR_REVIEW
  const isIndictmentSubmitted = workingCase.state === CaseState.SUBMITTED
  const isIndictmentWaitingForCancellation =
    workingCase.state === CaseState.WAITING_FOR_CANCELLATION
  const isIndictmentReceived = workingCase.state === CaseState.RECEIVED

  const userCanSendIndictmentToCourt =
    Boolean(user?.canConfirmIndictment) &&
    isIndictmentWaitingForConfirmation &&
    modal === 'noModal'
  const userCanCancelIndictment =
    (isIndictmentSubmitted || isIndictmentReceived) &&
    !workingCase.indictmentDecision
  const userIsReviewer =
    isIndictmentWaitingForReview &&
    user?.id === workingCase.indictmentApprover?.id &&
    modal === 'noModal'
  const userCanRecallReview =
    isIndictmentWaitingForReview &&
    user?.id === workingCase.prosecutor?.id &&
    user?.id !== workingCase.indictmentApprover?.id &&
    modal === 'noModal'
  const canDuplicateIndictment =
    isProsecutionUser(user) && isIndictmentWaitingForCancellation
  const userCanAddDocuments =
    isIndictmentSubmitted ||
    (isIndictmentReceived &&
      workingCase.indictmentDecision !==
        IndictmentDecision.POSTPONING_UNTIL_VERDICT &&
      workingCase.indictmentDecision !== IndictmentDecision.COMPLETING)

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

  const handleSendForReview = async () => {
    if (!selectedApproverId) {
      return
    }

    const updatedCase = await updateCase(workingCase.id, {
      indictmentApproverId: selectedApproverId,
    })

    if (!updatedCase) {
      return
    }

    const transitioned = await handleTransition(CaseTransition.ASK_FOR_REVIEW)

    if (transitioned) {
      setModal('caseSentForReviewModal')
    }
  }

  const handleAcceptReview = async () => {
    const transitioned = await handleTransition(CaseTransition.ACCEPT_REVIEW)

    if (transitioned) {
      router.push(getStandardUserDashboardRoute(user))
    }
  }

  const handleNextButtonClick = async () => {
    if (userIsReviewer) {
      if (reviewDecision === 'accept') {
        setModal('caseReviewedModal')
      } else if (reviewDecision === 'deny') {
        setModal('reviewDeniedModal')
      }
      return
    }

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
      if (wantsReview && isIndictmentNew) {
        await handleSendForReview()
        return
      }
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

    router.push(getStandardUserDashboardRoute(user))
  }

  const handleAskForCancellation = async () => {
    const transitionSuccess = await handleTransition(
      CaseTransition.ASK_FOR_CANCELLATION,
    )

    if (!transitionSuccess) {
      return
    }

    router.push(getStandardUserDashboardRoute(user))
  }

  const handleRecallReview = async () => {
    const transitionSuccess = await handleTransition(CaseTransition.DENY_REVIEW)

    if (!transitionSuccess) {
      return
    }

    router.push(getStandardUserDashboardRoute(user))
  }

  const footerActions: FormFooterAction[] = [
    ...(isIndictmentWaitingForCancellation
      ? []
      : [
          {
            text: formatMessage(strings.askForCancellationButtonText),
            variant: 'ghost' as const,
            colorScheme: 'destructive' as const,
            onClick: () => setModal('askForCancellationModal'),
            disabled: !userCanCancelIndictment,
          },
        ]),
    ...(isIndictmentReceived ||
    (isIndictmentWaitingForCancellation && !canDuplicateIndictment)
      ? []
      : userCanRecallReview
      ? [
          {
            text: 'Afturkalla yfirlestur',
            onClick: () => setModal('recallReviewModal'),
            loading: isTransitioningCase,
            testId: 'recallReviewButton',
          },
        ]
      : isIndictmentWaitingForReview && !userIsReviewer
      ? []
      : [
          {
            text: canDuplicateIndictment
              ? 'Afrita mál í drög'
              : userIsReviewer
              ? formatMessage(core.continue)
              : userCanSendIndictmentToCourt
              ? formatMessage(core.continue)
              : wantsReview && isIndictmentNew
              ? 'Senda í yfirlestur'
              : formatMessage(strings.nextButtonText, {
                  isNewIndictment: isIndictmentNew,
                }),
            icon: canDuplicateIndictment
              ? undefined
              : ('arrowForward' as const),
            onClick: canDuplicateIndictment
              ? () => setModal('duplicateIndictmentModal')
              : handleNextButtonClick,
            disabled: userIsReviewer
              ? !reviewDecision
              : wantsReview && isIndictmentNew
              ? !selectedApproverId
              : userCanSendIndictmentToCourt && !indictmentConfirmationDecision,
            loading: isTransitioningCase,
            testId: 'continueButton',
          },
        ]),
  ]

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
        {workingCase.indictmentReviewReturnedExplanation && (
          <Box marginBottom={5}>
            <AlertMessage
              title="Athugasemdir úr yfirlestri"
              message={workingCase.indictmentReviewReturnedExplanation}
              type="info"
            />
          </Box>
        )}
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
        {workingCase.state === CaseState.WAITING_FOR_CANCELLATION && (
          <Box marginBottom={2}>
            <AlertMessage
              title={formatMessage(strings.indictmentCancelledTitle)}
              message={formatMessage(strings.indictmentCancelledMessage)}
              type="warning"
            />
          </Box>
        )}
        {isIndictmentWaitingForReview &&
          user?.id !== workingCase.indictmentApprover?.id && (
            <Box marginBottom={2}>
              <AlertMessage
                title="Ákæra bíður yfirlesturs"
                message={
                  workingCase.indictmentApprover?.name
                    ? `Ákæran bíður yfirlesturs hjá ${workingCase.indictmentApprover.name}.`
                    : 'Ákæran bíður yfirlesturs.'
                }
                type="info"
              />
            </Box>
          )}
        {workingCase.reopenReason && !isCompletedCase(workingCase.state) && (
          <Box marginBottom={2}>
            <AlertMessage
              title="Mál enduropnað"
              message={
                <Text variant="small" whiteSpace="preWrap">
                  {workingCase.reopenReason}
                </Text>
              }
              type="info"
            />
          </Box>
        )}
        <ServiceAnnouncements defendants={workingCase.defendants} />
        {workingCase.court &&
          latestDate?.date &&
          workingCase.state !== CaseState.WAITING_FOR_CANCELLATION &&
          workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
          workingCase.indictmentDecision !==
            IndictmentDecision.REDISTRIBUTING && (
            <Box component="section" marginBottom={5}>
              <IndictmentCaseScheduledCard
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
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <AppealRulingModifiedAlert />
          <Box component="section">
            <InfoCardActiveIndictment
              displayVerdictViewDate
              onProsecutorClick={
                userIsReviewer
                  ? undefined
                  : () => {
                      setModal('editProsecutor')
                    }
              }
            />
          </Box>
          <AllIndictmentCaseFiles
            forceDisplayAdditionalFiles={userCanAddDocuments}
          />
          {userCanAddDocuments && (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                size="small"
                icon="add"
                onClick={() =>
                  router.push(
                    `${PROSECUTION_INDICTMENT_CASE_ADD_FILES_ROUTE}/${workingCase.id}`,
                  )
                }
              >
                {formatMessage(strings.addDocumentsButtonText)}
              </Button>
            </Box>
          )}
          {isIndictmentNew &&
            !userCanSendIndictmentToCourt &&
            !userIsReviewer &&
            !isIndictmentWaitingForReview && (
              <Box component="section">
                <SectionHeading title="Yfirlestur" />
                <BlueBox>
                  <Box marginBottom={wantsReview ? 3 : 0}>
                    <Checkbox
                      name="wantsReview"
                      label="Senda í yfirlestur"
                      checked={wantsReview}
                      onChange={(event) => setWantsReview(event.target.checked)}
                      large
                      filled
                      backgroundColor="white"
                    />
                  </Box>
                  {wantsReview && (
                    <Box>
                      <ProsecutorSelection
                        placeholder="Veldu yfirlesara"
                        isRequired={false}
                        shouldInitializeSelector={true}
                        excludeUserId={user?.id}
                        onChange={(prosecutorId) =>
                          setSelectedApproverId(prosecutorId)
                        }
                      />
                    </Box>
                  )}
                </BlueBox>
              </Box>
            )}
          {userIsReviewer && (
            <Box component="section">
              <SectionHeading title="Niðurstaða yfirlesturs" required />
              <BlueBox>
                <div className={styles.gridRowEqual}>
                  <RadioButton
                    large
                    name="reviewDecision"
                    id="denyReview"
                    backgroundColor="white"
                    label="Senda ákæru til baka"
                    checked={reviewDecision === 'deny'}
                    onChange={() => setReviewDecision('deny')}
                  />
                  <RadioButton
                    large
                    name="reviewDecision"
                    id="acceptReview"
                    backgroundColor="white"
                    label="Samþykkja ákæru"
                    checked={reviewDecision === 'accept'}
                    onChange={() => setReviewDecision('accept')}
                  />
                </div>
              </BlueBox>
            </Box>
          )}
          {userCanSendIndictmentToCourt && (
            <Box component="section">
              <SectionHeading
                title={formatMessage(strings.indictmentConfirmationTitle)}
                required
              />
              <BlueBox>
                <div className={styles.gridRowEqual}>
                  <RadioButton
                    large
                    name="indictmentConfirmationRequest"
                    id="denyIndictment"
                    backgroundColor="white"
                    label={formatMessage(strings.denyIndictment)}
                    checked={indictmentConfirmationDecision === 'deny'}
                    onChange={() => setIndictmentConfirmationDecision('deny')}
                  />
                  <RadioButton
                    large
                    name="indictmentConfirmationRequest"
                    id="confirmIndictment"
                    backgroundColor="white"
                    label={formatMessage(strings.confirmIndictment)}
                    checked={indictmentConfirmationDecision === 'confirm'}
                    onChange={() =>
                      setIndictmentConfirmationDecision('confirm')
                    }
                  />
                </div>
              </BlueBox>
            </Box>
          )}
          {!userIsReviewer && (
            <Box component="section">
              <InputPenalties />
            </Box>
          )}
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={
            isIndictmentReceived ||
            isIndictmentWaitingForCancellation ||
            isIndictmentWaitingForReview
              ? getStandardUserDashboardRoute(user)
              : `${PROSECUTION_INDICTMENT_CASE_INDICTMENT_ROUTE}/${workingCase.id}`
          }
          actions={footerActions}
          infoBoxText={
            isIndictmentReceived
              ? formatMessage(strings.indictmentSentToCourt)
              : undefined
          }
        />
      </FormContentContainer>
      <AnimatePresence>
        {modal === 'caseSubmitModal' ? (
          <Modal
            title={formatMessage(strings.caseSubmitModalTitle)}
            text={formatMessage(strings.caseSubmitModalText)}
            onClose={() => setModal('noModal')}
            buttons={[
              {
                text: formatMessage(strings.caseSubmitSecondaryButtonText),
                onClick: () => setModal('noModal'),
                variant: 'ghost',
              },
              {
                text: formatMessage(strings.caseSubmitPrimaryButtonText),
                onClick: handleConfirmIndictment,
                isLoading: isTransitioningCase,
              },
            ]}
          />
        ) : modal === 'caseSentForConfirmationModal' ? (
          <Modal
            title={formatMessage(strings.indictmentSentForConfirmationTitle)}
            text={formatMessage(strings.indictmentSentForConfirmationText)}
            onClose={() => router.push(getStandardUserDashboardRoute(user))}
            buttons={[
              {
                text: formatMessage(core.closeModal),
                onClick: () => {
                  router.push(getStandardUserDashboardRoute(user))
                },
              },
            ]}
          />
        ) : modal === 'caseSentForReviewModal' ? (
          <Modal
            title="Ákæra hefur verið send í yfirlestur"
            text="Yfirlesari fær tilkynningu og mun fara yfir ákæruna."
            onClose={() => router.push(getStandardUserDashboardRoute(user))}
            buttons={[
              {
                text: formatMessage(core.closeModal),
                onClick: () => router.push(getStandardUserDashboardRoute(user)),
              },
            ]}
          />
        ) : modal === 'caseReviewedModal' ? (
          <Modal
            title="Samþykkja ákæru"
            text="Ákæran verður send til staðfestingar hjá lögreglustjóra."
            onClose={() => setModal('noModal')}
            buttons={[
              {
                text: 'Hætta við',
                onClick: () => setModal('noModal'),
                variant: 'ghost',
              },
              {
                text: 'Senda til staðfestingar',
                onClick: handleAcceptReview,
                isLoading: isTransitioningCase,
              },
            ]}
          />
        ) : modal === 'reviewDeniedModal' ? (
          <ReturnIndictmentModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            onClose={() => setModal('noModal')}
            onComplete={() => router.push(getStandardUserDashboardRoute(user))}
          />
        ) : modal === 'recallReviewModal' ? (
          <Modal
            title="Afturkalla yfirlestur"
            text="Ákæran verður afturkölluð úr yfirlestri og færist aftur í drög."
            onClose={() => setModal('noModal')}
            buttons={[
              {
                text: 'Hætta við',
                onClick: () => setModal('noModal'),
                variant: 'ghost',
              },
              {
                text: 'Afturkalla',
                onClick: handleRecallReview,
                isLoading: isTransitioningCase,
              },
            ]}
          />
        ) : modal === 'caseDeniedModal' ? (
          <DenyIndictmentCaseModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            onClose={() => setModal('noModal')}
            onComplete={() => router.push(getStandardUserDashboardRoute(user))}
          />
        ) : modal === 'askForCancellationModal' ? (
          <Modal
            title={formatMessage(strings.askForCancellationModalTitle)}
            text={formatMessage(strings.askForCancellationModalText)}
            onClose={() => setModal('noModal')}
            buttons={[
              {
                text: formatMessage(
                  strings.askForCancellationSecondaryButtonText,
                ),
                onClick: () => setModal('noModal'),
                variant: 'ghost',
              },
              {
                text: formatMessage(
                  strings.askForCancellationPrimaryButtonText,
                ),
                onClick: handleAskForCancellation,
                isLoading: isTransitioningCase,
              },
            ]}
          />
        ) : modal === 'duplicateIndictmentModal' ? (
          <DuplicateIndictmentModal onClose={() => setModal('noModal')} />
        ) : modal === 'editProsecutor' ? (
          <ChangeProsecutorModal onClose={() => setModal('noModal')} />
        ) : null}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
