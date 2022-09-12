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

import { hearingArrangements as m } from './HearingArrangements.strings'

import ProsecutorSelection from '../../../Prosecutor/SharedComponents/ProsecutorSection/ProsecutorSelection'

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
      activeSubSection={IndictmentsCourtSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.indictments.hearingArrangements)}
      />
      <FormContentContainer>
        <PageTitle title={formatMessage(m.title)} />
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.selectProsecutorHeading)} />
          <ProsecutorSelection onChange={handleProsecutorChange} />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          nextButtonText={formatMessage(core.continue)}
          nextUrl={`${constants.CASES_ROUTE}`} // TODO: Add correct URL
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default HearingArrangements
