import React from 'react'
import { useIntl } from 'react-intl'

import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system/types'
import { CreateUserMutation } from '@island.is/judicial-system-web/src/utils/mutations'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages'
import type { User } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

import UserForm from '../UserForm/UserForm'

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

export const NewUser: React.FC = () => {
  const router = useRouter()

  const {
    allCourts,
    prosecutorsOffices,
    prisonInstitutions,
    loading: institutionLoading,
    loaded: institutionLoaded,
  } = useInstitution()
  const { formatMessage } = useIntl()

  const [createUserMutation, { loading: createLoading }] = useMutation(
    CreateUserMutation,
  )

  const createUser = async (user: User): Promise<void> => {
    if (createLoading === false && user) {
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

    router.push(Constants.USER_LIST_ROUTE)
  }

  return (
    <PageLayout
      showSidepanel={false}
      isLoading={institutionLoading}
      notFound={false}
    >
      <PageHeader title={formatMessage(titles.admin.newUser)} />
      {institutionLoaded && (
        <UserForm
          user={user}
          allCourts={allCourts}
          prosecutorsOffices={prosecutorsOffices}
          prisonInstitutions={prisonInstitutions}
          onSave={createUser}
          loading={createLoading}
        />
      )}
    </PageLayout>
  )
}

export default NewUser
