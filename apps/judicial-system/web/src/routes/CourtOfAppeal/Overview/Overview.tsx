import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion } from '@island.is/island-ui/core'
import {
  COURT_OF_APPEAL_CASE_ROUTE,
  COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE,
  getStandardUserDashboardRoute,
} from '@island.is/judicial-system/consts'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  AllIndictmentCaseFiles,
  CaseFilesAccordionItem,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  InfoCardRequestCase,
  PageHeader,
  PageLayout,
  PoliceDigitalCaseFilesAccordionItem,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseFilesOverview,
  CaseOverviewHeader,
} from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/components'
import {
  useAppealCaseBanner,
  usePoliceDigitalCaseFile,
  useTargetAppealCaseByAppealCaseId,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import {
  appendAppealCaseIdQuery,
  shouldUseAppealWithdrawnRoutes,
} from '@island.is/judicial-system-web/src/utils/utils'

import { overview as strings } from './Overview.strings'

const Overview = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { appealBanner } = useAppealCaseBanner()
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { digitalCaseFiles, digitalCaseFilesLoading, openDigitalCaseFileUrl } =
    usePoliceDigitalCaseFile()

  const handleNavigationTo = (destination: string) =>
    router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        targetAppealCase?.id,
      ),
    )

  const isIndictment = isIndictmentCase(workingCase.type)

  return (
    <>
      {targetAppealCase && appealBanner}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
        onNavigationTo={handleNavigationTo}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <div className={grid({ gap: 5, marginBottom: 10 })}>
            <CaseOverviewHeader
              alerts={
                targetAppealCase?.requestAppealRulingNotToBePublished
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
            {isIndictment ? (
              <InfoCardClosedIndictment />
            ) : (
              <InfoCardRequestCase />
            )}
            {isIndictment ? (
              <>
                <AllIndictmentCaseFiles />
                {workingCase.origin === CaseOrigin.LOKE && (
                  <PoliceDigitalCaseFilesAccordionItem
                    digitalCaseFiles={digitalCaseFiles}
                    digitalCaseFilesLoading={digitalCaseFilesLoading}
                    openDigitalCaseFileUrl={openDigitalCaseFileUrl}
                  />
                )}
              </>
            ) : (
              <>
                <Accordion
                  dividers={workingCase.origin === CaseOrigin.LOKE}
                  dividerOnTop={workingCase.origin === CaseOrigin.LOKE}
                  dividerOnBottom={workingCase.origin === CaseOrigin.LOKE}
                >
                  {user ? (
                    <CaseFilesAccordionItem
                      workingCase={workingCase}
                      setWorkingCase={setWorkingCase}
                      user={user}
                    />
                  ) : null}
                  {workingCase.origin === CaseOrigin.LOKE && (
                    <PoliceDigitalCaseFilesAccordionItem
                      digitalCaseFiles={digitalCaseFiles}
                      digitalCaseFilesLoading={digitalCaseFilesLoading}
                      openDigitalCaseFileUrl={openDigitalCaseFileUrl}
                    />
                  )}
                </Accordion>
                <Conclusion
                  title={formatMessage(conclusion.title)}
                  conclusionText={workingCase.conclusion}
                  judgeName={workingCase.judge?.name}
                />
                <CaseFilesOverview />
              </>
            )}
          </div>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            actions={[
              {
                text: formatMessage(core.continue),
                icon: 'arrowForward',
                onClick: () =>
                  handleNavigationTo(
                    shouldUseAppealWithdrawnRoutes(targetAppealCase)
                      ? COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE
                      : COURT_OF_APPEAL_CASE_ROUTE,
                  ),
                testId: 'continueButton',
              },
            ]}
          />
        </FormContentContainer>
      </PageLayout>
    </>
  )
}

export default Overview
