import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE } from '@island.is/judicial-system/consts'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  VerdictAppealFiles,
} from '@island.is/judicial-system-web/src/components'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import { getVerdictAppealStatusHeaderLines } from '../VerdictAppealStatus/VerdictAppealStatus.logic'
import VerdictAppealConclusionBoxes from '../VerdictAppealSummary/VerdictAppealConclusionBoxes'
import VerdictAppealRulingDocument from '../VerdictAppealSummary/VerdictAppealRulingDocument'

/**
 * A verdict appeal the Court of Appeals has finished: how it ended, and the
 * documents it ended with.
 *
 * Only a finished appeal has anything to show here, so one that is not is
 * sent to the summary, where the court confirms it. The appeal stays open to
 * corrections once finished: the stepper keeps every earlier step reachable,
 * and the way back leads to the summary.
 */
const VerdictAppealResult = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // the overview gives.
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const router = useRouter()

  const isCompleted =
    verdictAppealCase?.appealState === AppealCaseState.COMPLETED
  // Until the case has loaded the working case is empty, and reads as an
  // appeal that is not finished.
  const shouldRedirect =
    !isLoadingWorkingCase &&
    !caseNotFound &&
    Boolean(workingCase.id) &&
    !isCompleted

  const summaryUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/${workingCase.id}`,
    verdictAppealCase?.id,
  )

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(summaryUrl)
    }
  }, [shouldRedirect, router, summaryUrl])

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
        <div className={stack({ gap: 5 })}>
          <Box>
            <PageTitle marginBottom={1}>Máli lokið</PageTitle>
            {headerLines.map((line) => (
              <Text key={line} as="h5" variant="h5">
                {line}
              </Text>
            ))}
          </Box>
          <InfoCardClosedIndictment />
          <VerdictAppealConclusionBoxes workingCase={workingCase} />
          <VerdictAppealFiles />
          <VerdictAppealRulingDocument workingCase={workingCase} />
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter previousUrl={summaryUrl} />
      </FormContentContainer>
    </PageLayout>
  )
}

export default VerdictAppealResult
