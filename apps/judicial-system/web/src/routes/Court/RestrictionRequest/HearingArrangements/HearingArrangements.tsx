import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input, Text, AlertMessage } from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  CaseInfo,
  BlueBox,
  FormContentContainer,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { isCourtHearingArrangemenstStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { CaseType, NotificationType } from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { rcHearingArrangements as m } from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const HearingArrangements: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const [modalVisible, setModalVisible] = useState(false)

  const router = useRouter()
  const id = router.query.id

  const {
    updateCase,
    autofill,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const { formatMessage } = useIntl()

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase = workingCase

      if (theCase.requestedCourtDate) {
        autofill('courtDate', theCase.requestedCourtDate, theCase)
      }

      setWorkingCase(theCase)
    }
  }, [autofill, isCaseUpToDate, setWorkingCase, workingCase])

  const handleNextButtonClick = () => {
    if (
      workingCase?.notifications?.find(
        (notification) => notification.type === NotificationType.COURT_DATE,
      )
    ) {
      router.push(`${Constants.COURT_RECORD_ROUTE}/${workingCase.id}`)
    } else {
      setModalVisible(true)
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <FormContentContainer>
        {workingCase.comments && (
          <Box marginBottom={5}>
            <AlertMessage
              type="warning"
              title={formatMessage(m.comments.title)}
              message={workingCase.comments}
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.requestedCourtDate.title)}
            </Text>
          </Box>
          <Box marginBottom={3}>
            <BlueBox>
              <Box marginBottom={2}>
                <DateTime
                  name="courtDate"
                  selectedDate={workingCase.courtDate}
                  minDate={new Date()}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    setAndSendDateToServer(
                      'courtDate',
                      date,
                      valid,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }}
                  blueBox={false}
                  required
                />
              </Box>
              <Input
                data-testid="courtroom"
                name="courtroom"
                label="Dómsalur"
                autoComplete="off"
                value={workingCase.courtRoom || ''}
                placeholder="Skráðu inn dómsal"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'courtRoom',
                    event.target.value,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'courtRoom',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
              />
            </BlueBox>
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <DefenderInfo
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.COURT_SINGLE_REQUEST_BASE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={!isCourtHearingArrangemenstStepValidRC(workingCase)}
        />
      </FormContentContainer>
      {modalVisible && (
        <Modal
          title={formatMessage(
            workingCase.type === CaseType.CUSTODY
              ? m.modal.custodyCases.heading
              : m.modal.travelBanCases.heading,
          )}
          text={formatMessage(
            workingCase.type === CaseType.CUSTODY
              ? m.modal.custodyCases.text
              : m.modal.travelBanCases.text,
          )}
          isPrimaryButtonLoading={isSendingNotification}
          handleSecondaryButtonClick={() => {
            router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
          }}
          handlePrimaryButtonClick={async () => {
            const notificationSent = await sendNotification(
              workingCase.id,
              NotificationType.COURT_DATE,
            )

            if (notificationSent) {
              router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
            }
          }}
          primaryButtonText={formatMessage(m.modal.shared.primaryButtonText)}
          secondaryButtonText={formatMessage(
            m.modal.shared.secondaryButtonText,
          )}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
