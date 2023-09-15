import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { NotificationType } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isDefenderStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import SelectDefender from './SelectDefender'
import { defender as m } from './Defender.strings'

const HearingArrangements: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const router = useRouter()
  const { sendNotification, isSendingNotification } = useCase()
  const { formatMessage } = useIntl()

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      await sendNotification(workingCase.id, NotificationType.DEFENDER_ASSIGNED)
      router.push(`${destination}/${workingCase.id}`)
    },
    [workingCase.id, sendNotification, router],
  )

  const stepIsValid = !isSendingNotification && isDefenderStepValid(workingCase)

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
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <AlertMessage
            message={formatMessage(m.alertBannerText)}
            type="info"
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(m.selectDefenderHeading)}
            required
          />
          {workingCase.defendants?.map((defendant, index) => (
            <SelectDefender defendant={defendant} key={index} />
          ))}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_SUBPOENA_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase || isSendingNotification}
          nextButtonText={formatMessage(core.continue)}
          nextUrl={`${constants.INDICTMENTS_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_COURT_RECORD_ROUTE)
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default HearingArrangements
