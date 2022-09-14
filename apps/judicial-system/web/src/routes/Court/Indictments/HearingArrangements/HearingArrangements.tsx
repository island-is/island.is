import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system/consts'

import { hearingArrangements as m } from './HearingArrangements.strings'

const HearingArrangements: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()

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
