import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { AlertBanner, AlertMessage } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { isInvestigationCase } from '@island.is/judicial-system/types'
import {
  CaseFilesAccordionItem,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  MarkdownWrapper,
  PageHeader,
  PageLayout,
  ReopenModal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import useInfoCardItems from '@island.is/judicial-system-web/src/components/InfoCard/useInfoCardItems'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import { CaseFilesOverview, CaseOverviewHeader } from '../components'
import { result as strings } from './Result.strings'

type modalTypes = 'reopenCase' | 'none'

const CourtOfAppealResult = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [modalVisible, setModalVisible] = useState<modalTypes>('none')

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { title, description, isLoadingAppealBanner } =
    useAppealAlertBanner(workingCase)
  const {
    defendants,
    policeCaseNumbers,
    courtCaseNumber,
    prosecutor,
    prosecutorsOffice,
    court,
    judge,
    registrar,
    caseType,
    appealCaseNumber,
    appealAssistant,
    appealJudges,
    victims,
    showItem,
  } = useInfoCardItems()

  return (
    <>
      {!isLoadingAppealBanner && (
        <AlertBanner
          variant="warning"
          title={title}
          description={description}
        />
      )}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <div className={grid({ gap: 5, marginBottom: 10 })}>
            <CaseOverviewHeader
              alerts={
                workingCase.requestAppealRulingNotToBePublished
                  ? [
                      {
                        message: formatMessage(
                          strings.requestAppealRulingNotToBePublished,
                        ),
                      },
                    ]
                  : undefined
              }
            />
            {workingCase.appealRulingModifiedHistory && (
              <AlertMessage
                type="info"
                title={formatMessage(strings.rulingModifiedTitle)}
                message={
                  <MarkdownWrapper
                    markdown={workingCase.appealRulingModifiedHistory}
                    textProps={{ variant: 'small' }}
                  />
                }
              />
            )}
            <InfoCard
              sections={[
                {
                  id: 'defendants-section',
                  items: [defendants({ caseType: workingCase.type })],
                },
                ...(showItem(victims)
                  ? [
                      {
                        id: 'victims-section',
                        items: [victims],
                      },
                    ]
                  : []),
                {
                  id: 'case-info-section',
                  items: [
                    policeCaseNumbers,
                    courtCaseNumber,
                    prosecutorsOffice,
                    court,
                    prosecutor(workingCase.type),
                    judge,
                    ...(isInvestigationCase(workingCase.type)
                      ? [caseType]
                      : []),
                    ...(workingCase.registrar ? [registrar] : []),
                  ],
                  columns: 2,
                },
                {
                  id: 'court-of-appeal-section',
                  items: [appealCaseNumber, appealAssistant, appealJudges],
                  columns: 2,
                },
              ]}
            />
            {user ? (
              <CaseFilesAccordionItem
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                user={user}
              />
            ) : null}
            <Conclusion
              title={formatMessage(conclusion.title)}
              conclusionText={workingCase.conclusion}
              judgeName={workingCase.judge?.name}
            />
            <Conclusion
              title={formatMessage(conclusion.appealTitle)}
              conclusionText={workingCase.appealConclusion}
            />
            <CaseFilesOverview />
          </div>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            nextButtonText={formatMessage(strings.nextButtonText)}
            onNextButtonClick={() => setModalVisible('reopenCase')}
          />
        </FormContentContainer>
      </PageLayout>
      {modalVisible === 'reopenCase' && (
        <ReopenModal onClose={() => setModalVisible('none')} />
      )}
    </>
  )
}

export default CourtOfAppealResult
