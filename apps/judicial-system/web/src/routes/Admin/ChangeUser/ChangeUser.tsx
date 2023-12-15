import React from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertBanner, Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import { Skeleton } from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import UserForm from '../UserForm/UserForm'
import { useUserQuery } from './getUser.generated'
import { useUpdateUserMutation } from './updateUser.generated'
import { adminStrings as strings } from '../Admin.strings'
import * as styles from '../Users/Users.css'

export const ChangeUser: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const id = router.query.id as string // We know it is a string
  const { formatMessage } = useIntl()
  const {
    allInstitutions,
    loading: institutionsLoading,
    loaded: institutionsLoaded,
  } = useInstitution()
  const { data: userData, loading: userLoading } = useUserQuery({
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [updateUserMutation, { loading: userUpdating }] =
    useUpdateUserMutation()

  const saveUser = async (user: User) => {
    if (!userUpdating && user && user.institution) {
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

  return institutionsLoading || userLoading ? (
    <Skeleton />
  ) : !userData?.user || !institutionsLoaded ? (
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
          loading={userUpdating}
        />
      </div>
    </Box>
  )
}

export default ChangeUser
