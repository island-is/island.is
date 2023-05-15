import React, { useContext } from 'react'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { AlertBanner, Box } from '@island.is/island-ui/core'

import * as constants from '@island.is/judicial-system/consts'

import Conclusion from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion'
import CourtOfAppealCaseOverview from '../components/CaseOverView/CaseOverview'
import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'

import { courtOfAppealResult as strings } from './Result.strings'
import { courtOfAppealRuling as rulingStrings } from '../Ruling/Ruling.strings'

import { useIntl } from 'react-intl'
import { formatDate } from '@island.is/judicial-system/formatters'
import { CaseAppealRulingDecision } from '@island.is/judicial-system/types'
import { titleForCase } from '../../Shared/SignedVerdictOverview/SignedVerdictOverview'

const CourtOfAppealResult: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  const { formatMessage } = useIntl()

  const { appealReceivedByCourtDate, appealRulingDecision } = workingCase

  const getDecision = () => {
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
        description={getDecision()}
      />

      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <CourtOfAppealCaseOverview />
          <Box marginBottom={6}>
            <Conclusion
              conclusionText={workingCase.appealConclusion}
              judgeName={workingCase.appealJudge1?.name}
              title="Landsréttar"
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
