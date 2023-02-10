import React from 'react'
import { useIntl } from 'react-intl'

import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  UpdateUserMutation,
  UserQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import { titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

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
  const { formatMessage } = useIntl()
  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UserQuery,
    {
      variables: { input: { id: id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const {
    courts,
    allCourts,
    prosecutorsOffices,
    prisonInstitutions,
    loading: institutionLoading,
    loaded: institutionLoaded,
  } = useInstitution()

  const [updateUserMutation, { loading: saveLoading }] = useMutation<SaveData>(
    UpdateUserMutation,
  )

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

    router.push(constants.USERS_ROUTE)
  }

  return (
    <PageLayout
      showSidepanel={false}
      isLoading={userLoading || institutionLoading}
      notFound={!userData?.user || !institutionLoaded}
    >
      <PageHeader title={formatMessage(titles.admin.changeUser)} />
      {userData?.user && institutionLoaded && (
        <UserForm
          user={userData?.user}
          courts={courts}
          allCourts={allCourts}
          prosecutorsOffices={prosecutorsOffices}
          prisonInstitutions={prisonInstitutions}
          onSave={saveUser}
          loading={saveLoading}
        />
      )}
    </PageLayout>
  )
}

export default ChangeUser
