import React, { useContext, useEffect, useState } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import SigningModal from '@island.is/judicial-system-web/src/components/SigningModal/SigningModal'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { RequestSignatureResponse } from '@island.is/judicial-system/types'

import ConfirmationForm from './ConfirmationForm'

const Confirmation = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [
    requestSignatureResponse,
    setRequestSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const { requestSignature, isRequestingSignature } = useCase()
  const { user } = useContext(UserContext)
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!modalVisible) {
      setRequestSignatureResponse(undefined)
    }
  }, [modalVisible, setRequestSignatureResponse])

  const handleNextButtonClick = async () => {
    // Request signature to get control code
    try {
      const requestSignatureResponse = await requestSignature(workingCase.id)
      if (requestSignatureResponse) {
        setRequestSignatureResponse(requestSignatureResponse)
        setModalVisible(true)
      } else {
        // TODO: Handle error
      }
    } catch (e) {
      // TODO: Handle error
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.CONFIRMATION}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      {user && (
        <>
          <ConfirmationForm
            workingCase={workingCase}
            user={user}
            isLoading={isRequestingSignature}
            handleNextButtonClick={handleNextButtonClick}
          />
          {modalVisible && (
            <SigningModal
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              requestSignatureResponse={requestSignatureResponse}
              setModalVisible={setModalVisible}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default Confirmation
