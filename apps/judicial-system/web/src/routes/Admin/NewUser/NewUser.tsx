import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, toast } from '@island.is/island-ui/core'
import { ADMIN_USERS_ROUTE } from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  PageHeader,
  Skeleton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CreateUserInput,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import UserForm from '../UserForm/UserForm'
import { useCreateUserMutation } from './createUser.generated'
import { strings } from './NewUser.strings'
import * as styles from '../Users/Users.css'

const user: User = {
  id: '',
  active: false,
  canConfirmIndictment: false,
}

export const NewUser = () => {
  const router = useRouter()
  const { user: currentUser } = useContext(UserContext)

  const {
    allInstitutions,
    loading: institutionsLoading,
    loaded: institutionsLoaded,
  } = useInstitution()
  const { formatMessage } = useIntl()

  const [createUserMutation, { loading: userCreating }] = useCreateUserMutation(
    {
      onCompleted: () => router.push(ADMIN_USERS_ROUTE),
      onError: () => {
        toast.error(formatMessage(strings.createError))
      },
    },
  )

  const createUser = async (user: User): Promise<void> => {
    if (!userCreating && user.institution) {
      // Only the super admin may set this flag - the backend rejects the field
      // from anyone else, so we omit it entirely for other admins.
      const isSuperAdmin = currentUser?.role === UserRole.ADMIN

      await createUserMutation({
        variables: {
          input: {
            name: user.name,
            nationalId: user.nationalId?.replace('-', ''),
            role: user.role,
            institutionId: user.institution.id,
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
          } as CreateUserInput,
        },
      })
    }
  }

  return institutionsLoading ? (
    <Skeleton />
  ) : institutionsLoaded ? (
    <Box background="purple100">
      <div className={styles.userManagementContainer}>
        <PageHeader title={formatMessage(titles.admin.newUser)} />
        <UserForm
          user={user}
          institutions={allInstitutions}
          onSave={createUser}
          loading={userCreating}
        />
      </div>
    </Box>
  ) : null
}

export default NewUser
