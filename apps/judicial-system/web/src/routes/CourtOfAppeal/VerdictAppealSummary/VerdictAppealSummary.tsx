import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE } from '@island.is/judicial-system/consts'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import { getVerdictAppealStatusHeaderLines } from '../VerdictAppealStatus/VerdictAppealStatus.logic'

/**
 * The summary of a verdict appeal at the Court of Appeals.
 *
 * A placeholder: the step exists so the status step has somewhere to lead
 * once a session is booked. What the summary shows arrives with its own
 * slice.
 */
const VerdictAppealSummary = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const router = useRouter()

  const statusUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE}/${workingCase.id}`,
    verdictAppealCase?.id,
  )

  const handleNavigationTo = (destination: string) =>
    router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        verdictAppealCase?.id,
      ),
    )

  const headerLines = getVerdictAppealStatusHeaderLines(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={titleForCase(formatMessage, workingCase)} />
      <FormContentContainer>
        <Box>
          <PageTitle marginBottom={1}>Samantekt</PageTitle>
          {headerLines.map((line) => (
            <Text key={line} as="h5" variant="h5">
              {line}
            </Text>
          ))}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter previousUrl={statusUrl} />
      </FormContentContainer>
    </PageLayout>
  )
}

export default VerdictAppealSummary
