import React from 'react'
import { useIntl } from 'react-intl'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseInfo,
  CourtRecordAccordionItem,
  FormContentContainer,
  FormFooter,
  PdfButton,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
} from '@island.is/judicial-system-web/src/components'
import { CaseDecision } from '@island.is/judicial-system/types'
import {
  core,
  icConfirmation as m,
} from '@island.is/judicial-system-web/messages'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import type { Case, User } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'
interface Props {
  workingCase: Case
  user: User
  isLoading: boolean
  handleNextButtonClick: () => void
}

const Confirmation: React.FC<Props> = (props) => {
  const { workingCase, user, isLoading, handleNextButtonClick } = props
  const { formatMessage } = useIntl()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit úrskurðar
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user.role} />
        </Box>
        <Box marginBottom={9}>
          <Accordion>
            <PoliceRequestAccordionItem workingCase={workingCase} />
            <CourtRecordAccordionItem workingCase={workingCase} />
            <RulingAccordionItem workingCase={workingCase} />
          </Accordion>
        </Box>
        <Box marginBottom={7}>
          <BlueBox>
            <Box marginBottom={2} textAlign="center">
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.conclusion.title)}
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Box marginTop={1}>
                <Text variant="intro">{workingCase.conclusion}</Text>
              </Box>
            </Box>
            <Box marginBottom={1} textAlign="center">
              <Text variant="h4">{workingCase?.judge?.name}</Text>
            </Box>
          </BlueBox>
        </Box>
        <Box marginBottom={3}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling"
          />
        </Box>
        <Box marginBottom={15}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="courtRecord"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextUrl={Constants.CASE_LIST_ROUTE}
          nextIsLoading={isLoading}
          nextButtonText={formatMessage(
            workingCase.decision === CaseDecision.ACCEPTING
              ? m.footer.accepting.continueButtonText
              : workingCase.decision === CaseDecision.REJECTING
              ? m.footer.rejecting.continueButtonText
              : workingCase.decision === CaseDecision.DISMISSING
              ? m.footer.dismissing.continueButtonText
              : m.footer.acceptingPartially.continueButtonText,
          )}
          nextButtonIcon={
            isAcceptingCaseDecision(workingCase.decision)
              ? 'checkmark'
              : 'close'
          }
          nextButtonColorScheme={
            isAcceptingCaseDecision(workingCase.decision)
              ? 'default'
              : 'destructive'
          }
          onNextButtonClick={handleNextButtonClick}
          hideNextButton={workingCase.judge?.id !== user?.id}
          infoBoxText={
            workingCase.judge?.id !== user?.id
              ? 'Einungis skráður dómari getur undirritað úrskurð'
              : undefined
          }
        />
      </FormContentContainer>
    </>
  )
}

export default Confirmation
