import React, { useContext, useEffect, useState } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import type {
  Case,
  RequestSignatureResponse,
} from '@island.is/judicial-system/types'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useRouter } from 'next/router'
import ConfirmationForm from './ConfirmationForm'
import SigningModal from '@island.is/judicial-system-web/src/components/SigningModal/SigningModal'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

const Confirmation = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [
    requestSignatureResponse,
    setRequestSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const { user } = useContext(UserContext)
  const { requestSignature, isRequestingSignature } = useCase()

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!modalVisible) {
      setRequestSignatureResponse(undefined)
    }
  }, [modalVisible, setRequestSignatureResponse])

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

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
