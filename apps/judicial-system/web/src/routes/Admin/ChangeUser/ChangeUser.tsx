import React from 'react'
import { useIntl } from 'react-intl'

import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import {
  UpdateUserMutation,
  UserQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import { titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import { Skeleton } from '@island.is/judicial-system-web/src/components'
import * as constants from '@island.is/judicial-system/consts'
import * as styles from '../Users/Users.css'
import { adminStrings as strings } from '../Admin.strings'

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
          courts={courts}
          allCourts={allCourts}
          prosecutorsOffices={prosecutorsOffices}
          prisonInstitutions={prisonInstitutions}
          onSave={saveUser}
          loading={saveLoading}
        />
      </div>
    </Box>
  )
}

export default ChangeUser
