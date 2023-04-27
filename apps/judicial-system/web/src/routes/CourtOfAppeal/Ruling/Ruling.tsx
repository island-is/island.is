import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Box,
  Input,
  InputFileUpload,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useAppealAlertBanner from '@island.is/judicial-system-web/src/utils/hooks/useAppealAlertBanner'
import * as constants from '@island.is/judicial-system/consts'

import { courtOfAppealRuling as strings } from './Ruling.strings'
import { CourtOfAppealRulingDecision } from 'libs/judicial-system/types/src/lib/case'

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

  const {
    handleChange,
    handleRemove,
    handleRetry,
    generateSingleFileUpdate,
  } = useS3Upload(workingCase.id)

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const [checkedRadio, setCheckedRadio] = useState<CourtOfAppealRulingDecision>(
    CourtOfAppealRulingDecision.ACCEPTING,
  )

  const [rulingConclusion, setRulingConclusion] = useState<string>()

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
              caseNumber: '??/2023',
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
                checked={checkedRadio === CourtOfAppealRulingDecision.ACCEPTING}
                onChange={() =>
                  setCheckedRadio(CourtOfAppealRulingDecision.ACCEPTING)
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
                checked={checkedRadio === CourtOfAppealRulingDecision.REPEAL}
                onChange={() =>
                  setCheckedRadio(CourtOfAppealRulingDecision.REPEAL)
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
                checked={checkedRadio === CourtOfAppealRulingDecision.CHANGED}
                onChange={() =>
                  setCheckedRadio(CourtOfAppealRulingDecision.CHANGED)
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
                  CourtOfAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL
                }
                onChange={() =>
                  setCheckedRadio(
                    CourtOfAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL,
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
                  checkedRadio ===
                  CourtOfAppealRulingDecision.DISMISSED_FROM_COURT
                }
                onChange={() =>
                  setCheckedRadio(
                    CourtOfAppealRulingDecision.DISMISSED_FROM_COURT,
                  )
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
                checked={
                  checkedRadio === CourtOfAppealRulingDecision.UNLABELING
                }
                onChange={() =>
                  setCheckedRadio(CourtOfAppealRulingDecision.UNLABELING)
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
            value={rulingConclusion}
            onChange={(event) =>
              setRulingConclusion(event.target.value as string)
            }
            textarea
            rows={7}
            required
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box marginBottom={10}>
          <Text as="h3" variant="h3" marginBottom={3}>
            {formatMessage(strings.courtConclusionHeading)}
          </Text>
          <InputFileUpload
            fileList={[]}
            accept="application/pdf"
            header={formatMessage(strings.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(strings.uploadButtonText)}
            onChange={() => {
              // handleChange(
              //   files,
              //   CaseFileCategory.COURT_RECORD,
              //   setDisplayFiles,
              //   handleUIUpdate,
              // )
            }}
            onRemove={() => console.log('asdasd')}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
          onNextButtonClick={() => console.log('23')}
          nextButtonIcon="arrowForward"
          nextButtonText={formatMessage(strings.nextButtonFooter)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtOfAppealRuling
