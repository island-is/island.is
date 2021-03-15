import React, { useEffect } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { Institution, User } from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  InstitutionsQuery,
  UpdateUserMutation,
  UserQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import { useRouter } from 'next/router'
import UserForm from '../UserForm/UserForm'

interface UserData {
  user: User
}

interface SaveData {
  user: User
}

interface InstitutionData {
  institutions: Institution[]
}

export const ChangeUser: React.FC = () => {
  const router = useRouter()
  const id = router.query.id

  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UserQuery,
    {
      variables: { input: { id: id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const {
    data: institutionData,
    loading: institutionLoading,
  } = useQuery<InstitutionData>(InstitutionsQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [updateCaseMutation, { loading: saveLoading }] = useMutation<SaveData>(
    UpdateUserMutation,
  )

  useEffect(() => {
    document.title = 'Breyta notanda - Réttarvörslugátt'
  }, [])

  const saveUser = async (user: User) => {
    if (saveLoading === false && user) {
      await updateCaseMutation({
        variables: {
          input: {
            id: user.id,
            name: user.name,
            role: user.role,
            institutionId: user.institution?.id,
            title: user.title,
            mobileNumber: user.mobileNumber,
            email: user.email,
            active: user.active,
          },
        },
      })
    }

    router.push(Constants.USER_LIST_ROUTE)
  }

  return (
    <PageLayout
      showSidepanel={false}
      isLoading={userLoading || institutionLoading}
      notFound={!userData?.user || !institutionData?.institutions}
    >
      {userData?.user && institutionData?.institutions && (
        <UserForm
          user={userData?.user}
          institutions={institutionData?.institutions}
          onSave={saveUser}
          loading={saveLoading}
        />
      )}
    </PageLayout>
  )
}

export default ChangeUser
