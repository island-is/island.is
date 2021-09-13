import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  NotificationType,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import OverviewForm from './OverviewForm'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

export const Overview: React.FC = () => {
  const router = useRouter()
  const id = router.query.id

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalText, setModalText] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()

  const { transitionCase, sendNotification, isSendingNotification } = useCase()
  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    try {
      const shouldSubmitCase = workingCase.state === CaseState.DRAFT

      const caseSubmitted = shouldSubmitCase
        ? await transitionCase(
            workingCase,
            CaseTransition.SUBMIT,
            setWorkingCase,
          )
        : workingCase.state !== CaseState.NEW

      const notificationSent = caseSubmitted
        ? await sendNotification(
            workingCase.id,
            NotificationType.READY_FOR_COURT,
          )
        : false

      if (shouldSubmitCase) {
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
            handleNextButtonClick={handleNextButtonClick}
            isLoading={loading || isSendingNotification}
          />
          {modalVisible && (
            <Modal
              title="Krafa um rannsóknarheimild hefur verið send til dómstóls"
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
