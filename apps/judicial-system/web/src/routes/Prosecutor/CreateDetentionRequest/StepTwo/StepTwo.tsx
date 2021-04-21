import React, { useContext, useEffect, useState } from 'react'
import { ValueType } from 'react-select/src/types'
import { useMutation, useQuery } from '@apollo/client'

import { Text, Box, Tooltip, Select, Option } from '@island.is/island-ui/core'
import {
  Case,
  CaseState,
  CaseTransition,
  CaseType,
  NotificationType,
  UpdateCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  ProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  setAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  FormFooter,
  PageLayout,
  Modal,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import { parseTransition } from '@island.is/judicial-system-web/src/utils/formatters'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { useRouter } from 'next/router'
import DateTime from '@island.is/judicial-system-web/src/shared-components/DateTime/DateTime'

interface CaseData {
  case?: Case
}

export const StepTwo: React.FC = () => {
  const router = useRouter()
  const id = router.query.id

  const [workingCase, setWorkingCase] = useState<Case>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [arrestDateIsValid, setArrestDateIsValid] = useState(true)
  const [requestedCourtDateIsValid, setRequestedCourtDateIsValid] = useState(
    false,
  )

  const { user } = useContext(UserContext)

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { data: userData, loading: userLoading } = useQuery(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
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

  const prosecutors = userData?.users
    .filter(
      (aUser: User, _: number) =>
        aUser.role === UserRole.PROSECUTOR &&
        aUser.institution?.id === user?.institution?.id,
    )
    .map((prosecutor: User, _: number) => {
      return { label: prosecutor.name, value: prosecutor.id }
    })

  const defaultCourt = courts.filter(
    (court) => court.label === workingCase?.court,
  )

  const defaultProsecutor = prosecutors?.filter(
    (prosecutor: Option) => prosecutor.value === workingCase?.prosecutor?.id,
  )

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const transitionSuccess = await transitionCase()

    if (transitionSuccess) {
      if (
        (workingCase.state !== CaseState.NEW &&
          workingCase.state !== CaseState.DRAFT) ||
        // TODO: Ignore failed notifications
        workingCase.notifications?.find(
          (notification) => notification.type === NotificationType.HEADS_UP,
        )
      ) {
        router.push(`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`)
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
      setRequestedCourtDateIsValid(data.case?.requestedCourtDate !== null)

      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

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
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_TWO}
      isLoading={loading || userLoading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                Óskir um fyrirtöku
              </Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Ákærandi{' '}
                  <Box component="span" data-testid="prosecutor-tooltip">
                    <Tooltip text="Sá saksóknari sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis." />
                  </Box>
                </Text>
              </Box>
              <Select
                name="prosecutor"
                label="Veldu saksóknara"
                defaultValue={defaultProsecutor}
                options={prosecutors}
                onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                  setAndSendToServer(
                    'prosecutorId',
                    (selectedOption as ReactSelectOption).value.toString(),
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
                required
              />
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
            {!workingCase.parentCase && (
              <Box component="section" marginBottom={5}>
                <Box marginBottom={3}>
                  <Text as="h3" variant="h3">
                    Tími handtöku
                  </Text>
                </Box>
                <DateTime
                  name="arrestDate"
                  selectedDate={
                    workingCase.arrestDate
                      ? new Date(workingCase.arrestDate)
                      : undefined
                  }
                  onChange={(date: Date | undefined, valid: boolean) => {
                    newSetAndSendDateToServer(
                      'arrestDate',
                      date,
                      valid,
                      workingCase,
                      setWorkingCase,
                      setArrestDateIsValid,
                      updateCase,
                    )
                  }}
                />
              </Box>
            )}
            <Box component="section" marginBottom={10}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Ósk um fyrirtökudag og tíma{' '}
                  <Box
                    data-testid="requested-court-date-tooltip"
                    component="span"
                  >
                    <Tooltip text="Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma." />
                  </Box>
                </Text>
              </Box>
              <DateTime
                name="reqCourtDate"
                selectedDate={
                  workingCase.requestedCourtDate
                    ? new Date(workingCase.requestedCourtDate)
                    : undefined
                }
                onChange={(date: Date | undefined, valid: boolean) =>
                  newSetAndSendDateToServer(
                    'requestedCourtDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    setRequestedCourtDateIsValid,
                    updateCase,
                  )
                }
                timeLabel="Ósk um tíma (kk:mm)"
                locked={workingCase.courtDate !== null}
                minDate={new Date()}
                required
              />
              {workingCase.courtDate && (
                <Box marginTop={1}>
                  <Text variant="eyebrow">
                    Fyrirtökudegi og tíma hefur verið úthlutað
                  </Text>
                </Box>
              )}
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.STEP_ONE_ROUTE}/${workingCase.id}`}
              onNextButtonClick={async () => await handleNextButtonClick()}
              nextIsDisabled={
                transitionLoading ||
                !arrestDateIsValid ||
                !requestedCourtDateIsValid
              }
              nextIsLoading={transitionLoading}
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title="Viltu senda tilkynningu?"
              text={`Með því að senda tilkynningu á dómara á vakt um að krafa um ${
                workingCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhald'
                  : 'farbann'
              } sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir um stöðu mála.`}
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              handleClose={() => setModalVisible(false)}
              handleSecondaryButtonClick={() =>
                router.push(`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`)
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(workingCase.id)

                if (notificationSent) {
                  router.push(`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`)
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
