import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
  Case,
  CaseState,
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import useInstitution from '@island.is/judicial-system-web/src/utils/hooks/useInstitution'
import HearingArrangementsForms from './HearingArrangementsForm'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

const HearingArrangements = () => {
  const router = useRouter()
  const id = router.query.id
  const [workingCase, setWorkingCase] = useState<Case>()
  const [prosecutors, setProsecutors] = useState<ReactSelectOption[]>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { user } = useContext(UserContext)
  const { courts } = useInstitution()
  const {
    sendNotification,
    isSendingNotification,
    transitionCase,
    isTransitioningCase,
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
    if (userData) {
      setProsecutors(
        userData?.users
          .filter(
            (aUser: User) =>
              aUser.role === UserRole.PROSECUTOR &&
              aUser.institution?.id === user?.institution?.id,
          )
          .map((prosecutor: User) => {
            return { label: prosecutor.name, value: prosecutor.id }
          }),
      )
    }
  }, [userData])

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const transitionSuccess = await transitionCase(workingCase, setWorkingCase)

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
      {workingCase && prosecutors && courts && (
        <>
          <HearingArrangementsForms
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            prosecutors={prosecutors}
            courts={courts}
            isLoading={loading || isTransitioningCase}
            handleNextButtonClick={handleNextButtonClick}
          />
          {modalVisible && (
            <Modal
              title="Viltu senda tilkynningu?"
              text="Með því að senda tilkynningu á dómara á vakt um að krafa um rannsóknarheimild sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir um stöðu mála."
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              handleClose={() => setModalVisible(false)}
              handleSecondaryButtonClick={() =>
                router.push(
                  `${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                )
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.HEADS_UP,
                )

                if (notificationSent) {
                  router.push(
                    `${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HearingArrangements
