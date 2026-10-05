import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { Feature } from '@island.is/judicial-system/types'
import {
  FeatureContext,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { useTargetAppealCaseByAppealCaseId } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import SelectAppealCivilClaimantAdvocate from './SelectAppealCivilClaimantAdvocate'
import SelectAppealDefender from './SelectAppealDefender'
import { areAllAppealAdvocatesConfirmed } from './VerdictAppealDefender.logic'

/**
 * Where the Court of Appeals settles who represents each party in the appeal.
 *
 * The same job the district court does on its own Advocates screen, and the
 * screen is built to read like it. What differs is whose record it writes: the
 * appeal's own columns, never the district court's, because who defended there
 * is a fact about that proceeding.
 *
 * Nothing follows from confirming yet - no access, no notification. The letter
 * of appointment and what a confirmed advocate may open are the slices after
 * this one.
 */
const VerdictAppealDefender = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { features, isLoading: isLoadingFeatures } = useContext(FeatureContext)
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()
  const { formatMessage } = useIntl()
  const router = useRouter()

  const overviewUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE}/${workingCase.id}`,
    targetAppealCase?.id,
  )

  // The route resolves whether or not the feature is on, as every other route
  // of this work does, so the page turns itself away rather than rendering a
  // step that does not exist yet.
  const isFeatureEnabled = features.includes(Feature.INDICTMENT_APPEAL)

  useEffect(() => {
    if (isLoadingWorkingCase || isLoadingFeatures || caseNotFound) {
      return
    }

    if (!isFeatureEnabled) {
      router.replace(overviewUrl)
    }
  }, [
    isLoadingWorkingCase,
    isLoadingFeatures,
    caseNotFound,
    isFeatureEnabled,
    router,
    overviewUrl,
  ])

  const stepIsValid = areAllAppealAdvocatesConfirmed(workingCase)
  const hasCivilClaimants = (workingCase.civilClaimants?.length ?? 0) > 0

  const handleNavigationTo = (destination: string) =>
    router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        targetAppealCase?.id,
      ),
    )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={titleForCase(formatMessage, workingCase)} />
      <FormContentContainer>
        <PageTitle>Verjandi</PageTitle>
        <div className={stack({ gap: 5 })}>
          <Box component="section">
            <SectionHeading title="Verjendur ákærðu" marginBottom={3} />
            <div className={stack({ gap: 5 })}>
              {workingCase.defendants?.map((defendant) => (
                <SelectAppealDefender
                  key={defendant.id}
                  defendant={defendant}
                />
              ))}
            </div>
          </Box>
          {hasCivilClaimants && (
            <Box component="section">
              <SectionHeading
                title="Réttargæslumenn og lögmenn bótakröfuhafa"
                marginBottom={3}
              />
              <div className={stack({ gap: 5 })}>
                {workingCase.civilClaimants?.map((civilClaimant) => (
                  <SelectAppealCivilClaimantAdvocate
                    key={civilClaimant.id}
                    civilClaimant={civilClaimant}
                  />
                ))}
              </div>
            </Box>
          )}
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        {/* No continue action: this is the last step the court of appeals has
            on a verdict appeal so far. The next one arrives with the step
            that follows it. */}
        <FormFooter previousUrl={overviewUrl} />
      </FormContentContainer>
    </PageLayout>
  )
}

export default VerdictAppealDefender
