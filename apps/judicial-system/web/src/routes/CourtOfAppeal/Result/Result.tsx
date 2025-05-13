import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { AlertBanner, AlertMessage, Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
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
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'
import CaseOverviewHeader from '../components/CaseOverviewHeader/CaseOverviewHeader'
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
            <Box marginBottom={5}>
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
            </Box>
          )}
          <Box marginBottom={5}>
            <InfoCard
              sections={[
                {
                  id: 'defendants-section',
                  items: [defendants(workingCase.type)],
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
          </Box>
          {user ? (
            <Box marginBottom={3}>
              <CaseFilesAccordionItem
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                user={user}
              />
            </Box>
          ) : null}
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
          <CaseFilesOverview />
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={constants.COURT_OF_APPEAL_CASES_ROUTE}
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
