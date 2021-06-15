import React from 'react'
import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
  CaseNumbers,
  CourtRecordAccordionItem,
  FormContentContainer,
  FormFooter,
  PdfButton,
  PoliceRequestAccordionItem,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case, CaseAppealDecision } from '@island.is/judicial-system/types'
import {
  formatAccusedByGender,
  formatDate,
  NounCases,
} from '@island.is/judicial-system/formatters'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import * as styles from './Confirmation.treat'
import { getAppealDecisionText } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { AppealDecisionRole } from '@island.is/judicial-system-web/src/types'

interface Props {
  workingCase: Case
  isLoading: boolean
  handleNextButtonClick: () => void
}

const Confirmation: React.FC<Props> = (props) => {
  const { workingCase, isLoading, handleNextButtonClick } = props
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
        {workingCase.additionToConclusion && (
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Úrskurðarorð
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Text variant="intro">{workingCase.additionToConclusion}</Text>
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
          <Text>
            Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={1}>
            <Text as="h3" variant="h3">
              Ákvörðun um kæru
            </Text>
          </Box>
          <Box marginBottom={1}>
            <Text>
              Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð
              þennan til Landsréttar innan þriggja sólarhringa.
            </Text>
          </Box>
          <Box marginBottom={1}>
            <Text variant="h4">
              {getAppealDecisionText(
                AppealDecisionRole.ACCUSED,
                workingCase.accusedAppealDecision,
                workingCase.accusedGender,
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
                      {`Yfirlýsing um kæru ${formatAccusedByGender(
                        workingCase.accusedGender,
                        NounCases.GENITIVE,
                      )}`}
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
          previousUrl={`${Constants.R_CASE_RULING_STEP_TWO_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextButtonText="Staðfesta og hefja undirritun"
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
    </>
  )
}

export default Confirmation
