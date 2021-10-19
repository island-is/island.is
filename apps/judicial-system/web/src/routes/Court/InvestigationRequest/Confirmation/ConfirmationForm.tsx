import React from 'react'
import { useIntl } from 'react-intl'
import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
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
import { core, icConfirmation } from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

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
            <RulingAccordionItem workingCase={workingCase} startExpanded />
          </Accordion>
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
              ? icConfirmation.footer.accepting.continueButtonText
              : workingCase.decision === CaseDecision.REJECTING
              ? icConfirmation.footer.rejecting.continueButtonText
              : workingCase.decision === CaseDecision.DISMISSING
              ? icConfirmation.footer.dismissing.continueButtonText
              : icConfirmation.footer.acceptingPartially.continueButtonText,
          )}
          nextButtonIcon={
            workingCase.decision &&
            [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY].includes(
              workingCase.decision,
            )
              ? 'checkmark'
              : 'close'
          }
          nextButtonColorScheme={
            workingCase.decision &&
            [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY].includes(
              workingCase.decision,
            )
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
