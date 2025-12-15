import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import {
  Accordion,
  AlertMessage,
  Box,
  Button,
  RadioButton,
  toast,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  ConnectedCaseFilesAccordionItem,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
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
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
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
    | 'editProsecutor'
  >('noModal')
  const [indictmentConfirmationDecision, setIndictmentConfirmationDecision] =
    useState<'confirm' | 'deny'>()
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)
  const [prosecutorsCount, setProsecutorsCount] = useState<number>(0)

  const router = useRouter()
  const { formatMessage } = useIntl()
  const { transitionCase, updateCase, isTransitioningCase } = useCase()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate

  const isIndictmentNew =
    workingCase.state === CaseState.DRAFT || modal !== 'noModal'
  const isIndictmentWaitingForConfirmation =
    workingCase.state === CaseState.WAITING_FOR_CONFIRMATION
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

  const calculateMargin = (count: number) => {
    if (count === 0) {
      return 40
    }

    const cappedCount = Math.min(count, 5)
    const baseMargin = 50
    const marginPerProsecutor = 65
    const margin = baseMargin + (cappedCount - 2) * marginPerProsecutor

    return Math.max(2, margin)
  }

  const hasLawsBroken = lawsBroken.size > 0
  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

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
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment
            displayVerdictViewDate
            onProsecutorClick={() => {
              setModal('editProsecutor')
            }}
          />
        </Box>
        {(hasLawsBroken || hasMergeCases) && (
          <Box marginBottom={5}>
            {/* 
            NOTE: Temporarily hidden while list of laws broken is not complete in
            indictment cases
            
            {hasLawsBroken && (
              <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
            )} */}
            {hasMergeCases && (
              <Accordion>
                {workingCase.mergedCases?.map((mergedCase) => (
                  <Box key={mergedCase.id}>
                    <ConnectedCaseFilesAccordionItem
                      connectedCaseParentId={workingCase.id}
                      connectedCase={mergedCase}
                    />
                  </Box>
                ))}
              </Accordion>
            )}
          </Box>
        )}
        <Box marginBottom={5}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {userCanAddDocuments && (
          <Box display="flex" justifyContent="flexEnd" marginBottom={5}>
            <Button
              size="small"
              icon="add"
              onClick={() =>
                router.push(
                  `${constants.INDICTMENTS_ADD_FILES_ROUTE}/${workingCase.id}`,
                )
              }
            >
              {formatMessage(strings.addDocumentsButtonText)}
            </Button>
          </Box>
        )}
        {userCanSendIndictmentToCourt && (
          <Box marginBottom={5}>
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
                  onChange={() => setIndictmentConfirmationDecision('confirm')}
                />
              </div>
            </BlueBox>
          </Box>
        )}
        <Box component="section" marginBottom={10}>
          <InputPenalties />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={
            isIndictmentReceived || isIndictmentWaitingForCancellation
              ? getStandardUserDashboardRoute(user)
              : `${constants.INDICTMENTS_INDICTMENT_ROUTE}/${workingCase.id}`
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
            primaryButton={{
              text: formatMessage(strings.caseSubmitPrimaryButtonText),
              onClick: handleConfirmIndictment,
              isLoading: isTransitioningCase,
            }}
            secondaryButton={{
              text: formatMessage(strings.caseSubmitSecondaryButtonText),
              onClick: () => setModal('noModal'),
            }}
          />
        ) : modal === 'caseSentForConfirmationModal' ? (
          <Modal
            title={formatMessage(strings.indictmentSentForConfirmationTitle)}
            text={formatMessage(strings.indictmentSentForConfirmationText)}
            onClose={() => router.push(getStandardUserDashboardRoute(user))}
            primaryButton={{
              text: formatMessage(core.closeModal),
              onClick: () => {
                router.push(getStandardUserDashboardRoute(user))
              },
            }}
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
            primaryButton={{
              text: formatMessage(strings.askForCancellationPrimaryButtonText),
              onClick: handleAskForCancellation,
              isLoading: isTransitioningCase,
            }}
            secondaryButton={{
              text: formatMessage(
                strings.askForCancellationSecondaryButtonText,
              ),
              onClick: () => setModal('noModal'),
            }}
          />
        ) : modal === 'editProsecutor' ? (
          <Modal
            title="Breyta um ákæranda"
            text="Nýr ákærandi mun verða skráður sem ákærandi í málinu og fá tilkynningar er það varðar."
            onClose={() => setModal('noModal')}
            primaryButton={{
              text: 'Staðfesta',
              onClick: async () => {
                const prosecutorId = workingCase?.prosecutor?.id
                await updateCase(workingCase.id, {
                  prosecutorId,
                })
                setModal('noModal')
              },
            }}
            secondaryButton={{
              text: 'Loka glugga',
              onClick: () => setModal('noModal'),
            }}
          >
            <div
              style={{
                marginBottom: menuIsOpen
                  ? calculateMargin(prosecutorsCount)
                  : 40,
              }}
            >
              <ProsecutorSelection
                placeholder="Veldu ákæranda til að taka við málinu"
                isRequired={false}
                shouldInitializeSelector={true}
                onMenuOpen={() => setMenuIsOpen(true)}
                onMenuClose={() => setMenuIsOpen(false)}
                onProsecutorsLoaded={(count) => setProsecutorsCount(count)}
              />
            </div>
          </Modal>
        ) : null}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
