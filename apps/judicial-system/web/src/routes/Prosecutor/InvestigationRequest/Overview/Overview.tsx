import React, { useState, useEffect, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  NotificationType,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'
import {
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { icOverview as m } from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import OverviewForm from './OverviewForm'

export const Overview: React.FC = () => {
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalText, setModalText] = useState('')
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { transitionCase, sendNotification, isSendingNotification } = useCase()

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  const { formatMessage } = useIntl()

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
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <OverviewForm
        workingCase={workingCase}
        handleNextButtonClick={handleNextButtonClick}
        isLoading={isLoadingWorkingCase || isSendingNotification}
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
    </PageLayout>
  )
}

export default Overview
