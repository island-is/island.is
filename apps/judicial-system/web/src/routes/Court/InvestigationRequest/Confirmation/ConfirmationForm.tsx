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
} from '@island.is/judicial-system-web/src/shared-components'
import {
  CaseAppealDecision,
  CaseDecision,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type { Case, User } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { getAppealDecisionText } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { AppealDecisionRole } from '@island.is/judicial-system-web/src/types'
import {
  icConfirmation,
  icCourtRecord,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import * as styles from './Confirmation.treat'

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
          <Text
            variant="h2"
            as="h2"
          >{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box marginBottom={9}>
          <Accordion>
            <PoliceRequestAccordionItem workingCase={workingCase} />
            <CourtRecordAccordionItem workingCase={workingCase} />
          </Accordion>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Úrskurður Héraðsdóms
            </Text>
          </Box>
          <Box marginBottom={7}>
            <Text variant="eyebrow" color="blue400">
              Niðurstaða
            </Text>
            <Text>
              <span className={styles.breakSpaces}>{workingCase.ruling}</span>
            </Text>
          </Box>
        </Box>
        {workingCase.conclusion && (
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Úrskurðarorð
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Text variant="intro">{workingCase.conclusion}</Text>
            </Box>
          </Box>
        )}
        <Box component="section" marginBottom={7}>
          <Box marginBottom={1}>
            <Text variant="h3">
              {workingCase.judge
                ? `${workingCase.judge.name} ${workingCase.judge.title}`
                : `Enginn dómari skráður`}
            </Text>
          </Box>
          {workingCase.sessionArrangements !==
            SessionArrangements.REMOTE_SESSION && (
            <Text>
              Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.
            </Text>
          )}
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={1}>
            <Text as="h3" variant="h3">
              Ákvörðun um kæru
            </Text>
          </Box>
          <Box marginBottom={1}>
            <Text>
              {formatMessage(
                icConfirmation.sections.accusedAppealDecision.disclaimer,
              )}
            </Text>
          </Box>
          <Box marginBottom={1}>
            <Text variant="h4">
              {getAppealDecisionText(
                AppealDecisionRole.ACCUSED,
                workingCase.accusedAppealDecision,
                workingCase.accusedGender,
                workingCase.type,
              )}
            </Text>
          </Box>
          <Text variant="h4">
            {getAppealDecisionText(
              AppealDecisionRole.PROSECUTOR,
              workingCase.prosecutorAppealDecision,
              workingCase.accusedGender,
            )}
          </Text>
          {(workingCase.accusedAppealAnnouncement ||
            workingCase.prosecutorAppealAnnouncement) && (
            <Box component="section" marginTop={3}>
              {workingCase.accusedAppealAnnouncement &&
                workingCase.accusedAppealDecision ===
                  CaseAppealDecision.APPEAL && (
                  <Box>
                    <Text variant="eyebrow" color="blue400">
                      Yfirlýsing um kæru varnaraðila
                    </Text>
                    <Text>{workingCase.accusedAppealAnnouncement}</Text>
                  </Box>
                )}
              {workingCase.prosecutorAppealAnnouncement &&
                workingCase.prosecutorAppealDecision ===
                  CaseAppealDecision.APPEAL && (
                  <Box marginTop={2}>
                    <Text variant="eyebrow" color="blue400">
                      Yfirlýsing um kæru sækjanda
                    </Text>
                    <Text>{workingCase.prosecutorAppealAnnouncement}</Text>
                  </Box>
                )}
            </Box>
          )}
        </Box>
        <Box marginBottom={15}>
          <PdfButton
            caseId={workingCase.id}
            title="Opna PDF þingbók og úrskurð"
            pdfType="ruling"
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
