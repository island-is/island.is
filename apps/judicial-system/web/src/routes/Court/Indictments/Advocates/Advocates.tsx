import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { NotificationType } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isDefenderStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import SelectCivilClaimantAdvocate from './SelectCivilClaimantAdvocate'
import SelectDefender from './SelectDefender'
import { strings } from './Advocates.strings'

const Advocates = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const router = useRouter()
  const { sendNotification, isSendingNotification } = useCase()
  const { formatMessage } = useIntl()

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      await sendNotification(workingCase.id, NotificationType.ADVOCATE_ASSIGNED)
      router.push(`${destination}/${workingCase.id}`)
    },
    [workingCase.id, sendNotification, router],
  )

  const stepIsValid = !isSendingNotification && isDefenderStepValid(workingCase)
  const hasCivilClaimants = (workingCase.civilClaimants?.length ?? 0) > 0

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.defender)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <AlertMessage
            message={formatMessage(strings.alertBannerText)}
            type="info"
          />
        </Box>
        <Box component="section" marginBottom={hasCivilClaimants ? 5 : 10}>
          <SectionHeading
            title={formatMessage(strings.selectDefenderHeading)}
            required
          />
          {workingCase.defendants?.map((defendant, index) => (
            <SelectDefender defendant={defendant} key={index} />
          ))}
        </Box>
        {hasCivilClaimants && (
          <Box component="section" marginBottom={10}>
            <SectionHeading title={formatMessage(strings.civilClaimants)} />
            {workingCase.civilClaimants?.map((civilClaimant) => (
              <Box component="section" marginBottom={5} key={civilClaimant.id}>
                <SelectCivilClaimantAdvocate civilClaimant={civilClaimant} />
              </Box>
            ))}
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase || isSendingNotification}
          nextButtonText={formatMessage(core.continue)}
          nextUrl={`${constants.INDICTMENTS_CONCLUSION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_CONCLUSION_ROUTE)
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Advocates
