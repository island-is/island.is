import {
  AlertMessage,
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { isNextDisabled } from '../../../utils/stepHelper'
import { Validation } from '../../../utils/validate'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import { useHistory, useParams } from 'react-router-dom'
import {
  Case,
  CaseState,
  NotificationType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import Modal from '../../../shared-components/Modal/Modal'
import TimeInputField from '@island.is/judicial-system-web/src/shared-components/TimeInputField/TimeInputField'
import {
  setAndSendDateToServer,
  validateAndSendTimeToServer,
  validateAndSendToServer,
  removeTabsValidateAndSet,
  validateAndSetTime,
} from '@island.is/judicial-system-web/src/utils/formHelper'

interface CaseData {
  case?: Case
}

export const HearingArrangements: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [courtDateErrorMessage, setCourtDateErrorMessage] = useState('')
  const [courtTimeErrorMessage, setCourtTimeErrorMessage] = useState('')
  const [courtroomErrorMessage, setCourtroomErrorMessage] = useState('')
  const [defenderEmailErrorMessage, setDefenderEmailErrorMessage] = useState('')

  const courtTimeRef = useRef<HTMLInputElement>(null)

  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = useCallback(
    async (id: string, updateCase: UpdateCase) => {
      const { data } = await updateCaseMutation({
        variables: { input: { id, ...updateCase } },
      })
      const resCase = data?.updateCase
      if (resCase) {
        // Do something with the result. In particular, we want th modified timestamp passed between
        // the client and the backend so that we can handle multiple simultanious updates.
      }
      return resCase
    },
    [updateCaseMutation],
  )

  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.COURT_DATE,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  useEffect(() => {
    document.title = 'Fyrirtökutími - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      let theCase = data.case

      if (!theCase.courtDate && theCase.requestedCourtDate) {
        updateCase(
          theCase.id,
          parseString('courtDate', theCase.requestedCourtDate),
        )

        theCase = { ...theCase, courtDate: theCase.requestedCourtDate }
      }

      if (!theCase.defenderName && theCase.requestedDefenderName) {
        updateCase(
          theCase.id,
          parseString('defenderName', theCase.requestedDefenderName),
        )

        theCase = { ...theCase, defenderName: theCase.requestedDefenderName }
      }

      if (!theCase.defenderEmail && theCase.requestedDefenderEmail) {
        updateCase(
          theCase.id,
          parseString('defenderEmail', theCase.requestedDefenderEmail),
        )

        theCase = { ...theCase, defenderEmail: theCase.requestedDefenderEmail }
      }

      setWorkingCase(theCase)
    }
  }, [setWorkingCase, workingCase, updateCase, data])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.courtDate || '',
        validations: ['empty'],
      },
      {
        value: courtTimeRef.current?.value || '',
        validations: ['empty', 'time-format'],
      },
      {
        value: workingCase?.courtRoom || '',
        validations: ['empty'],
      },
      {
        value: workingCase?.defenderEmail || '',
        validations: ['email-format'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, isStepIllegal])

  return (
    <PageLayout
      activeSection={Sections.JUDGE}
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Fyrirtökutími
            </Text>
          </Box>
          {workingCase.state === CaseState.DRAFT && (
            <Box marginBottom={8}>
              <AlertMessage
                type="info"
                title="Krafa hefur ekki verið staðfest af ákæranda"
                message="Þú getur úthlutað fyrirtökutíma, dómsal og verjanda en ekki er hægt að halda áfram fyrr en ákærandi hefur staðfest kröfuna."
              />
            </Box>
          )}
          <Box component="section" marginBottom={7}>
            <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Skrá fyrirtökutíma
              </Text>
            </Box>
            <Box marginBottom={3}>
              <GridRow>
                <GridColumn span="7/12">
                  <DatePicker
                    id="courtDate"
                    label="Veldu dagsetningu"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    errorMessage={courtDateErrorMessage}
                    hasError={courtDateErrorMessage !== ''}
                    minDate={new Date()}
                    selected={
                      workingCase.courtDate
                        ? parseISO(workingCase.courtDate.toString())
                        : null
                    }
                    handleCloseCalendar={(date: Date | null) => {
                      setAndSendDateToServer(
                        'courtDate',
                        workingCase.courtDate,
                        date,
                        workingCase,
                        true,
                        setWorkingCase,
                        updateCase,
                        setCourtDateErrorMessage,
                      )
                    }}
                    required
                  />
                </GridColumn>
                <GridColumn span="5/12">
                  <TimeInputField
                    disabled={!workingCase.courtDate}
                    onChange={(evt) =>
                      validateAndSetTime(
                        'courtDate',
                        workingCase.courtDate,
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        setWorkingCase,
                        courtTimeErrorMessage,
                        setCourtTimeErrorMessage,
                      )
                    }
                    onBlur={(evt) =>
                      validateAndSendTimeToServer(
                        'courtDate',
                        workingCase.courtDate,
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        updateCase,
                        setCourtTimeErrorMessage,
                      )
                    }
                  >
                    <Input
                      name="courtTime"
                      label="Tímasetning"
                      placeholder="Settu inn tíma"
                      errorMessage={courtTimeErrorMessage}
                      hasError={courtTimeErrorMessage !== ''}
                      defaultValue={
                        workingCase.courtDate?.includes('T')
                          ? formatDate(workingCase.courtDate, TIME_FORMAT)
                          : undefined
                      }
                      ref={courtTimeRef}
                      required
                    />
                  </TimeInputField>
                </GridColumn>
              </GridRow>
            </Box>
            <Input
              name="courtroom"
              label="Dómsalur"
              defaultValue={workingCase.courtRoom}
              placeholder="Skráðu inn dómsal"
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtRoom',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtroomErrorMessage,
                  setCourtroomErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtRoom',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtroomErrorMessage,
                )
              }
              errorMessage={courtroomErrorMessage}
              hasError={courtroomErrorMessage !== ''}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Skipaður verjandi
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                name="defenderName"
                label="Nafn verjanda"
                defaultValue={workingCase.defenderName}
                placeholder="Fullt nafn"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'defenderName',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'defenderName',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
              />
            </Box>
            <Input
              name="defenderEmail"
              label="Netfang verjanda"
              defaultValue={workingCase.defenderEmail}
              placeholder="Netfang"
              errorMessage={defenderEmailErrorMessage}
              hasError={defenderEmailErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'defenderEmail',
                  event,
                  ['email-format'],
                  workingCase,
                  setWorkingCase,
                  defenderEmailErrorMessage,
                  setDefenderEmailErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'defenderEmail',
                  event.target.value,
                  ['email-format'],
                  workingCase,
                  updateCase,
                  setDefenderEmailErrorMessage,
                )
              }
            />
          </Box>
          <FormFooter
            nextIsDisabled={
              workingCase.state === CaseState.DRAFT || isStepIllegal
            }
            nextIsLoading={isSendingNotification}
            onNextButtonClick={async () => {
              const notificationSent = await sendNotification(workingCase.id)

              if (notificationSent) {
                setModalVisible(true)
              } else {
                history.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
              }
            }}
          />

          {modalVisible && (
            <Modal
              title="Tilkynning um fyrirtökutíma hefur verið send"
              text="Tilkynning um fyrirtökutíma hefur verið send á ákæranda, fangelsi og verjanda hafi verjandi verið skráður."
              handlePrimaryButtonClick={() => {
                history.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
              }}
              primaryButtonText="Loka glugga"
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default HearingArrangements
