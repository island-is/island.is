import {
  AlertMessage,
  Box,
  Input,
  Select,
  Text,
  Option,
  Tooltip,
} from '@island.is/island-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import {
  FormFooter,
  PageLayout,
  Modal,
  CaseNumbers,
  BlueBox,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import {
  Case,
  CaseState,
  NotificationType,
  UpdateCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  ReactSelectOption,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { ValueType } from 'react-select/src/types'
import { useRouter } from 'next/router'
import DateTime from '@island.is/judicial-system-web/src/shared-components/DateTime/DateTime'

export const HearingArrangements: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [courtroomErrorMessage, setCourtroomErrorMessage] = useState('')
  const [defenderEmailErrorMessage, setDefenderEmailErrorMessage] = useState('')

  const router = useRouter()
  const id = router.query.id

  const [courtDateIsValid, setCourtDateIsValid] = useState(true)

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UsersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

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

  const judges = (userData?.users || [])
    .filter((user: User) => user.role === UserRole.JUDGE)
    .map((judge: User) => {
      return { label: judge.name, value: judge.id }
    })

  const registrars = (userData?.users || [])
    .filter((user: User) => user.role === UserRole.REGISTRAR)
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
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

      setWorkingCase(theCase)
    }
  }, [setWorkingCase, workingCase, updateCase, data])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
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
      setIsStepIllegal(
        isNextDisabled(requiredFields) ||
          !workingCase.judge ||
          !workingCase.registrar,
      )
    }
  }, [workingCase, isStepIllegal])

  const setJudge = (id: string) => {
    if (workingCase) {
      setAndSendToServer('judgeId', id, workingCase, setWorkingCase, updateCase)

      const judge = userData?.users.find((j) => j.id === id)

      setWorkingCase({ ...workingCase, judge: judge })
    }
  }

  const setRegistrar = (id: string) => {
    if (workingCase) {
      setAndSendToServer(
        'registrarId',
        id,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      const registrar = userData?.users.find((r) => r.id === id)

      setWorkingCase({ ...workingCase, registrar: registrar })
    }
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={loading || userLoading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                Fyrirtaka
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
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Dómari{' '}
                  <Tooltip text="Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð." />
                </Text>
              </Box>
              <Select
                name="judge"
                label="Veldu dómara"
                placeholder="Velja héraðsdómara"
                defaultValue={defaultJudge}
                options={judges}
                onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                  setJudge(
                    (selectedOption as ReactSelectOption).value.toString(),
                  )
                }
                required
              />
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Dómritari{' '}
                  <Tooltip text="Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti." />
                </Text>
              </Box>
              <Select
                name="registrar"
                label="Veldu dómritara"
                placeholder="Velja dómritara"
                defaultValue={defaultRegistrar}
                options={registrars}
                onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                  setRegistrar(
                    (selectedOption as ReactSelectOption).value.toString(),
                  )
                }
                required
              />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Skrá fyrirtökutíma
                </Text>
              </Box>
              <Box marginBottom={3}>
                <BlueBox>
                  <Box marginBottom={2}>
                    <DateTime
                      name="courtDate"
                      selectedDate={
                        workingCase.courtDate
                          ? new Date(workingCase.courtDate)
                          : undefined
                      }
                      minDate={new Date()}
                      onChange={(date: Date | undefined, valid: boolean) => {
                        newSetAndSendDateToServer(
                          'courtDate',
                          date,
                          valid,
                          workingCase,
                          setWorkingCase,
                          setCourtDateIsValid,
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
                </BlueBox>
              </Box>
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
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${workingCase.id}`}
              nextIsDisabled={
                workingCase.state === CaseState.DRAFT ||
                isStepIllegal ||
                !courtDateIsValid
              }
              nextIsLoading={isSendingNotification}
              onNextButtonClick={async () => {
                const notificationSent = await sendNotification(workingCase.id)

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (notificationSent && !window.Cypress) {
                  setModalVisible(true)
                } else {
                  router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
                }
              }}
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title="Tilkynning um fyrirtökutíma hefur verið send"
              text="Tilkynning um fyrirtökutíma hefur verið send á ákæranda, fangelsi og verjanda hafi verjandi verið skráður."
              handlePrimaryButtonClick={() => {
                router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
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
