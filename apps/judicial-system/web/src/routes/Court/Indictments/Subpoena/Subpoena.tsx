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
import CourtArrangements, {
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components/CourtArrangements'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles } from '@island.is/judicial-system-web/messages'
import { Box } from '@island.is/island-ui/core'
import SelectSubpoenaType from '@island.is/judicial-system-web/src/components/SelectSubpoenaType/SelectSubpoenaType'
import { SubpoenaType } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { subpoena as strings } from './Subpoena.strings'

const Subpoena: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { courtDate, handleCourtDateChange } = useCourtArrangements(workingCase)
  const { setAndSendToServer } = useCase()

  const handleSubpoenaTypeChange = (subpoenaType: SubpoenaType) => {
    console.log('subpoenaType', subpoenaType)
    setAndSendToServer(
      [{ subpoenaType, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={IndictmentsCourtSubsections.SUBPEONA}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.court.indictments.subpoena)} />
      <FormContentContainer>
        <PageTitle title={formatMessage(strings.title)} />
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={3}>
          <SelectSubpoenaType
            workingCase={workingCase}
            onChange={handleSubpoenaTypeChange}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <CourtArrangements
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            handleCourtDateChange={handleCourtDateChange}
            selectedCourtDate={courtDate}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}`}
          nextIsLoading={isLoadingWorkingCase}
          nextUrl={`${constants.CASES_ROUTE}`} // TODO: Add next route when ready
          nextButtonText={formatMessage(strings.nextButtonText)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Subpoena
