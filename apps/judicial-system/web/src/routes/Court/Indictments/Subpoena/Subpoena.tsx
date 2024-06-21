import React, { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  SectionHeading,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  NotificationType,
  SubpoenaType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { isSubpoenaStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { subpoena as strings } from './Subpoena.strings'
import * as styles from './Subpoena.css'

const Subpoena: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const { updateDefendantState, updateDefendant } = useDefendants()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    courtDateHasChanged,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'arraignmentDate')
  const { sendNotification } = useCase()

  const isArraignmentDone = workingCase.indictmentDecision

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (isArraignmentDone) {
        router.push(`${destination}/${workingCase.id}`)
        return
      }

      const promises: Promise<boolean | undefined>[] = [sendCourtDateToServer()]

      if (workingCase.defendants) {
        workingCase.defendants.forEach((defendant) => {
          promises.push(
            updateDefendant({
              caseId: workingCase.id,
              defendantId: defendant.id,
              subpoenaType: defendant.subpoenaType,
            }),
          )
        })
      }

      const allDataSentToServer = await Promise.all(promises)

      if (!allDataSentToServer.every((result) => result)) {
        return
      }

      if (
        hasSentNotification(
          NotificationType.COURT_DATE,
          workingCase.notifications,
        ).hasSent &&
        !courtDateHasChanged
      ) {
        router.push(`${destination}/${workingCase.id}`)
      } else {
        setNavigateTo(destination)
      }
    },
    [
      isArraignmentDone,
      sendCourtDateToServer,
      workingCase,
      courtDateHasChanged,
      updateDefendant,
    ],
  )

  const stepIsValid = isSubpoenaStepValid(
    workingCase,
    courtDate?.date,
    courtDate?.location,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.subpoena)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.subpoenaTypeTitle)}
            required
          />
          {workingCase.defendants?.map((defendant, index) => (
            <Box
              key={defendant.id}
              marginBottom={index === workingCase.defendants?.length ? 0 : 3}
            >
              <BlueBox>
                <Text as="h4" variant="h4" marginBottom={2}>
                  {defendant.name}
                </Text>
                <Box className={styles.subpoenaTypeGrid}>
                  <RadioButton
                    large
                    name="subpoenaType"
                    id={`subpoenaTypeAbsence${defendant.id}`}
                    backgroundColor="white"
                    label={formatMessage(strings.subpoenaTypeAbsence)}
                    checked={defendant.subpoenaType === SubpoenaType.ABSENCE}
                    onChange={() => {
                      updateDefendantState(
                        {
                          caseId: workingCase.id,
                          defendantId: defendant.id,
                          subpoenaType: SubpoenaType.ABSENCE,
                        },
                        setWorkingCase,
                      )
                    }}
                    disabled={isArraignmentDone}
                  />
                  <RadioButton
                    large
                    name="subpoenaType"
                    id={`subpoenaTypeArrest${defendant.id}`}
                    backgroundColor="white"
                    label={formatMessage(strings.subpoenaTypeArrest)}
                    checked={defendant.subpoenaType === SubpoenaType.ARREST}
                    onChange={() => {
                      updateDefendantState(
                        {
                          caseId: workingCase.id,
                          defendantId: defendant.id,
                          subpoenaType: SubpoenaType.ARREST,
                        },
                        setWorkingCase,
                      )
                    }}
                    disabled={isArraignmentDone}
                  />
                </Box>
              </BlueBox>
            </Box>
          ))}
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.courtArrangementsHeading)}
          />
          <CourtArrangements
            handleCourtDateChange={handleCourtDateChange}
            handleCourtRoomChange={handleCourtRoomChange}
            courtDate={courtDate}
            dateTimeDisabled={isArraignmentDone}
            courtRoomDisabled={isArraignmentDone}
            courtRoomRequired
          />
        </Box>
        <Box component="section" marginBottom={10}>
          {workingCase.defendants?.map((defendant, index) => (
            <Box
              key={defendant.id}
              marginBottom={
                index + 1 === workingCase.defendants?.length ? 0 : 2
              }
            >
              <PdfButton
                caseId={workingCase.id}
                title={`Fyrirkall - ${defendant.name} - PDF`}
                pdfType="subpoena"
                disabled={
                  !courtDate?.date ||
                  !courtDate?.location ||
                  !defendant.subpoenaType
                }
                elementId={defendant.id}
                queryParameters={`arraignmentDate=${courtDate?.date}&location=${courtDate?.location}&subpoenaType=${defendant.subpoenaType}`}
              />
            </Box>
          ))}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() => {
            handleNavigationTo(constants.INDICTMENTS_DEFENDER_ROUTE)
          }}
          nextButtonText={
            isArraignmentDone
              ? undefined
              : formatMessage(strings.nextButtonText)
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title={formatMessage(strings.modalTitle, {
            courtDateHasChanged,
          })}
          onPrimaryButtonClick={() => {
            sendNotification(workingCase.id, NotificationType.COURT_DATE)
            router.push(`${navigateTo}/${workingCase.id}`)
          }}
          onSecondaryButtonClick={() => {
            router.push(`${navigateTo}/${workingCase.id}`)
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
