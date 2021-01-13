import React, { useEffect, useState } from 'react'
import {
  Text,
  GridRow,
  GridColumn,
  Box,
  DatePicker,
  Input,
  Tooltip,
  Select,
} from '@island.is/island-ui/core'
import {
  Case,
  CaseState,
  CaseTransition,
  NotificationType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { isNextDisabled } from '../../../../utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import parseISO from 'date-fns/parseISO'
import { FormFooter } from '../../../../shared-components/FormFooter'
import { parseTransition } from '@island.is/judicial-system-web/src/utils/formatters'
import * as Constants from '../../../../utils/constants'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import { useHistory, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  ProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import TimeInputField from '@island.is/judicial-system-web/src/shared-components/TimeInputField/TimeInputField'
import {
  setAndSendDateToServer,
  validateAndSendTimeToServer,
  validateAndSetTime,
  setAndSendToServer,
  getTimeFromDate,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { ValueType } from 'react-select/src/types'
import Modal from '../../../../shared-components/Modal/Modal'

interface CaseData {
  case?: Case
}

export const StepTwo: React.FC = () => {
  const history = useHistory()

  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [arrestTime, setArrestTime] = useState<string | undefined>('')
  const [requestedCourtTime, setRequestedCourtTime] = useState<string>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const { id } = useParams<{ id: string }>()

  const [arrestDateErrorMessage, setArrestDateErrorMessage] = useState<string>(
    '',
  )

  const [arrestTimeErrorMessage, setArrestTimeErrorMessage] = useState<string>(
    '',
  )

  const [
    requestedCourtDateErrorMessage,
    setRequestedCourtDateErrorMessage,
  ] = useState<string>('')

  const [
    requestedCourtTimeErrorMessage,
    setRequestedCourtTimeErrorMessage,
  ] = useState<string>('')

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.HEADS_UP,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const courts = [
    {
      label: 'Héraðsdómur Reykjavíkur',
      value: 0,
    },
    {
      label: 'Héraðsdómur Vesturlands',
      value: 1,
    },
    {
      label: 'Héraðsdómur Vestfjarða',
      value: 2,
    },
    {
      label: 'Héraðsdómur Norðurlands vestra',
      value: 3,
    },
    {
      label: 'Héraðsdómur Norðurlands eystra',
      value: 4,
    },
    {
      label: 'Héraðsdómur Austurlands',
      value: 5,
    },
    {
      label: 'Héraðsdómur Reykjaness',
      value: 6,
    },
  ]

  const defaultCourt = courts.filter(
    (court) => court.label === workingCase?.court,
  )

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const transitionSuccess = await transitionCase()

    if (transitionSuccess) {
      if (
        workingCase.notifications?.find(
          (notification) => notification.type === NotificationType.HEADS_UP,
        )
      ) {
        history.push(`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`)
      } else {
        setModalVisible(true)
      }
    } else {
      // TODO: Handle error
    }
  }

  useEffect(() => {
    document.title = 'Óskir um fyrirtöku - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data) {
      setArrestTime(getTimeFromDate(data.case?.arrestDate))
      setRequestedCourtTime(getTimeFromDate(data.case?.requestedCourtDate))

      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.requestedCourtDate || '',
        validations: ['empty'],
      },
      {
        value: requestedCourtTime || '',
        validations: ['empty', 'time-format'],
      },
    ]

    if (workingCase?.arrestDate) {
      requiredFields.push({
        value: arrestTime || '',
        validations: ['empty', 'time-format'],
      })
    }

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, setIsStepIllegal, arrestTime, requestedCourtTime])

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const [transitionCaseMutation, { loading: transitionLoading }] = useMutation(
    TransitionCaseMutation,
  )

  const transitionCase = async () => {
    if (!workingCase) {
      return false
    }

    switch (workingCase.state) {
      case CaseState.NEW:
        try {
          // Parse the transition request
          const transitionRequest = parseTransition(
            workingCase.modified,
            CaseTransition.OPEN,
          )

          const { data } = await transitionCaseMutation({
            variables: { input: { id: workingCase.id, ...transitionRequest } },
          })

          if (!data) {
            return false
          }

          setWorkingCase({
            ...workingCase,
            state: data.transitionCase.state,
          })

          return true
        } catch (e) {
          console.log(e)

          return false
        }
      case CaseState.DRAFT:
      case CaseState.SUBMITTED:
      case CaseState.RECEIVED:
        return true
      default:
        return false
    }
  }

  return (
    <PageLayout
      activeSection={Sections.PROSECUTOR}
      activeSubSection={ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_TWO}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={7}>
            <Text as="h1" variant="h1">
              Óskir um fyrirtöku
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Dómstóll
              </Text>
            </Box>
            <Select
              name="court"
              label="Veldu dómstól"
              defaultValue={{
                label:
                  defaultCourt.length > 0
                    ? defaultCourt[0].label
                    : courts[0].label,
                value:
                  defaultCourt.length > 0
                    ? defaultCourt[0].value
                    : courts[0].value,
              }}
              options={courts}
              onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                setAndSendToServer(
                  'court',
                  (selectedOption as ReactSelectOption).label,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Tími handtöku
              </Text>
            </Box>
            <GridRow>
              <GridColumn span="5/8">
                <DatePicker
                  id="arrestDate"
                  label="Veldu dagsetningu"
                  placeholderText="Veldu dagsetningu"
                  locale="is"
                  errorMessage={arrestDateErrorMessage}
                  hasError={arrestDateErrorMessage !== ''}
                  selected={
                    workingCase.arrestDate
                      ? new Date(workingCase.arrestDate)
                      : null
                  }
                  handleCloseCalendar={(date) =>
                    setAndSendDateToServer(
                      'arrestDate',
                      workingCase.arrestDate,
                      date,
                      workingCase,
                      false,
                      setWorkingCase,
                      updateCase,
                      setArrestDateErrorMessage,
                    )
                  }
                />
              </GridColumn>
              <GridColumn span="3/8">
                <TimeInputField
                  disabled={!workingCase.arrestDate}
                  onChange={(evt) =>
                    validateAndSetTime(
                      'arrestDate',
                      workingCase.arrestDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      arrestTimeErrorMessage,
                      setArrestTimeErrorMessage,
                      setArrestTime,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'arrestDate',
                      workingCase.arrestDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setArrestTimeErrorMessage,
                    )
                  }
                >
                  <Input
                    data-testid="arrestTime"
                    name="arrestTime"
                    label="Tímasetning (kk:mm)"
                    placeholder="Veldu tíma"
                    errorMessage={arrestTimeErrorMessage}
                    hasError={
                      arrestTimeErrorMessage !== '' &&
                      workingCase.arrestDate !== null
                    }
                    defaultValue={arrestTime}
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
          </Box>
          <Box component="section" marginBottom={10}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Ósk um fyrirtökudag og tíma{' '}
                <Tooltip text='Vinsamlegast sláðu tímann sem þú óskar eftir að málið verður tekið fyrir. Gáttin birtir tímann sem: "Eftir kl." tíminn sem þú slærð inn. Það þarf því ekki að velja nákvæma tímasetningu hvenær óskað er eftir fyrirtöku, heldur bara eftir hvaða tíma myndi henta að taka málið fyrir.' />
              </Text>
            </Box>
            <GridRow>
              <GridColumn span="5/8">
                <DatePicker
                  id="reqCourtDate"
                  label="Veldu dagsetningu"
                  placeholderText="Veldu dagsetningu"
                  locale="is"
                  errorMessage={requestedCourtDateErrorMessage}
                  hasError={requestedCourtDateErrorMessage !== ''}
                  icon={workingCase.courtDate ? 'lockClosed' : undefined}
                  minDate={new Date()}
                  selected={
                    workingCase.requestedCourtDate
                      ? parseISO(workingCase.requestedCourtDate.toString())
                      : null
                  }
                  disabled={Boolean(workingCase.courtDate)}
                  handleCloseCalendar={(date) => {
                    setAndSendDateToServer(
                      'requestedCourtDate',
                      workingCase.requestedCourtDate,
                      date,
                      workingCase,
                      true,
                      setWorkingCase,
                      updateCase,
                      setRequestedCourtDateErrorMessage,
                    )
                  }}
                  required
                />
              </GridColumn>
              <GridColumn span="3/8">
                <TimeInputField
                  disabled={
                    !workingCase.requestedCourtDate ||
                    Boolean(workingCase.courtDate)
                  }
                  onChange={(evt) =>
                    validateAndSetTime(
                      'requestedCourtDate',
                      workingCase.requestedCourtDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      requestedCourtTimeErrorMessage,
                      setRequestedCourtTimeErrorMessage,
                      setRequestedCourtTime,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'requestedCourtDate',
                      workingCase.requestedCourtDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setRequestedCourtTimeErrorMessage,
                    )
                  }
                >
                  <Input
                    data-testid="requestedCourtDate"
                    name="requestedCourtDate"
                    label="Ósk um tíma (kk:mm)"
                    placeholder="Veldu tíma"
                    errorMessage={requestedCourtTimeErrorMessage}
                    hasError={requestedCourtTimeErrorMessage !== ''}
                    defaultValue={requestedCourtTime}
                    icon={workingCase.courtDate ? 'lockClosed' : undefined}
                    iconType="outline"
                    required
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
            {workingCase.courtDate && (
              <Box marginTop={1}>
                <Text variant="eyebrow">
                  Fyrirtökudegi og tíma hefur verið úthlutað
                </Text>
              </Box>
            )}
          </Box>
          <FormFooter
            onNextButtonClick={async () => await handleNextButtonClick()}
            nextIsDisabled={isStepIllegal || transitionLoading}
            nextIsLoading={transitionLoading}
          />
          {modalVisible && (
            <Modal
              title="Viltu senda tilkynningu?"
              text="Með því að senda tilkynningu á dómara á vakt um að krafa um gæsluvarðhald sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir um stöðu mála."
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              handleClose={() => setModalVisible(false)}
              handleSecondaryButtonClick={() =>
                history.push(`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`)
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(workingCase.id)

                if (notificationSent) {
                  history.push(
                    `${Constants.STEP_THREE_ROUTE}/${workingCase.id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepTwo
