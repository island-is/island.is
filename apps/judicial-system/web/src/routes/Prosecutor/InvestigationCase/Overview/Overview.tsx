import React, { useState, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { Box, Input } from '@island.is/island-ui/core'
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
import {
  icOverview,
  icOverview as m,
} from '@island.is/judicial-system-web/messages'
import { createCaseResentExplanation } from '@island.is/judicial-system-web/src/utils/stepHelper'
import * as Constants from '@island.is/judicial-system/consts'

import OverviewForm from './OverviewForm'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'

export const Overview: React.FC = () => {
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalText, setModalText] = useState('')
  const [resendCaseModalVisible, setResendCaseModalVisible] = useState(false)
  const [caseResentExplanation, setCaseResentExplanation] = useState('')
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const {
    transitionCase,
    sendNotification,
    isSendingNotification,
    updateCase,
  } = useCase()

  const { formatMessage } = useIntl()

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const shouldSubmitCase = workingCase.state === CaseState.DRAFT

    const caseSubmitted = shouldSubmitCase
      ? await transitionCase(workingCase, CaseTransition.SUBMIT, setWorkingCase)
      : workingCase.state !== CaseState.NEW

    const notificationSent = caseSubmitted
      ? await sendNotification(workingCase.id, NotificationType.READY_FOR_COURT)
      : false

    // An SMS should have been sent
    if (notificationSent) {
      setModalText(formatMessage(m.sections.modal.notificationSent))
    } else {
      setModalText(formatMessage(m.sections.modal.notificationNotSent))
    }

    if (workingCase.state === CaseState.RECEIVED) {
      updateCase(workingCase.id, {
        caseResentExplanation: createCaseResentExplanation(
          workingCase,
          caseResentExplanation,
        ),
      })

      setResendCaseModalVisible(false)
    }

    setModalVisible(true)
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
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.overview)}
      />
      <OverviewForm
        workingCase={workingCase}
        handleNextButtonClick={
          workingCase.state === CaseState.RECEIVED
            ? () => {
                setResendCaseModalVisible(true)
              }
            : handleNextButtonClick
        }
        isLoading={
          workingCase.state !== CaseState.RECEIVED &&
          (isLoadingWorkingCase || isSendingNotification)
        }
      />
      <AnimatePresence>
        {resendCaseModalVisible && (
          <Modal
            title={formatMessage(icOverview.sections.caseResentModal.heading)}
            text={formatMessage(icOverview.sections.caseResentModal.text)}
            handleClose={() => setResendCaseModalVisible(false)}
            primaryButtonText={formatMessage(
              icOverview.sections.caseResentModal.primaryButtonText,
            )}
            secondaryButtonText={formatMessage(
              icOverview.sections.caseResentModal.secondaryButtonText,
            )}
            handleSecondaryButtonClick={() => {
              setResendCaseModalVisible(false)
            }}
            handlePrimaryButtonClick={() => {
              handleNextButtonClick()
            }}
            isPrimaryButtonLoading={isSendingNotification}
            isPrimaryButtonDisabled={!caseResentExplanation}
          >
            <Box marginBottom={10}>
              <Input
                name="caseResentExplanation"
                label={formatMessage(
                  icOverview.sections.caseResentModal.input.label,
                )}
                placeholder={formatMessage(
                  icOverview.sections.caseResentModal.input.placeholder,
                )}
                onChange={(evt) => setCaseResentExplanation(evt.target.value)}
                textarea
                rows={7}
              />
            </Box>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modalVisible && (
          <Modal
            title={formatMessage(m.sections.modal.heading)}
            text={modalText}
            handleClose={() => router.push(Constants.CASE_LIST_ROUTE)}
            handlePrimaryButtonClick={() => {
              window.open(Constants.FEEDBACK_FORM_URL, '_blank')
              router.push(Constants.CASE_LIST_ROUTE)
            }}
            handleSecondaryButtonClick={() => {
              router.push(Constants.CASE_LIST_ROUTE)
            }}
            primaryButtonText="Senda ábendingu"
            secondaryButtonText="Loka glugga"
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
