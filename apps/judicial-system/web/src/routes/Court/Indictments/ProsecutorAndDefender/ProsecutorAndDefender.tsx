import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  ProsecutorSelection,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { titles } from '@island.is/judicial-system-web/messages'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { isProsecutorAndDefenderStepValid } from '@island.is/judicial-system-web/src/utils/validate'
import { NotificationType } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { prosecutorAndDefender as m } from './ProsecutorAndDefender.strings'
import SelectDefender from './SelectDefender'

const HearingArrangements: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const router = useRouter()
  const {
    setAndSendCaseToServer,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const { formatMessage } = useIntl()
  const handleProsecutorChange = useCallback(
    (prosecutorId: string) => {
      setAndSendCaseToServer(
        [
          {
            prosecutorId: prosecutorId,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
      return true
    },
    [workingCase, setWorkingCase, setAndSendCaseToServer],
  )

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      await sendNotification(workingCase.id, NotificationType.DEFENDER_ASSIGNED)
      router.push(`${destination}/${workingCase.id}`)
    },
    [workingCase.id, sendNotification, router],
  )

  const stepIsValid =
    !isSendingNotification && isProsecutorAndDefenderStepValid(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.court.indictments.prosecutorAndDefender)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <AlertMessage
            message={formatMessage(m.alertBannerText)}
            type="info"
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.selectProsecutorHeading)} />
          <ProsecutorSelection onChange={handleProsecutorChange} />
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
          nextButtonText={formatMessage(m.nextButtonText)}
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
