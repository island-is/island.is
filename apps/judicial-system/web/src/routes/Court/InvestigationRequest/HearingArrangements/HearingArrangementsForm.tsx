import React, { useState } from 'react'
import { ValueType } from 'react-select'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  Select,
  Text,
  Tooltip,
  Option,
  Input,
  RadioButton,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseNumbers,
  DateTime,
  FormContentContainer,
  FormFooter,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import {
  NotificationType,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  ReactSelectOption,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isCourtHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { icHearingArrangements as m } from '@island.is/judicial-system-web/messages'
import type { Case, User } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoading: boolean
  users: UserData
  user: User
}

const HearingArrangementsForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading, users, user } = props
  const [modalVisible, setModalVisible] = useState(false)
  const { updateCase, sendNotification, isSendingNotification } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()

  const setJudge = (id: string) => {
    if (workingCase) {
      setAndSendToServer('judgeId', id, workingCase, setWorkingCase, updateCase)

      const judge = users?.users.find((j) => j.id === id)

      setWorkingCase({ ...workingCase, judge: judge })
    }
  }

  const setRegistrar = (id?: string) => {
    if (workingCase) {
      setAndSendToServer(
        'registrarId',
        id,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      const registrar = users?.users.find((r) => r.id === id)

      setWorkingCase({ ...workingCase, registrar })
    }
  }

  const judges = (users?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id }
    })

  const registrars = (users?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.REGISTRAR &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )

  const handleNextButtonClick = () => {
    if (
      workingCase.notifications?.find(
        (notification) => notification.type === NotificationType.COURT_DATE,
      )
    ) {
      router.push(`${Constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`)
    } else {
      setModalVisible(true)
    }
  }

  return (
    <>
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
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.setJudge.title)} `}
              <Tooltip text={formatMessage(m.sections.setJudge.tooltip)} />
            </Text>
          </Box>
          <Select
            name="judge"
            label="Veldu dómara"
            placeholder="Velja héraðsdómara"
            value={defaultJudge}
            options={judges}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setJudge((selectedOption as ReactSelectOption).value.toString())
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.setRegistrar.title)} `}
              <Tooltip text={formatMessage(m.sections.setRegistrar.tooltip)} />
            </Text>
          </Box>
          <Select
            name="registrar"
            label="Veldu dómritara"
            placeholder="Velja dómritara"
            value={defaultRegistrar}
            options={registrars}
            onChange={(selectedOption: ValueType<ReactSelectOption>) => {
              if (selectedOption) {
                setRegistrar(
                  (selectedOption as ReactSelectOption).value.toString(),
                )
              } else {
                setRegistrar(undefined)
              }
            }}
            isClearable
          />
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
                  setAndSendToServer(
                    'sessionArrangements',
                    SessionArrangements.ALL_PRESENT,
                    workingCase,
                    setWorkingCase,
                    updateCase,
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
                  setAndSendToServer(
                    'sessionArrangements',
                    SessionArrangements.ALL_PRESENT_SPOKESPERSON,
                    workingCase,
                    setWorkingCase,
                    updateCase,
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
                setAndSendToServer(
                  'sessionArrangements',
                  SessionArrangements.PROSECUTOR_PRESENT,
                  workingCase,
                  setWorkingCase,
                  updateCase,
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
                  selectedDate={workingCase.courtDate}
                  minDate={new Date()}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    newSetAndSendDateToServer(
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
                value={workingCase.courtRoom || ''}
                placeholder="Skráðu inn dómsal"
                autoComplete="off"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'courtRoom',
                    event,
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
          previousUrl={`${Constants.IC_OVERVIEW_ROUTE}/${workingCase.id}`}
          onNextButtonClick={handleNextButtonClick}
          nextIsLoading={isLoading}
          nextIsDisabled={!isCourtHearingArrangementsStepValidIC(workingCase)}
          hideNextButton={
            user.id !== workingCase.judge?.id &&
            user.id !== workingCase.registrar?.id
          }
          infoBoxText={
            user.id !== workingCase.judge?.id &&
            user.id !== workingCase.registrar?.id
              ? formatMessage(m.footer.infoPanelForRestrictedAccess)
              : undefined
          }
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
              router.push(
                `${Constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`,
              )
            }
          }}
          handleSecondaryButtonClick={() => {
            router.push(`${Constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`)
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
