import React, { useState, useEffect, useContext } from 'react'

import {
  Case,
  CaseTransition,
  NotificationType,
  TransitionCase,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { parseTransition } from '@island.is/judicial-system-web/src/utils/formatters'
import {
  Modal,
  PageLayout,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import OverviewForm from './OverviewForm'

export const Overview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalText, setModalText] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()

  const router = useRouter()
  const id = router.query.id

  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const transitionCase = async (id: string, transitionCase: TransitionCase) => {
    const { data } = await transitionCaseMutation({
      variables: { input: { id, ...transitionCase } },
    })

    return data?.transitionCase
  }

  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.READY_FOR_COURT,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    try {
      const isDraft = workingCase.state === CaseState.DRAFT

      if (isDraft) {
        // Parse the transition request
        const transitionRequest = parseTransition(
          workingCase.modified,
          CaseTransition.SUBMIT,
        )

        // Transition the case
        const resCase = await transitionCase(workingCase.id, transitionRequest)

        if (!resCase) {
          // TDOO: Handle error
          return
        }

        setWorkingCase({
          ...workingCase,
          state: resCase.state,
        })
      }

      const notificationSent = await sendNotification(workingCase.id)

      if (isDraft) {
        // An SMS should have been sent
        if (notificationSent) {
          setModalText(
            'Tilkynning hefur verið send á dómara og dómritara á vakt.\n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
          )
        } else {
          setModalText(
            'Ekki tókst að senda tilkynningu á dómara og dómritara á vakt.\n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
          )
        }
      } else {
        // No SMS
        setModalText(
          'Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        )
      }

      setModalVisible(true)
    } catch (e) {
      // TODO: Handle error
    }
  }

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.PROSECUTOR_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
          <OverviewForm
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            handleNextButtonClick={handleNextButtonClick}
            isSendingNotification={isSendingNotification}
          />
          {modalVisible && (
            <Modal
              title={`Krafa um ${
                workingCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhald'
                  : 'farbann'
              }  hefur verið send til dómstóls`}
              text={modalText}
              handleClose={() => router.push(Constants.REQUEST_LIST_ROUTE)}
              handlePrimaryButtonClick={() => {
                window.open(Constants.FEEDBACK_FORM_URL, '_blank')
                router.push(Constants.REQUEST_LIST_ROUTE)
              }}
              handleSecondaryButtonClick={() => {
                router.push(Constants.REQUEST_LIST_ROUTE)
              }}
              primaryButtonText="Senda ábendingu"
              secondaryButtonText="Loka glugga"
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default Overview
