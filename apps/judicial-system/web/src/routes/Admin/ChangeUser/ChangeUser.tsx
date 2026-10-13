import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertBanner, Box } from '@island.is/island-ui/core'
import { ADMIN_USERS_ROUTE } from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  PageHeader,
  Skeleton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import type { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import UserForm from '@island.is/judicial-system-web/src/routes/Admin/UserForm/UserForm'
import * as styles from '@island.is/judicial-system-web/src/routes/Admin/Users/Users.css'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useUpdateUserMutation } from './updateUser.generated'
import { useUserQuery } from './user.generated'
import { strings } from './ChangeUser.strings'

export const ChangeUser = () => {
  const router = useRouter()
  const id = router.query.id as string // We know it is a string
  const { formatMessage } = useIntl()
  const { user: currentUser } = useContext(UserContext)
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

  const [updateUserMutation, { loading: userUpdating }] = useUpdateUserMutation(
    {
      onCompleted: () => router.push(ADMIN_USERS_ROUTE),
      onError: () => {
        toast.error(formatMessage(strings.updateError))
      },
    },
  )

  const saveUser = async (user: User) => {
    if (!userUpdating && user.institution) {
      // Only the super admin may set this flag - the backend rejects the field
      // from anyone else, so we omit it entirely for other admins.
      const isSuperAdmin = currentUser?.role === UserRole.ADMIN

      await updateUserMutation({
        variables: {
          input: {
            id: user.id,
            name: user.name,
            title: user.title,
            mobileNumber: user.mobileNumber?.replace('-', ''),
            email: user.email,
            active: user.active,
            canConfirmIndictment: user.canConfirmIndictment,
            ...(isSuperAdmin
              ? {
                  canManageMessageSuspension: user.canManageMessageSuspension,
                }
              : {}),
          },
        },
      })
    }
  }

  return institutionsLoading || userLoading ? (
    <Skeleton />
  ) : !userData?.user || !institutionsLoaded ? (
    <AlertBanner
      title={formatMessage(strings.alertTitle)}
      description={formatMessage(strings.alertMessage)}
      variant="error"
      link={{ href: ADMIN_USERS_ROUTE, title: 'Fara á yfirlitssíðu' }}
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
