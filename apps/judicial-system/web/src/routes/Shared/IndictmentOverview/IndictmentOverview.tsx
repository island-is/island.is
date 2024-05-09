import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  IndictmentCaseReviewDecision,
  isCompletedCase,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  InfoCardCaseScheduledIndictment,
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import { AppealDecision } from '../../PublicProsecutor/Indictments/ReviewDecision/ReviewDecision'
import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const router = useRouter()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)

  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const caseIsClosed = isCompletedCase(workingCase.state)
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate

  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const [indictmentReviewDecision, setIndictmentReviewDecision] = useState<
    IndictmentCaseReviewDecision | undefined
  >(undefined)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={
          caseIsClosed
            ? formatMessage(titles.shared.closedCaseOverview, {
                courtCaseNumber: workingCase.courtCaseNumber,
              })
            : formatMessage(titles.court.indictments.overview)
        }
      />
      <FormContentContainer>
        <PageTitle>
          {caseIsClosed
            ? formatMessage(strings.completedTitle)
            : formatMessage(strings.inProgressTitle)}
        </PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.state === CaseState.RECEIVED &&
          workingCase.court &&
          latestDate?.date && (
            <Box component="section" marginBottom={5}>
              <InfoCardCaseScheduledIndictment
                court={workingCase.court}
                courtDate={latestDate.date}
                courtRoom={latestDate.location}
                postponedIndefinitelyExplanation={
                  workingCase.postponedIndefinitelyExplanation
                }
              />
            </Box>
          )}
        <Box component="section" marginBottom={5}>
          {caseIsClosed ? (
            <InfoCardClosedIndictment />
          ) : (
            <InfoCardActiveIndictment />
          )}
        </Box>
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )}
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={caseIsClosed ? 5 : 10}>
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
        {isCompletedCase(workingCase.state) &&
          workingCase.indictmentReviewer?.id === user?.id && (
            <>
              <AppealDecision
                workingCase={workingCase}
                onSelect={setIndictmentReviewDecision}
                selectedOption={indictmentReviewDecision}
              />
              <FormFooter
                previousUrl={`${constants.CASES_ROUTE}`}
                nextButtonText={formatMessage(strings.completeReview)}
                onNextButtonClick={() => setModalVisible(true)}
              />
              {modalVisible && (
                <Modal
                  title={formatMessage(strings.reviewModalTitle)}
                  text={formatMessage(strings.reviewModalText)}
                  primaryButtonText={formatMessage(
                    strings.reviewModalPrimaryButtonText,
                  )}
                  secondaryButtonText={formatMessage(
                    strings.reviewModalSecondaryButtonText,
                  )}
                  onClose={() => setModalVisible(false)}
                  onPrimaryButtonClick={() => console.log('test')}
                  onSecondaryButtonClick={() => setModalVisible(false)}
                />
              )}
            </>
          )}
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
