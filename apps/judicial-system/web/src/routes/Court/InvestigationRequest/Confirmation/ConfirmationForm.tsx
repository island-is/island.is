import React from 'react'
import { useIntl } from 'react-intl'
import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseNumbers,
  CourtRecordAccordionItem,
  FormContentContainer,
  FormFooter,
  PdfButton,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
} from '@island.is/judicial-system-web/src/shared-components'
import { CaseDecision } from '@island.is/judicial-system/types'
import type { Case, User } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  core,
  icConfirmation as m,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'

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
        <Box marginBottom={1}>
          <Text as="h1" variant="h1">
            Yfirlit úrskurðar
          </Text>
        </Box>
        <Box display="flex" marginBottom={7}>
          <Box marginRight={2}>
            <Text variant="small">{`Krafa stofnuð: ${formatDate(
              workingCase.created,
              'P',
            )}`}</Text>
          </Box>
          <Text variant="small">{`Þinghald: ${formatDate(
            workingCase.courtStartDate,
            'P',
          )}`}</Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseNumbers workingCase={workingCase} />
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
              <Text variant="h4">
                {workingCase?.judge ? workingCase.judge.name : user?.name}
              </Text>
            </Box>
          </BlueBox>
        </Box>
        <Box marginBottom={3}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling?shortVersion=false"
          />
        </Box>
        <Box marginBottom={15}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="ruling?shortVersion=true"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_RULING_STEP_TWO_ROUTE}/${workingCase.id}`}
          nextUrl={Constants.REQUEST_LIST_ROUTE}
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
