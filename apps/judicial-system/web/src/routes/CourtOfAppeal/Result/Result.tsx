import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Accordion } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { isIndictmentCase } from '@island.is/judicial-system/types'
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
  ReopenModal,
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

import { result as strings } from './Result.strings'

type modalTypes = 'reopenCase' | 'none'

const Result = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [modalVisible, setModalVisible] = useState<modalTypes>('none')

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { appealBanner } = useAppealCaseBanner()
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()
  const { digitalCaseFiles, digitalCaseFilesLoading, openDigitalCaseFileUrl } =
    usePoliceDigitalCaseFile()

  const isIndictment = isIndictmentCase(workingCase.type)

  return (
    <>
      {targetAppealCase && appealBanner}
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
                <Conclusion
                  title={formatMessage(conclusion.appealTitle)}
                  conclusionText={targetAppealCase?.appealConclusion}
                />
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
                <Conclusion
                  title={formatMessage(conclusion.appealTitle)}
                  conclusionText={targetAppealCase?.appealConclusion}
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
                text: formatMessage(strings.nextButtonText),
                onClick: () => setModalVisible('reopenCase'),
                testId: 'continueButton',
              },
            ]}
          />
        </FormContentContainer>
      </PageLayout>
      {modalVisible === 'reopenCase' && (
        <ReopenModal onClose={() => setModalVisible('none')} />
      )}
    </>
  )
}

export default Result
