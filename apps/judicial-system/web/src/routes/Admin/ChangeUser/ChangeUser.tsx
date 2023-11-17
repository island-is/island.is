import React from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'

import { AlertBanner, Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import { Skeleton } from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  UpdateUserMutation,
  UserQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'

import UserForm from '../UserForm/UserForm'
import { adminStrings as strings } from '../Admin.strings'
import * as styles from '../Users/Users.css'

interface UserData {
  user: User
}

interface SaveData {
  user: User
}

export const ChangeUser: React.FC<React.PropsWithChildren<unknown>> = () => {
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
    allInstitutions,
    loading: institutionLoading,
    loaded: institutionLoaded,
  } = useInstitution()

  const [updateUserMutation, { loading: saveLoading }] =
    useMutation<SaveData>(UpdateUserMutation)

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

  return institutionLoading || userLoading ? (
    <Skeleton />
  ) : !userData?.user || !institutionLoaded ? (
    <AlertBanner
      title={formatMessage(strings.alertTitle)}
      description={formatMessage(strings.alertMessage)}
      variant="error"
      link={{ href: constants.USERS_ROUTE, title: 'Fara á yfirlitssíðu' }}
    />
  ) : (
    <Box background="purple100">
      <div className={styles.userManagementContainer}>
        <PageHeader title={formatMessage(titles.admin.changeUser)} />
        <UserForm
          user={userData?.user}
          institutions={allInstitutions}
          onSave={saveUser}
          loading={saveLoading}
        />
      </div>
    </Box>
  )
}

export default ChangeUser
