import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Accordion,
  AlertMessage,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import {
  DISTRICT_COURT_INDICTMENT_CASE_ADD_FILES_IN_COURT_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_ADD_RULING_ORDER_IN_COURT_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isDistrictCourtUser,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  ConnectedCaseFilesAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentCaseScheduledCard,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardActiveIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  ServiceAnnouncements,
  UserContext,
  // useIndictmentsLawsBroken, NOTE: Temporarily hidden while list of laws broken is not complete
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { useCancelCase } from '../../../Shared/CaseTable/CancelCase'
import { strings } from './Overview.strings'
// onNavigationTo?: (destination: keyof stepValidationsType) => Promise<unknown>

const OverviewBody = ({
  handleNavigationTo,
}: {
  handleNavigationTo: (destination: string) => Promise<void>
}) => {
  const { user } = useContext(UserContext)

  const router = useRouter()

  const { workingCase, isLoadingWorkingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()
  // const lawsBroken = useIndictmentsLawsBroken(workingCase) NOTE: Temporarily hidden while list of laws broken is not complete

  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate

  return (
    <>
      <PageHeader title={formatMessage(titles.court.indictments.overview)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.inProgressTitle)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <ServiceAnnouncements defendants={workingCase.defendants} />
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          {workingCase.reopenReason && !isCompletedCase(workingCase.state) && (
            <AlertMessage
              title="Mál enduropnað"
              message={
                <Text variant="small" whiteSpace="preWrap">
                  {workingCase.reopenReason}
                </Text>
              }
              type="info"
            />
          )}
          {workingCase.court &&
            latestDate?.date &&
            workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
            workingCase.indictmentDecision !==
              IndictmentDecision.REDISTRIBUTING && (
              <Box component="section">
                <IndictmentCaseScheduledCard
                  court={workingCase.court}
                  indictmentDecision={workingCase.indictmentDecision}
                  courtDate={latestDate.date}
                  courtRoom={latestDate.location}
                  postponedIndefinitelyExplanation={
                    workingCase.postponedIndefinitelyExplanation
                  }
                  courtSessionType={workingCase.courtSessionType}
                />
              </Box>
            )}
          <Box component="section">
            <InfoCardActiveIndictment displayOpenCaseReference={true} />
          </Box>
          {/*
            NOTE: Temporarily hidden while list of laws broken is not complete in
            indictment cases

            {lawsBroken.size > 0 && (
              <Box marginBottom={5}>
                <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
              </Box>
            )} */}
          {workingCase.mergedCases && workingCase.mergedCases.length > 0 && (
            <Accordion dividerOnBottom={false} dividerOnTop={false}>
              {workingCase.mergedCases.map((mergedCase) => (
                <Box key={mergedCase.id}>
                  <ConnectedCaseFilesAccordionItem
                    connectedCaseParentId={workingCase.id}
                    connectedCase={mergedCase}
                  />
                </Box>
              ))}
            </Accordion>
          )}
          <Box component="section">
            <IndictmentCaseFilesList
              workingCase={workingCase}
              forceDisplayAdditionalFiles={true}
            />
          </Box>
          <Box
            component="section"
            display="flex"
            justifyContent="flexEnd"
            columnGap={2}
          >
            <Button
              variant="primary"
              icon="add"
              size="small"
              onClick={() => {
                router.push(
                  `${DISTRICT_COURT_INDICTMENT_CASE_ADD_FILES_IN_COURT_ROUTE}/${workingCase.id}`,
                )
              }}
              disabled={workingCase.state === CaseState.CORRECTING}
            >
              {formatMessage(strings.addFilesButtonText)}
            </Button>
            {isDistrictCourtUser(user) && (
              <Button
                variant="primary"
                icon="add"
                size="small"
                onClick={() => {
                  router.push(
                    `${DISTRICT_COURT_INDICTMENT_CASE_ADD_RULING_ORDER_IN_COURT_ROUTE}/${workingCase.id}`,
                  )
                }}
                disabled={workingCase.state === CaseState.CORRECTING}
              >
                Hlaða upp úrskurði undir rekstri máls
              </Button>
            )}
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={getStandardUserDashboardRoute(user)}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() =>
            handleNavigationTo(
              DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
            )
          }
          nextButtonText={formatMessage(core.continue)}
        />
      </FormContentContainer>
    </>
  )
}

const IndictmentOverview = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound, isCaseUpToDate } =
    useContext(FormContext)
  const { updateDefendant } = useDefendants()

  const goToDashboard = () => router.push(getStandardUserDashboardRoute(user))

  const { cancelCase, CancelCaseModal } = useCancelCase(
    goToDashboard,
    goToDashboard,
  )

  // Show the cancellation modal whenever a district court user opens an
  // indictment the prosecutor has cancelled, no matter how they got here
  // (table, search, email, direct URL). Gate on isCaseUpToDate so we react to
  // the freshly loaded case rather than a stale workingCase left over from a
  // previously opened case (the FormProvider persists workingCase while the
  // next case is still being fetched).
  useEffect(() => {
    if (
      isCaseUpToDate &&
      isDistrictCourtUser(user) &&
      workingCase.state === CaseState.WAITING_FOR_CANCELLATION
    ) {
      cancelCase(workingCase.id)
    }
  }, [isCaseUpToDate, user, workingCase.state, workingCase.id, cancelCase])

  const defendants = workingCase.defendants
  const hasDefendants = isNonEmptyArray(defendants)

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (!isNonEmptyArray(defendants)) {
        return
      }

      const promises = defendants.map((defendant) =>
        updateDefendant({
          caseId: workingCase.id,
          defendantId: defendant.id,
          subpoenaType: defendant.subpoenaType,
        }),
      )

      const allDataSentToServer = await Promise.all(promises)

      if (!allDataSentToServer.every(Boolean)) {
        return
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [defendants, router, updateDefendant, workingCase.id],
  )

  return (
    <>
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
        isValid={hasDefendants}
        onNavigationTo={handleNavigationTo}
      >
        <OverviewBody handleNavigationTo={handleNavigationTo} />
      </PageLayout>
      {CancelCaseModal}
    </>
  )
}

export default IndictmentOverview
