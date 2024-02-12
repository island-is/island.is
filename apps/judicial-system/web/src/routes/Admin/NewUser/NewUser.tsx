import React from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  PageHeader,
  Skeleton,
} from '@island.is/judicial-system-web/src/components'
import {
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import UserForm from '../UserForm/UserForm'
import { useCreateUserMutation } from './createUser.generated'
import * as styles from '../Users/Users.css'

const user: User = {
  id: '',
  created: '',
  modified: '',
  nationalId: '',
  name: '',
  title: '',
  mobileNumber: '',
  email: '',
  role: UserRole.PROSECUTOR,
  institution: undefined,
  active: true,
}

export const NewUser: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()

  const {
    allInstitutions,
    loading: institutionsLoading,
    loaded: institutionsLoaded,
  } = useInstitution()
  const { formatMessage } = useIntl()

  const [createUserMutation, { loading: userCreating }] =
    useCreateUserMutation()

  const createUser = async (user: User): Promise<void> => {
    if (
      !userCreating &&
      user.nationalId &&
      user.name &&
      user.role &&
      user.title &&
      user.mobileNumber &&
      user.email &&
      user.active !== undefined &&
      user.active !== null &&
      user.institution
    ) {
      await createUserMutation({
        variables: {
          input: {
            name: user.name,
            nationalId: user.nationalId,
            role: user.role,
            institutionId: user.institution.id,
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
