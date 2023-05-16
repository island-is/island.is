import React, { useContext } from 'react'

import {
  CaseFilesAccordionItem,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { AlertBanner, Box, Text } from '@island.is/island-ui/core'

import * as constants from '@island.is/judicial-system/consts'

import Conclusion from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion'
import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'
import CourtOfAppealCaseOverviewHeader from '../components/CaseOverviewHeader/CaseOverviewHeader'

import { courtOfAppealResult as strings } from './Result.strings'
import { courtOfAppealRuling as rulingStrings } from '../Ruling/Ruling.strings'

import { useIntl } from 'react-intl'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { CaseAppealRulingDecision } from '@island.is/judicial-system/types'
import { titleForCase } from '../../Shared/SignedVerdictOverview/SignedVerdictOverview'
import { core } from '@island.is/judicial-system-web/messages'
import { appealCase } from '../AppealCase/AppealCase.strings'

const CourtOfAppealResult: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { appealReceivedByCourtDate, appealRulingDecision } = workingCase

  const getAppealDecision = () => {
    if (appealRulingDecision === CaseAppealRulingDecision.ACCEPTING) {
      return formatMessage(rulingStrings.decisionAccept)
    }
    if (appealRulingDecision === CaseAppealRulingDecision.REPEAL) {
      return formatMessage(rulingStrings.decisionRepeal)
    }
    if (appealRulingDecision === CaseAppealRulingDecision.CHANGED) {
      return formatMessage(rulingStrings.decisionChanged)
    }
    if (
      appealRulingDecision ===
      CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL
    ) {
      return formatMessage(rulingStrings.decisionDismissedFromCourtOfAppeal)
    }
    if (
      appealRulingDecision === CaseAppealRulingDecision.DISMISSED_FROM_COURT
    ) {
      return formatMessage(rulingStrings.decisionDismissedFromCourt)
    }
    if (appealRulingDecision === CaseAppealRulingDecision.REMAND) {
      return formatMessage(rulingStrings.decisionUnlabeling)
    }
    return undefined
  }

  return (
    <>
      <AlertBanner
        variant="warning"
        title={formatMessage(strings.title, {
          appealedDate: formatDate(appealReceivedByCourtDate, 'PPP'),
        })}
        description={getAppealDecision()}
      />

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
                  title: formatMessage(appealCase.caseNumberHeading),
                  value: workingCase.appealCaseNumber,
                },
                {
                  title: formatMessage(appealCase.assistantHeading),
                  value: workingCase.appealAssistant?.name,
                },
                {
                  title: formatMessage(appealCase.judgesHeading),
                  value: (
                    <>
                      <Text>{workingCase.appealJudge1?.name}</Text>
                      <Text>{workingCase.appealJudge2?.name}</Text>
                      <Text>{workingCase.appealJudge3?.name}</Text>
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
              conclusionText={workingCase.conclusion}
              judgeName={workingCase.judge?.name}
              title={formatMessage(strings.conclusionTitle)}
            />
          </Box>
          <Box marginBottom={6}>
            <Conclusion
              conclusionText={workingCase.appealConclusion}
              judgeName={workingCase.appealJudge1?.name}
              title={formatMessage(strings.conclusionCourtOfAppealTitle)}
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
