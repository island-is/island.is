import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseAppealState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  AppealCaseFilesOverview,
  Conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  RulingModifiedModal,
} from '@island.is/judicial-system-web/src/components'
import { conclusion } from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion.strings'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { getAppealDecision } from '@island.is/judicial-system-web/src/utils/hooks/useAppealAlertBanner'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'

import CaseNumbers from '../components/CaseNumbers/CaseNumbers'
import { strings } from './Summary.strings'

type ModalType = 'AppealCompleted' | 'AppealRulingModified' | 'none'

const Summary: React.FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const { transitionCase, isTransitioningCase } = useCase()
  const router = useRouter()
  const [visibleModal, setVisibleModal] = useState<ModalType>('none')

  const handleComplete = async () => {
    const caseTransitioned =
      workingCase.appealState !== CaseAppealState.COMPLETED
        ? await transitionCase(
            workingCase.id,
            CaseTransition.COMPLETE_APPEAL,
            setWorkingCase,
          )
        : true

    if (caseTransitioned) {
      setVisibleModal('AppealCompleted')
    }
  }

  const handleNextButtonClick = async () => {
    if (
      hasSentNotification(
        NotificationType.APPEAL_COMPLETED,
        workingCase.notifications,
      )
    ) {
      setVisibleModal('AppealRulingModified')
    } else {
      await handleComplete()
    }
  }

  const handleNavigationTo = (destination: string) => {
    return router.push(`${destination}/${workingCase.id}`)
  }

  return (
    <>
      <AlertBanner
        variant="warning"
        title={formatMessage(strings.alertBannerTitle)}
        description={getAppealDecision(
          formatMessage,
          workingCase.appealRulingDecision,
        )}
      />
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
        onNavigationTo={handleNavigationTo}
      >
        <PageHeader title={formatMessage(strings.htmlTitle)} />
        <FormContentContainer>
          <PageTitle>{formatMessage(strings.title)}</PageTitle>
          <CaseNumbers />
          <Box marginBottom={6}>
            <Conclusion
              title={formatMessage(conclusion.title)}
              conclusionText={workingCase.conclusion}
              judgeName={workingCase.judge?.name}
            />
          </Box>
          <Box marginBottom={6}>
            <Conclusion
              title={formatMessage(conclusion.appealTitle)}
              conclusionText={workingCase.appealConclusion}
            />
          </Box>
          <AppealCaseFilesOverview />
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={`${constants.COURT_OF_APPEAL_RULING_ROUTE}/${workingCase.id}`}
            nextButtonIcon="checkmark"
            nextButtonText={formatMessage(strings.nextButtonFooter)}
            onNextButtonClick={async () => await handleNextButtonClick()}
            nextIsDisabled={isTransitioningCase}
          />
        </FormContentContainer>
        {visibleModal === 'AppealCompleted' && (
          <Modal
            title={formatMessage(strings.appealCompletedModalTitle)}
            text={formatMessage(strings.appealCompletedModalText)}
            secondaryButtonText={formatMessage(core.closeModal)}
            onClose={() => setVisibleModal('none')}
            onSecondaryButtonClick={() => {
              router.push(
                `${constants.COURT_OF_APPEAL_RESULT_ROUTE}/${workingCase.id}`,
              )
            }}
          />
        )}
        {visibleModal === 'AppealRulingModified' && (
          <RulingModifiedModal
            onCancel={() => setVisibleModal('none')}
            onContinue={handleComplete}
            continueDisabled={isTransitioningCase}
          />
        )}
      </PageLayout>
    </>
  )
}

export default Summary
