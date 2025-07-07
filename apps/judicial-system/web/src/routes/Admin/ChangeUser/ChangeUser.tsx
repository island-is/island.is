import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertBanner, Box, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  PageHeader,
  Skeleton,
} from '@island.is/judicial-system-web/src/components'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import UserForm from '../UserForm/UserForm'
import { useUpdateUserMutation } from './updateUser.generated'
import { useUserQuery } from './user.generated'
import { strings } from './ChangeUser.strings'
import * as styles from '../Users/Users.css'

export const ChangeUser = () => {
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

  const [updateUserMutation, { loading: userUpdating }] = useUpdateUserMutation(
    {
      onCompleted: () => router.push(constants.USERS_ROUTE),
      onError: () => {
        toast.error(formatMessage(strings.updateError))
      },
    },
  )

  const saveUser = async (user: User) => {
    if (!userUpdating && user.institution) {
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
