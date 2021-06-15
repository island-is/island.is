import React, { useEffect, useState } from 'react'
import {
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case, NotificationType } from '@island.is/judicial-system/types'
import {
  CaseData,
  JudgeSubsections,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useRouter } from 'next/router'
import HearingArrangementsForm from './HearingArrangementsForm'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

const HearingArrangements = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [modalVisible, setModalVisible] = useState(false)

  const router = useRouter()
  const id = router.query.id
  const { sendNotification, isSendingNotification } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { data: users, loading: userLoading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  const handleNextButtonClick = async () => {
    if (workingCase) {
      const notificationSent = await sendNotification(
        workingCase.id,
        NotificationType.COURT_DATE,
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (notificationSent && !window.Cypress) {
        setModalVisible(true)
      } else {
        router.push(`${Constants.R_CASE_COURT_RECORD_ROUTE}/${id}`)
      }
    }
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase && users && (
        <>
          <HearingArrangementsForm
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isLoading={loading || userLoading || isSendingNotification}
            users={users}
            handleNextButtonClick={handleNextButtonClick}
          />
          {modalVisible && (
            <Modal
              title="Tilkynning um fyrirtökutíma hefur verið send"
              text="Tilkynning um fyrirtökutíma hefur verið send á ákæranda, fangelsi og verjanda hafi verjandi verið skráður."
              handlePrimaryButtonClick={() => {
                router.push(`${Constants.R_CASE_COURT_RECORD_ROUTE}/${id}`)
              }}
              primaryButtonText="Loka glugga"
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HearingArrangements
