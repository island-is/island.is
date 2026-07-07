import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box } from '@island.is/island-ui/core'
import {
  COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE,
  COURT_OF_APPEAL_RESULT_ROUTE,
  COURT_OF_APPEAL_RULING_ROUTE,
} from '@island.is/judicial-system/consts'
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
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  getAppealDecision,
  useAppealCase,
  useTargetAppealCaseByAppealCaseId,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  appendAppealCaseIdQuery,
  isReopenedCOACase,
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
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()
  const { transitionAppealCase, isTransitioningAppealCase } = useAppealCase()

  const [visibleModal, setVisibleModal] = useState<ModalType>('none')

  const handleComplete = async () => {
    const caseTransitioned =
      targetAppealCase?.appealState !== AppealCaseState.COMPLETED
        ? await transitionAppealCase(
            workingCase.id,
            targetAppealCase?.id ?? '',
            AppealCaseTransition.COMPLETE_APPEAL,
            setWorkingCase,
          )
        : true

    if (caseTransitioned) {
      targetAppealCase?.appealRulingDecision ===
      AppealCaseRulingDecision.DISCONTINUED
        ? setVisibleModal('AppealDiscontinued')
        : setVisibleModal('AppealCompleted')
    }
  }

  const handleNextButtonClick = async () => {
    if (isReopenedCOACase(targetAppealCase)) {
      setVisibleModal('AppealRulingModified')
    } else {
      await handleComplete()
    }
  }

  const handleNavigationTo = (destination: string) => {
    return router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        targetAppealCase?.id,
      ),
    )
  }

  return (
    <>
      <AlertBanner
        variant="warning"
        title={formatMessage(strings.alertBannerTitle)}
        description={getAppealDecision(
          formatMessage,
          targetAppealCase?.appealRulingDecision,
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
              conclusionText={targetAppealCase?.appealConclusion}
            />
          </Box>
          <Box marginBottom={6}>
            <AppealCaseFilesOverview />
          </Box>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={appendAppealCaseIdQuery(
              shouldUseAppealWithdrawnRoutes(targetAppealCase)
                ? `${COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE}/${workingCase.id}`
                : `${COURT_OF_APPEAL_RULING_ROUTE}/${workingCase.id}`,
              targetAppealCase?.id,
            )}
            actions={[
              {
                text: formatMessage(strings.nextButtonFooter),
                icon: 'checkmark',
                onClick: async () => await handleNextButtonClick(),
                disabled: isTransitioningAppealCase,
                testId: 'continueButton',
              },
            ]}
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
                  appendAppealCaseIdQuery(
                    `${COURT_OF_APPEAL_RESULT_ROUTE}/${workingCase.id}`,
                    targetAppealCase?.id,
                  ),
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
                  appendAppealCaseIdQuery(
                    `${COURT_OF_APPEAL_RESULT_ROUTE}/${workingCase.id}`,
                    targetAppealCase?.id,
                  ),
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
