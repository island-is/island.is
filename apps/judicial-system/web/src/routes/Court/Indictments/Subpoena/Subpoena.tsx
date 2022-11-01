import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  CourtArrangements,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  SelectSubpoenaType,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import { Box } from '@island.is/island-ui/core'
import {
  NotificationType,
  SubpoenaType,
} from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { isSubpoenaStepValid } from '@island.is/judicial-system-web/src/utils/validate'
import * as constants from '@island.is/judicial-system/consts'

import { subpoena as strings } from './Subpoena.strings'

const Subpoena: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modalVisible, setModalVisible] = useState(false)
  const { formatMessage } = useIntl()
  const {
    courtDate,
    handleCourtDateChange,
    courtDateHasChanged,
  } = useCourtArrangements(workingCase)
  const { setAndSendCaseToServer, sendNotification } = useCase()

  const handleSubpoenaTypeChange = (subpoenaType: SubpoenaType) => {
    setAndSendCaseToServer(
      [{ subpoenaType, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  const handleNextButtonClick = useCallback(() => {
    const hasSentNotification = workingCase?.notifications?.find(
      (notification) => notification.type === NotificationType.COURT_DATE,
    )

    setAndSendCaseToServer(
      [
        {
          courtDate: courtDate
            ? formatDateForServer(new Date(courtDate))
            : undefined,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )

    if (hasSentNotification && !courtDateHasChanged) {
      router.push(
        `${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`,
      )
    } else {
      setModalVisible(true)
    }
  }, [
    workingCase,
    setAndSendCaseToServer,
    courtDate,
    setWorkingCase,
    courtDateHasChanged,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={IndictmentsCourtSubsections.SUBPEONA}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.court.indictments.subpoena)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.selectSubpoenaTypeHeading)}
            required
          />
          <SelectSubpoenaType
            workingCase={workingCase}
            onChange={handleSubpoenaTypeChange}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.courtArrangementsHeading)}
          />
          <CourtArrangements
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            handleCourtDateChange={handleCourtDateChange}
            selectedCourtDate={courtDate}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={handleNextButtonClick}
          nextButtonText={formatMessage(strings.nextButtonText)}
          nextIsDisabled={!isSubpoenaStepValid(workingCase, courtDate)}
        />
      </FormContentContainer>
      {modalVisible && (
        <Modal
          title={formatMessage(strings.modalTitle)}
          onPrimaryButtonClick={() => {
            sendNotification(workingCase.id, NotificationType.COURT_DATE)
            router.push(
              `${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`,
            )
          }}
          onSecondaryButtonClick={() => {
            router.push(
              `${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`,
            )
          }}
          primaryButtonText={formatMessage(strings.modalPrimaryButtonText)}
          secondaryButtonText={formatMessage(core.continue)}
          isPrimaryButtonLoading={false}
        />
      )}
    </PageLayout>
  )
}

export default Subpoena
