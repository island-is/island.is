import React, { useEffect, useState } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { User } from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import { useHistory, useParams } from 'react-router-dom'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  UpdateUserMutation,
  UsersQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import UserForm from '../UserForm/UserForm'

interface UserData {
  users: User[]
}

interface SaveData {
  user: User
}

export const ChangeUser: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const [user, setUser] = useState<User>()

  const { data, loading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const history = useHistory()

  useEffect(() => {
    if (data && id) {
      setUser(data.users.find((u) => u.id === id))
    }
  }, [data, id, setUser])

  useEffect(() => {
    document.title = 'Breyta notenda - Réttarvörslugátt'
  }, [])

  const saveUser = async (user: User) => {
    if (saveLoading === false && user) {
      await updateCaseMutation({
        variables: {
          input: {
            id: user.id,
            name: user.name,
            role: user.role,
            institution: user.institution,
            title: user.title,
            mobileNumber: user.mobileNumber,
            email: user.email,
            active: user.active,
          },
        },
      })
    }

    history.push(Constants.USER_LIST_ROUTE)
  }

  const [updateCaseMutation, { loading: saveLoading }] = useMutation<SaveData>(
    UpdateUserMutation,
  )

  return (
    <PageLayout
      showSidepanel={false}
      isLoading={loading}
      notFound={!data?.users}
    >
      {user && <UserForm user={user} onSave={saveUser} loading={saveLoading} />}
    </PageLayout>
  )
}

export default ChangeUser
