import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentsCaseFilesAccordionItem,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import { Accordion, AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles } from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system/consts'

import { caseFile as m } from './CaseFile.strings'

const CaseFile = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.STEP_FIVE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.caseFile)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
        <Box marginBottom={7}>
          <AlertMessage type="info" message={formatMessage(m.infoPanel)} />
        </Box>
        <Box marginBottom={7}>
          <Accordion>
            {workingCase.policeCaseNumbers.map((policeCaseNumber) => (
              <IndictmentsCaseFilesAccordionItem
                policeCaseNumber={policeCaseNumber}
                caseFiles={[]}
              />
            ))}
          </Accordion>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          // TODO: Add previous step when ready
          // previousUrl={`${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFile
