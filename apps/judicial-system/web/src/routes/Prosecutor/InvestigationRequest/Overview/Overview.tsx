import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
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
} from '@island.is/judicial-system-web/src/components'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import OverviewForm from './OverviewForm'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { icOverview as m } from '@island.is/judicial-system-web/messages'

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

  const { formatMessage } = useIntl()

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

      // An SMS should have been sent
      if (notificationSent) {
        setModalText(formatMessage(m.sections.modal.notificationSent))
      } else {
        setModalText(formatMessage(m.sections.modal.notificationNotSent))
      }

      setModalVisible(true)
    } catch (e) {
      // TODO: Handle error
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.PROSECUTOR_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
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
              title={formatMessage(m.sections.modal.heading)}
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
