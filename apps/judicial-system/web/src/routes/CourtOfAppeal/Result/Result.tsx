import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertBanner, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseFilesAccordionItem,
  Conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { conclusion } from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion.strings'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { sortByIcelandicAlphabet } from '@island.is/judicial-system-web/src/utils/sortHelper'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'
import CourtOfAppealCaseOverviewHeader from '../components/CaseOverviewHeader/CaseOverviewHeader'

const CourtOfAppealResult: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { title, description } = useAppealAlertBanner(workingCase)

  return (
    <>
      <AlertBanner variant="warning" title={title} description={description} />

      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <CourtOfAppealCaseOverviewHeader />

          <Box marginBottom={5}>
            <InfoCard
              defendants={
                workingCase.defendants
                  ? {
                      title: capitalize(
                        formatMessage(core.defendant, {
                          suffix:
                            workingCase.defendants.length > 1 ? 'ar' : 'i',
                        }),
                      ),
                      items: workingCase.defendants,
                    }
                  : undefined
              }
              defenders={[
                {
                  name: workingCase.defenderName ?? '',
                  defenderNationalId: workingCase.defenderNationalId,
                  sessionArrangement: workingCase.sessionArrangements,
                  email: workingCase.defenderEmail,
                  phoneNumber: workingCase.defenderPhoneNumber,
                },
              ]}
              data={[
                {
                  title: formatMessage(core.policeCaseNumber),
                  value: workingCase.policeCaseNumbers.map((n) => (
                    <Text key={n}>{n}</Text>
                  )),
                },
                {
                  title: formatMessage(core.courtCaseNumber),
                  value: workingCase.courtCaseNumber,
                },
                {
                  title: formatMessage(core.prosecutor),
                  value: `${workingCase.creatingProsecutor?.institution?.name}`,
                },
                {
                  title: formatMessage(core.court),
                  value: workingCase.court?.name,
                },
                {
                  title: formatMessage(core.prosecutorPerson),
                  value: workingCase.prosecutor?.name,
                },
                {
                  title: formatMessage(core.judge),
                  value: workingCase.judge?.name,
                },
                ...(workingCase.registrar
                  ? [
                      {
                        title: formatMessage(core.registrar),
                        value: workingCase.registrar?.name,
                      },
                    ]
                  : []),
              ]}
              courtOfAppealData={[
                {
                  title: formatMessage(core.appealCaseNumberHeading),
                  value: workingCase.appealCaseNumber,
                },
                {
                  title: formatMessage(core.appealAssistantHeading),
                  value: workingCase.appealAssistant?.name,
                },
                {
                  title: formatMessage(core.appealJudgesHeading),
                  value: (
                    <>
                      {sortByIcelandicAlphabet([
                        workingCase.appealJudge1?.name || '',
                        workingCase.appealJudge2?.name || '',
                        workingCase.appealJudge3?.name || '',
                      ]).map((judge, index) => (
                        <Text key={index}>{judge}</Text>
                      ))}
                    </>
                  ),
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
            hideNextButton={true}
          />
        </FormContentContainer>
      </PageLayout>
    </>
  )
}

export default CourtOfAppealResult
