import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select'
import { useQuery } from '@apollo/client'

import {
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
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
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  icRequestedHearingArrangements as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import type { User } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

import HearingArrangementsForms from './HearingArrangementsForm'

const HearingArrangements = () => {
  const router = useRouter()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
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

  const { data: userData } = useQuery<{ users: User[] }>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

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

  useEffect(() => {
    if (userData?.users && workingCase) {
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

  const setProsecutor = async (prosecutorId: string) => {
    if (workingCase) {
      return setAndSendToServer(
        'prosecutorId',
        prosecutorId,
        workingCase,
        setWorkingCase,
        updateCase,
      )
    }
  }

  const handleCourtChange = (courtId: string) => {
    if (workingCase) {
      setAndSendToServer(
        'courtId',
        courtId,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      return true
    }

    return false
  }

  const handleProsecutorChange = (
    selectedOption: ValueType<ReactSelectOption>,
  ) => {
    if (workingCase) {
      const option = selectedOption as ReactSelectOption
      const isRemovingCaseAccessFromSelf =
        user?.id !== workingCase.creatingProsecutor?.id

      if (
        workingCase.isHeightenedSecurityLevel &&
        isRemovingCaseAccessFromSelf
      ) {
        setSubstituteProsecutorId(option.value.toString())
        setIsProsecutorAccessModalVisible(true)

        return false
      } else {
        setProsecutor(option.value.toString())

        return true
      }
    }

    return false
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.STEP_TWO}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
    >
      <PageHeader
        title={formatMessage(
          titles.prosecutor.investigationCases.hearingArrangements,
        )}
      />
      {user && prosecutors && courts && (
        <>
          <HearingArrangementsForms
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            user={user}
            prosecutors={prosecutors}
            courts={courts}
            isLoading={isLoadingWorkingCase || isTransitioningCase}
            onNextButtonClick={handleNextButtonClick}
            onProsecutorChange={handleProsecutorChange}
            onCourtChange={handleCourtChange}
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
              handlePrimaryButtonClick={async () => {
                if (substituteProsecutorId) {
                  await setProsecutor(substituteProsecutorId)
                  router.push(Constants.CASE_LIST_ROUTE)
                }
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
