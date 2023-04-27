import React, { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'

import { courtOfAppealRuling as strings } from './Ruling.strings'
import { CaseAppealRulingDecision } from '@island.is/judicial-system/types'

const CourtOfAppealRuling: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const { formatMessage } = useIntl()

  const [checkedRadio, setCheckedRadio] = useState<CaseAppealRulingDecision>(
    CaseAppealRulingDecision.ACCEPTING,
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
              caseNumber: `${workingCase.appealCaseNumber}/2023`,
            })}
          </Text>
          <Text as="h3" variant="default" fontWeight="semiBold">
            {formatMessage(strings.courtOfAppealCaseNumber, {
              caseNumber: workingCase.courtCaseNumber,
            })}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <Text as="h3" variant="h3" marginBottom={3}>
            {formatMessage(strings.decision)}
          </Text>
          <Box background="blue100" padding={3}>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-accepting"
                label={formatMessage(strings.decisionAccept)}
                checked={checkedRadio === CaseAppealRulingDecision.ACCEPTING}
                onChange={() =>
                  setCheckedRadio(CaseAppealRulingDecision.ACCEPTING)
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
                checked={checkedRadio === CaseAppealRulingDecision.REPEAL}
                onChange={() =>
                  setCheckedRadio(CaseAppealRulingDecision.REPEAL)
                }
                backgroundColor="white"
                large
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="case-decision"
                id="case-decision-changed"
                label={formatMessage(strings.decisionChanged)}
                checked={checkedRadio === CaseAppealRulingDecision.CHANGED}
                onChange={() =>
                  setCheckedRadio(CaseAppealRulingDecision.CHANGED)
                }
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
                  CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL
                }
                onChange={() =>
                  setCheckedRadio(
                    CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL,
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
                  checkedRadio === CaseAppealRulingDecision.DISMISSED_FROM_COURT
                }
                onChange={() =>
                  setCheckedRadio(CaseAppealRulingDecision.DISMISSED_FROM_COURT)
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
                checked={checkedRadio === CaseAppealRulingDecision.REMAND}
                onChange={() =>
                  setCheckedRadio(CaseAppealRulingDecision.REMAND)
                }
                backgroundColor="white"
                large
              />
            </Box>
          </Box>
        </Box>
        <Box marginBottom={5}>
          <Text as="h3" variant="h3" marginBottom={3}>
            {formatMessage(strings.conclusionHeading)}
          </Text>
          <Input
            label={formatMessage(strings.conclusionHeading)}
            name="rulingConclusion"
            value={workingCase.appealConclusion || ''}
            onChange={(event) =>
              setWorkingCase({
                ...workingCase,
                appealConclusion: event.target.value,
              })
            }
            textarea
            rows={7}
            required
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          onNextButtonClick={() => {
            setWorkingCase({
              ...workingCase,
              appealRulingDecision: checkedRadio,
            })
          }}
          nextButtonIcon="arrowForward"
          nextButtonText={formatMessage(strings.nextButtonFooter)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtOfAppealRuling
