import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { isInvestigationCase } from '@island.is/judicial-system/types'
import {
  AlertBanner,
  CaseFilesAccordionItem,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import useInfoCardItems from '@island.is/judicial-system-web/src/components/InfoCard/useInfoCardItems'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { shouldUseAppealWithdrawnRoutes } from '@island.is/judicial-system-web/src/utils/utils'

import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'
import CaseOverviewHeader from '../components/CaseOverviewHeader/CaseOverviewHeader'
import { overview as strings } from './Overview.strings'

const CourtOfAppealOverview = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { title, description, isLoadingAppealBanner } =
    useAppealAlertBanner(workingCase)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { user } = useContext(UserContext)
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
    victims,
    showItem,
  } = useInfoCardItems()

  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

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
        onNavigationTo={handleNavigationTo}
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
          <CaseFilesOverview />
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={constants.COURT_OF_APPEAL_CASES_ROUTE}
            onNextButtonClick={() =>
              handleNavigationTo(
                shouldUseAppealWithdrawnRoutes(workingCase)
                  ? constants.COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE
                  : constants.COURT_OF_APPEAL_CASE_ROUTE,
              )
            }
            nextButtonIcon="arrowForward"
          />
        </FormContentContainer>
      </PageLayout>
    </>
  )
}

export default CourtOfAppealOverview
