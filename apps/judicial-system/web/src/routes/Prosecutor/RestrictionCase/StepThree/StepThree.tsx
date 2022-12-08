import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContext,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { rcDemands, titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'

import StepThreeForm from './StepThreeForm'

export const StepThree: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (
      !workingCase.requestedOtherRestrictions &&
      workingCase.requestedCustodyRestrictions &&
      workingCase.requestedCustodyRestrictions.indexOf(
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
      ) > -1 &&
      workingCase.defendants
    ) {
      setAndSendCaseToServer(
        [
          {
            requestedOtherRestrictions: formatMessage(
              rcDemands.sections.custodyRestrictions
                .requestedOtherRestrictionsAutofill,
              { gender: workingCase.defendants[0].gender },
            ),
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [setAndSendCaseToServer, formatMessage, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.STEP_THREE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.policeDemands)}
      />
      <StepThreeForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
      />
    </PageLayout>
  )
}

export default StepThree
