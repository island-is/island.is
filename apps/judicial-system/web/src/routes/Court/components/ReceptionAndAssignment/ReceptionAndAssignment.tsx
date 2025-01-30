import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import { ProsecutorAndDefendantsEntries } from '@island.is/judicial-system-web/src/components/CaseInfo/CaseInfo'
import { Gender } from '@island.is/judicial-system-web/src/graphql/schema'
import { getDefendantPleaText } from '@island.is/judicial-system-web/src/utils/utils'
import { isReceptionAndAssignmentStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import CourtCaseNumber from '../CourtCaseNumber/CourtCaseNumber'
import SelectCourtOfficials from './SelectCourtOfficials/SelectCourtOfficials'
import { receptionAndAssignment as strings } from './ReceptionAndAssignment.strings'

const ReceptionAndAssignment = () => {
  const router = useRouter()
  const id = router.query.id
  const { formatMessage } = useIntl()

  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const getNextRoute = isRestrictionCase(workingCase.type)
    ? constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE
    : isInvestigationCase(workingCase.type)
    ? constants.INVESTIGATION_CASE_OVERVIEW_ROUTE
    : constants.INDICTMENTS_SUBPOENA_ROUTE

  const stepIsValid = isReceptionAndAssignmentStepValid(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )
  const defendantPleas = workingCase.defendants
    ?.map((defendant, index) => {
      if (
        defendant.defendantPlea !== null &&
        defendant.defendantPlea !== undefined
      ) {
        return (
          <Box
            key={defendant.id}
            component="span"
            display="block"
            marginBottom={index === workingCase.defendants?.length ? 0 : 1}
          >
            {formatMessage(strings.defendantPleaAlertMessage, {
              defendantGender: workingCase.defendants
                ? defendant.gender
                : Gender.MALE,
              nameAndPlea: getDefendantPleaText(
                defendant.name,
                defendant.defendantPlea,
              ),
            })}
          </Box>
        )
      } else {
        return null
      }
    })
    .filter((plea) => plea !== null)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.court.shared.receptionAndAssignment)}
      />
      <FormContentContainer>
        {isIndictmentCase(workingCase.type) && workingCase.comments && (
          <Box
            marginBottom={defendantPleas && defendantPleas.length > 0 ? 2 : 5}
          >
            <AlertMessage
              title={formatMessage(strings.commentsTitle)}
              message={workingCase.comments}
              type="warning"
            />
          </Box>
        )}
        {isIndictmentCase(workingCase.type) &&
          defendantPleas &&
          defendantPleas.length > 0 && (
            <Box marginBottom={3}>
              <AlertMessage
                title={formatMessage(strings.defendantPleaAlertTitle, {
                  defendantCount: workingCase.defendants?.length,
                })}
                message={defendantPleas}
                type="warning"
              />
            </Box>
          )}
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <Box component="section" marginBottom={5}>
          <ProsecutorAndDefendantsEntries workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={6}>
          <CourtCaseNumber />
        </Box>
        <Box component="section" marginBottom={10}>
          <SelectCourtOfficials />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={
            isIndictmentCase(workingCase.type)
              ? `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`
              : constants.CASES_ROUTE
          }
          onNextButtonClick={() => handleNavigationTo(getNextRoute)}
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default ReceptionAndAssignment
