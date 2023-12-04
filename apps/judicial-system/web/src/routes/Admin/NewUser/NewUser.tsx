import React from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import { Skeleton } from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
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
    loading: institutionLoading,
    loaded: institutionLoaded,
  } = useInstitution()
  const { formatMessage } = useIntl()

  const [createUserMutation, { loading: createLoading }] =
    useCreateUserMutation()

  const createUser = async (user: User): Promise<void> => {
    if (!createLoading && user && user.institution) {
      await createUserMutation({
        variables: {
          input: {
            name: user.name,
            nationalId: user.nationalId,
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

  return institutionLoading ? (
    <Skeleton />
  ) : institutionLoaded ? (
    <Box background="purple100">
      <div className={styles.userManagementContainer}>
        <PageHeader title={formatMessage(titles.admin.newUser)} />
        <UserForm
          user={user}
          institutions={allInstitutions}
          onSave={createUser}
          loading={createLoading}
        />
      </div>
    </Box>
  ) : null
}

export default NewUser
