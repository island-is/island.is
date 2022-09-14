import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  ProsecutorSelection,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system/consts'
import { Box } from '@island.is/island-ui/core'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { defendantParty as m } from './DefendantParty.strings'
import SelectDefender from './SelectDefender'

const HearingArrangements: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { setAndSendToServer } = useCase()
  const { formatMessage } = useIntl()
  const handleProsecutorChange = useCallback(
    (prosecutorId: string) => {
      setAndSendToServer(
        [
          {
            prosecutorId: prosecutorId,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
      return true
    },
    [workingCase, setWorkingCase, setAndSendToServer],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={IndictmentsCourtSubsections.DEFENDANT_PARTY}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.indictments.defendantParty)}
      />
      <FormContentContainer>
        <PageTitle title={formatMessage(m.title)} />
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.selectProsecutorHeading)} />
          <ProsecutorSelection onChange={handleProsecutorChange} />
        </Box>
        <SelectDefender />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          nextButtonText={formatMessage(core.continue)}
          nextUrl={`${constants.INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default HearingArrangements
