import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import isValid from 'date-fns/isValid'
import addDays from 'date-fns/addDays'

import {
  CaseDates,
  CaseFilesAccordionItem,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  PdfButton,
  RestrictionTags,
  SignedDocument,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { Box, Button, RadioButton, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import { capitalize } from '@island.is/judicial-system/formatters'
import Conclusion from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'
import { AlertBanner } from '@island.is/judicial-system-web/src/components/AlertBanner'
import useAppealAlertBanner from '@island.is/judicial-system-web/src/utils/hooks/useAppealAlertBanner'
import * as constants from '@island.is/judicial-system/consts'

import { courtOfAppealRuling as strings } from './Ruling.strings'
import { CourtOfAppealDecision } from 'libs/judicial-system/types/src/lib/case'

const CourtOfAppealRuling: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const { title, description } = useAppealAlertBanner(workingCase)
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const [checkedRadio, setCheckedRadio] = useState<CourtOfAppealDecision>(
    CourtOfAppealDecision.ACCEPTING,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        <Box marginBottom={7}>
          <Text as="h2" variant="h2">
            {formatMessage(strings.caseNumber, {
              caseNumber: '431/2023',
            })}
          </Text>
          <Text as="h3" variant="default" fontWeight="semiBold">
            {formatMessage(strings.courtOfAppealCaseNumber, {
              caseNumber: 'R-210/2023',
            })}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <Text variant="h3" marginBottom={3}>
            {formatMessage(strings.decision)}
          </Text>
          <Box background="blue100" padding={3}>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-accepting"
                label={formatMessage(strings.decisionAccept)}
                checked={checkedRadio === CourtOfAppealDecision.ACCEPTING}
                onChange={() =>
                  setCheckedRadio(CourtOfAppealDecision.ACCEPTING)
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-repeal"
                label={formatMessage(strings.decisionRepeal)}
                checked={checkedRadio === CourtOfAppealDecision.REPEAL}
                onChange={() => setCheckedRadio(CourtOfAppealDecision.REPEAL)}
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-changed"
                label={formatMessage(strings.decisionChanged)}
                checked={checkedRadio === CourtOfAppealDecision.CHANGED}
                onChange={() => setCheckedRadio(CourtOfAppealDecision.CHANGED)}
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-dismissed-from-court-of-appeal"
                label={formatMessage(
                  strings.decisionDismissedFromCourtOfAppeal,
                )}
                checked={
                  checkedRadio ===
                  CourtOfAppealDecision.DISMISSED_FROM_COURT_OF_APPEAL
                }
                onChange={() =>
                  setCheckedRadio(
                    CourtOfAppealDecision.DISMISSED_FROM_COURT_OF_APPEAL,
                  )
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-dismissed-from-court"
                label={formatMessage(strings.decisionDismissedFromCourt)}
                checked={
                  checkedRadio === CourtOfAppealDecision.DISMISSED_FROM_COURT
                }
                onChange={() =>
                  setCheckedRadio(CourtOfAppealDecision.DISMISSED_FROM_COURT)
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-unlabeling"
                label={formatMessage(strings.decisionUnlabeling)}
                checked={checkedRadio === CourtOfAppealDecision.UNLABELING}
                onChange={() =>
                  setCheckedRadio(CourtOfAppealDecision.UNLABELING)
                }
                backgroundColor="white"
                large
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <Text variant="h3" marginBottom={3}>
            {formatMessage(strings.conclusionHeading)}
          </Text>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
          onNextButtonClick={() => console.log('23')}
          nextButtonIcon="arrowForward"
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtOfAppealRuling
