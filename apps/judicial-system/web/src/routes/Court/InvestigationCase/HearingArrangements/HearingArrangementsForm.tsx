import React, { useState, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import formatISO from 'date-fns/formatISO'

import {
  Box,
  Text,
  Tooltip,
  Input,
  RadioButton,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseInfo,
  DateTime,
  FormContentContainer,
  FormFooter,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import {
  NotificationType,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isCourtHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'
import { icHearingArrangements as m } from '@island.is/judicial-system-web/messages'
import type { Case, User } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  user: User
}

const HearingArrangementsForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, user } = props
  const [modalVisible, setModalVisible] = useState(false)
  const {
    updateCase,
    sendNotification,
    isSendingNotification,
    autofill,
  } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()

  const [courtDate, setCourtDate] = useState<Case['courtDate']>(
    workingCase.courtDate || workingCase.requestedCourtDate,
  )

  const handleNextButtonClick = useCallback(() => {
    autofill(
      [{ key: 'courtDate', value: courtDate, force: true }],
      workingCase,
      setWorkingCase,
    )
    if (
      workingCase.notifications?.find(
        (notification) => notification.type === NotificationType.COURT_DATE,
      )
    ) {
      router.push(`${Constants.IC_RULING_ROUTE}/${workingCase.id}`)
    } else {
      setModalVisible(true)
    }
  }, [
    autofill,
    courtDate,
    workingCase,
    setWorkingCase,
    router,
    setModalVisible,
  ])

  return (
    <>
      <FormContentContainer>
        {workingCase.requestProsecutorOnlySession &&
          workingCase.prosecutorOnlySessionRequest && (
            <Box marginBottom={workingCase.comments ? 2 : 5}>
              <AlertMessage
                type="warning"
                title={formatMessage(m.requestProsecutorOnlySession)}
                message={workingCase.prosecutorOnlySessionRequest}
              />
            </Box>
          )}
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
          <CaseInfo workingCase={workingCase} userRole={user.role} />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.sessionArrangements.heading)} `}
              <Text as="span" color="red600" fontWeight="semiBold">
                *
              </Text>
              <Tooltip
                text={formatMessage(m.sections.sessionArrangements.tooltip)}
              />
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={2}>
              <RadioButton
                name="session-arrangements-all-present"
                id="session-arrangements-all-present"
                label={formatMessage(
                  m.sections.sessionArrangements.options.allPresent,
                )}
                checked={
                  workingCase.sessionArrangements ===
                  SessionArrangements.ALL_PRESENT
                }
                onChange={() => {
                  autofill(
                    [
                      {
                        key: 'sessionArrangements',
                        value: SessionArrangements.ALL_PRESENT,
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                name="session-arrangements-all-present_spokesperson"
                id="session-arrangements-all-present_spokesperson"
                label={formatMessage(
                  m.sections.sessionArrangements.options.allPresentSpokesperson,
                )}
                checked={
                  workingCase.sessionArrangements ===
                  SessionArrangements.ALL_PRESENT_SPOKESPERSON
                }
                onChange={() => {
                  autofill(
                    [
                      {
                        key: 'sessionArrangements',
                        value: SessionArrangements.ALL_PRESENT_SPOKESPERSON,
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </Box>
            <RadioButton
              name="session-arrangements-prosecutor-present"
              id="session-arrangements-prosecutor-present"
              label={formatMessage(
                m.sections.sessionArrangements.options.prosecutorPresent,
              )}
              checked={
                workingCase.sessionArrangements ===
                SessionArrangements.PROSECUTOR_PRESENT
              }
              onChange={() => {
                autofill(
                  [
                    {
                      key: 'sessionArrangements',
                      value: SessionArrangements.PROSECUTOR_PRESENT,
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              large
              backgroundColor="white"
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.requestedCourtDate.title)}
            </Text>
          </Box>
          <Box marginBottom={2}>
            <BlueBox>
              <Box marginBottom={2}>
                <DateTime
                  name="courtDate"
                  selectedDate={courtDate}
                  minDate={new Date()}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    if (date && valid) {
                      setCourtDate(
                        formatISO(date, { representation: 'complete' }),
                      )
                    }
                  }}
                  blueBox={false}
                  required
                />
              </Box>
              <Input
                data-testid="courtroom"
                name="courtroom"
                label="Dómsalur"
                value={workingCase.courtRoom || ''}
                placeholder="Skráðu inn dómsal"
                autoComplete="off"
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
        {(workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT ||
          workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT_SPOKESPERSON) && (
          <Box component="section" marginBottom={8}>
            <DefenderInfo
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_OVERVIEW_ROUTE}/${workingCase.id}`}
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={
            !isCourtHearingArrangementsStepValidIC(workingCase, courtDate)
          }
          nextButtonText={formatMessage(m.continueButton.label)}
        />
      </FormContentContainer>
      {modalVisible && (
        <Modal
          title={formatMessage(m.modal.heading)}
          text={formatMessage(
            workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
              ? m.modal.allPresentText
              : workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? m.modal.allPresentSpokespersonText
              : m.modal.prosecutorPresentText,
          )}
          handlePrimaryButtonClick={async () => {
            const notificationSent = await sendNotification(
              workingCase.id,
              NotificationType.COURT_DATE,
            )

            if (notificationSent) {
              router.push(`${Constants.IC_RULING_ROUTE}/${workingCase.id}`)
            }
          }}
          handleSecondaryButtonClick={() => {
            sendNotification(workingCase.id, NotificationType.COURT_DATE, true)

            router.push(`${Constants.IC_RULING_ROUTE}/${workingCase.id}`)
          }}
          primaryButtonText={formatMessage(m.modal.primaryButtonText)}
          secondaryButtonText={formatMessage(m.modal.secondaryButtonText)}
          isPrimaryButtonLoading={isSendingNotification}
        />
      )}
    </>
  )
}

export default HearingArrangementsForm
