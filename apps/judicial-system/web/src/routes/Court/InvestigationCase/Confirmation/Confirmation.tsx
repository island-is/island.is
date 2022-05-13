import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import SigningModal from '@island.is/judicial-system-web/src/components/SigningModal/SigningModal'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import type { RequestSignatureResponse } from '@island.is/judicial-system/types'

import ConfirmationForm from './ConfirmationForm'

const Confirmation = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [
    requestRulingSignatureResponse,
    setRequestRulingSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const { user } = useContext(UserContext)
  const { requestRulingSignature, isRequestingRulingSignature } = useCase()

  useEffect(() => {
    if (!modalVisible) {
      setRequestRulingSignatureResponse(undefined)
    }
  }, [modalVisible, setRequestRulingSignatureResponse])

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    // Request ruling signature to get control code
    const requestRulingSignatureResponse = await requestRulingSignature(
      workingCase.id,
    )
    if (requestRulingSignatureResponse) {
      setRequestRulingSignatureResponse(requestRulingSignatureResponse)
      setModalVisible(true)
    } else {
      // TODO: Handle error
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.CONFIRMATION}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.conclusion)}
      />
      {user && (
        <>
          <ConfirmationForm
            workingCase={workingCase}
            user={user}
            isLoading={isRequestingRulingSignature}
            handleNextButtonClick={handleNextButtonClick}
          />
          {modalVisible && (
            <SigningModal
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              requestRulingSignatureResponse={requestRulingSignatureResponse}
              setModalVisible={setModalVisible}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default Confirmation
