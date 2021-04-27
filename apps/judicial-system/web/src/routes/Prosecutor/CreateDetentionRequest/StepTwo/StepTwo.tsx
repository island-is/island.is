import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { Option } from '@island.is/island-ui/core'
import {
  Case,
  CaseState,
  CaseTransition,
  CaseType,
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
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
} from '@island.is/judicial-system-web/graphql'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { useRouter } from 'next/router'
import StepTwoForm from './StepTwoForm'

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
          <StepTwoForm
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            prosecutors={prosecutors}
            defaultProsecutor={defaultProsecutor}
            courts={courts}
            defaultCourt={defaultCourt}
            arrestDateIsValid={arrestDateIsValid}
            setArrestDateIsValid={setArrestDateIsValid}
            requestedCourtDateIsValid={requestedCourtDateIsValid}
            setRequestedCourtDateIsValid={setRequestedCourtDateIsValid}
            handleNextButtonClick={handleNextButtonClick}
            transitionLoading={transitionLoading}
          />
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
