import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import {
  CaseData,
  ProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { Case, User, UserRole } from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import HearingArrangementsForms from './HearingArrangementsForm'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import useInstitution from '@island.is/judicial-system-web/src/utils/hooks/useInstitution'

const HearingArrangements = () => {
  const router = useRouter()
  const id = router.query.id
  const { user } = useContext(UserContext)
  const { courts } = useInstitution()
  const [workingCase, setWorkingCase] = useState<Case>()
  const [prosecutors, setProsecutors] = useState<ReactSelectOption[]>()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { data: userData, loading: userLoading } = useQuery<{ users: User[] }>(
    UsersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

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
          .map((prosecutor: User, _: number) => {
            return { label: prosecutor.name, value: prosecutor.id }
          }),
      )
    }
  }, [userData])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_PETITION_STEP_ONE}
      isLoading={loading}
      notFound={id !== undefined && data?.case === undefined}
      isExtension={workingCase?.parentCase && true}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase && prosecutors && courts && (
        <HearingArrangementsForms
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          prosecutors={prosecutors}
          courts={courts}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
