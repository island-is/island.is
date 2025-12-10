import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  AppealCaseFilesOverview,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  getAppealDecision,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  hasSentNotification,
  shouldUseAppealWithdrawnRoutes,
} from '@island.is/judicial-system-web/src/utils/utils'

import { CaseNumbers } from '../components'
import RulingModifiedModal from './RulingModifiedModal/RulingModifiedModal'
import { strings } from './Summary.strings'

type ModalType =
  | 'AppealCompleted'
  | 'AppealRulingModified'
  | 'AppealDiscontinued'
  | 'none'

const Summary: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { transitionCase, isTransitioningCase } = useCase()

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
      workingCase.appealRulingDecision === CaseAppealRulingDecision.DISCONTINUED
        ? setVisibleModal('AppealDiscontinued')
        : setVisibleModal('AppealCompleted')
    }
  }

  const handleNextButtonClick = async () => {
    if (
      hasSentNotification(
        NotificationType.APPEAL_COMPLETED,
        workingCase.notifications,
      ).hasSent
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
            previousUrl={
              shouldUseAppealWithdrawnRoutes(workingCase)
                ? `${constants.COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE}/${workingCase.id}`
                : `${constants.COURT_OF_APPEAL_RULING_ROUTE}/${workingCase.id}`
            }
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
            secondaryButton={{
              text: formatMessage(core.closeModal),
              onClick: () => {
                router.push(
                  `${constants.COURT_OF_APPEAL_RESULT_ROUTE}/${workingCase.id}`,
                )
              },
            }}
          />
        )}
        {visibleModal === 'AppealRulingModified' && (
          <RulingModifiedModal
            onCancel={() => setVisibleModal('none')}
            onContinue={handleComplete}
          />
        )}
        {visibleModal === 'AppealDiscontinued' && (
          <Modal
            title={formatMessage(strings.appealDiscontinuedModalTitle)}
            text={formatMessage(strings.appealDiscontinuedModalText)}
            secondaryButton={{
              text: formatMessage(core.closeModal),
              onClick: () => {
                router.push(
                  `${constants.COURT_OF_APPEAL_RESULT_ROUTE}/${workingCase.id}`,
                )
              },
            }}
          />
        )}
      </PageLayout>
    </>
  )
}

export default Summary
