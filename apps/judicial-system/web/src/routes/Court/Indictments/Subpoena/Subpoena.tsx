import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
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
  SectionHeading,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentDecision,
  NotificationType,
  SubpoenaType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { isSubpoenaStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { subpoena as strings } from './Subpoena.strings'
import * as styles from './Subpoena.css'

const Subpoena: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [subpoenaType, setSubpoenaType] = useState<SubpoenaType[]>()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    courtDateHasChanged,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'arraignmentDate')
  const { sendNotification } = useCase()

  const isPostponed =
    workingCase.indictmentDecision ===
      IndictmentDecision.POSTPONING_UNTIL_VERDICT ||
    workingCase.indictmentDecision === IndictmentDecision.POSTPONING

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (isPostponed) {
        router.push(`${destination}/${workingCase.id}`)
        return
      }

      const courtDateSentToServer = await sendCourtDateToServer()

      if (!courtDateSentToServer) {
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
    [isPostponed, sendCourtDateToServer, workingCase, courtDateHasChanged],
  )

  useEffect(() => {
    if (workingCase && workingCase.defendants) {
      const a = workingCase.defendants.map((defendant) => {
        if (defendant.subpoenaType) {
          return defendant.subpoenaType
        }
        return null
      })
      setSubpoenaType(a.filter((x) => x !== null) as SubpoenaType[])
    }
  }, [workingCase])

  const stepIsValid = isSubpoenaStepValid(
    workingCase,
    courtDate?.date,
    courtDate?.location,
    subpoenaType,
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
          {subpoenaType &&
            workingCase.defendants?.map((defendant, index) => (
              <BlueBox key={defendant.id}>
                <Text as="h4" variant="h4" marginBottom={2}>
                  {defendant.name}
                </Text>
                <Box className={styles.subpoenaTypeGrid}>
                  <RadioButton
                    large
                    name="subpoenaType"
                    id="subpoenaTypeAbsence"
                    backgroundColor="white"
                    label={formatMessage(strings.subpoenaTypeAbsence)}
                    checked={subpoenaType[index] === SubpoenaType.ABSENCE}
                    onChange={() => {
                      setSubpoenaType((prev) => {
                        prev?.splice(index, 1, SubpoenaType.ABSENCE)

                        return prev && prev.length > 0
                          ? prev
                          : [SubpoenaType.ABSENCE]
                      })
                    }}
                    disabled={isPostponed}
                  />
                  <RadioButton
                    large
                    name="subpoenaType"
                    id="subpoenaTypeArrest"
                    backgroundColor="white"
                    label={formatMessage(strings.subpoenaTypeArrest)}
                    checked={subpoenaType[index] === SubpoenaType.ARREST}
                    onChange={() => {
                      setSubpoenaType((prev) => {
                        prev?.splice(index, 1, SubpoenaType.ARREST)

                        return prev && prev.length > 0
                          ? prev
                          : [SubpoenaType.ARREST]
                      })
                    }}
                    disabled={isPostponed}
                  />
                </Box>
              </BlueBox>
            ))}
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.courtArrangementsHeading)}
          />
          <CourtArrangements
            handleCourtDateChange={handleCourtDateChange}
            handleCourtRoomChange={handleCourtRoomChange}
            courtDate={courtDate}
            dateTimeDisabled={isPostponed}
            courtRoomDisabled={isPostponed}
            courtRoomRequired
          />
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
            isPostponed ? undefined : formatMessage(strings.nextButtonText)
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
