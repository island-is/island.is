import React, { useEffect } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import type { User } from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  UpdateUserMutation,
  UserQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import { useRouter } from 'next/router'
import UserForm from '../UserForm/UserForm'

interface UserData {
  user: User
}

interface SaveData {
  user: User
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
    allCourts,
    prosecutorsOffices,
    loading: institutionLoading,
    loaded: institutionLoaded,
  } = useInstitution()

  const [updateUserMutation, { loading: saveLoading }] = useMutation<SaveData>(
    UpdateUserMutation,
  )

  useEffect(() => {
    document.title = 'Breyta notanda - Réttarvörslugátt'
  }, [])

  const saveUser = async (user: User) => {
    if (saveLoading === false && user) {
      await updateUserMutation({
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
      notFound={!userData?.user || !institutionLoaded}
    >
      {userData?.user && institutionLoaded && (
        <UserForm
          user={userData?.user}
          allCourts={allCourts}
          prosecutorsOffices={prosecutorsOffices}
          onSave={saveUser}
          loading={saveLoading}
        />
      )}
    </PageLayout>
  )
}

export default ChangeUser
