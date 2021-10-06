import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select'
import {
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  CaseData,
  ProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  CaseState,
  CaseTransition,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { Case, User } from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { icRequestedHearingArrangements as m } from '@island.is/judicial-system-web/messages'
import HearingArrangementsForms from './HearingArrangementsForm'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'

const HearingArrangements = () => {
  const router = useRouter()
  const id = router.query.id
  const [workingCase, setWorkingCase] = useState<Case>()
  const [prosecutors, setProsecutors] = useState<ReactSelectOption[]>()
  const [
    isNotificationModalVisible,
    setIsNotificationModalVisible,
  ] = useState<boolean>(false)
  const [
    isProsecutorAccessModalVisible,
    setIsProsecutorAccessModalVisible,
  ] = useState<boolean>(false)
  const [substituteProsecutorId, setSubstituteProsecutorId] = useState<string>()
  const { user } = useContext(UserContext)
  const { courts } = useInstitution()
  const { formatMessage } = useIntl()
  const {
    sendNotification,
    isSendingNotification,
    transitionCase,
    isTransitioningCase,
    updateCase,
  } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { data: userData } = useQuery<{ users: User[] }>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    document.title = 'Óskir um fyrirtöku - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  useEffect(() => {
    if (userData && workingCase) {
      setProsecutors(
        userData.users
          .filter(
            (aUser: User) =>
              aUser.role === UserRole.PROSECUTOR &&
              (!workingCase.creatingProsecutor ||
                aUser.institution?.id ===
                  workingCase.creatingProsecutor?.institution?.id),
          )
          .map((prosecutor: User) => {
            return { label: prosecutor.name, value: prosecutor.id }
          }),
      )
    }
  }, [userData, workingCase, workingCase?.creatingProsecutor?.institution?.id])

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const caseOpened =
      workingCase.state === CaseState.NEW
        ? await transitionCase(workingCase, CaseTransition.OPEN, setWorkingCase)
        : true

    if (caseOpened) {
      if (
        (workingCase.state !== CaseState.NEW &&
          workingCase.state !== CaseState.DRAFT) ||
        // TODO: Ignore failed notifications
        workingCase.notifications?.find(
          (notification) => notification.type === NotificationType.HEADS_UP,
        )
      ) {
        router.push(`${Constants.IC_POLICE_DEMANDS_ROUTE}/${workingCase.id}`)
      } else {
        setIsNotificationModalVisible(true)
      }
    } else {
      // TODO: Handle error
    }
  }

  const setProsecutor = (prosecutorId: string) => {
    if (workingCase) {
      setAndSendToServer(
        'prosecutorId',
        prosecutorId,
        workingCase,
        setWorkingCase,
        updateCase,
      )
    }
  }

  const handleProsecutorChange = (
    selectedOption: ValueType<ReactSelectOption>,
  ) => {
    if (workingCase) {
      const option = selectedOption as ReactSelectOption
      const isRemovingCaseAccessFromSelf =
        user?.id !== workingCase.creatingProsecutor?.id

      if (isRemovingCaseAccessFromSelf) {
        setSubstituteProsecutorId(option.value.toString())
        setIsProsecutorAccessModalVisible(true)
      } else {
        setProsecutor(option.value.toString())
      }
    }
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_TWO}
      isLoading={loading}
      notFound={id !== undefined && data?.case === undefined}
      isExtension={workingCase?.parentCase && true}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase && user && prosecutors && courts && (
        <>
          <HearingArrangementsForms
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            user={user}
            prosecutors={prosecutors}
            courts={courts}
            isLoading={loading || isTransitioningCase}
            onNextButtonClick={handleNextButtonClick}
            onProsecutorChange={handleProsecutorChange}
            updateCase={updateCase}
          />
          {isNotificationModalVisible && (
            <Modal
              title={formatMessage(m.modal.heading)}
              text={formatMessage(m.modal.text)}
              primaryButtonText={formatMessage(m.modal.primaryButtonText)}
              secondaryButtonText={formatMessage(m.modal.secondaryButtonText)}
              handleClose={() => setIsNotificationModalVisible(false)}
              handleSecondaryButtonClick={() =>
                router.push(
                  `${Constants.IC_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                )
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.HEADS_UP,
                )

                if (notificationSent) {
                  router.push(
                    `${Constants.IC_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
          {isProsecutorAccessModalVisible && (
            <Modal
              title={formatMessage(m.prosecutorAccessModal.heading)}
              text={formatMessage(m.prosecutorAccessModal.text)}
              primaryButtonText={formatMessage(
                m.prosecutorAccessModal.primaryButtonText,
              )}
              secondaryButtonText={formatMessage(
                m.prosecutorAccessModal.secondaryButtonText,
              )}
              handlePrimaryButtonClick={() => {
                substituteProsecutorId && setProsecutor(substituteProsecutorId)
                router.push(Constants.REQUEST_LIST_ROUTE)
              }}
              handleSecondaryButtonClick={() => {
                setIsProsecutorAccessModalVisible(false)
              }}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HearingArrangements
