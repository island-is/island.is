import React, { useEffect } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { Institution, User, UserRole } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useMutation, useQuery } from '@apollo/client'
import {
  CreateUserMutation,
  InstitutionsQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import { useRouter } from 'next/router'
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

interface InstitutionData {
  institutions: Institution[]
}

export const NewUser: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    document.title = 'Nýr notandi - Réttarvörslugátt'
  }, [])

  const {
    data: institutionData,
    loading: institutionLoading,
  } = useQuery<InstitutionData>(InstitutionsQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

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
      {institutionData?.institutions && (
        <UserForm
          user={user}
          institutions={institutionData?.institutions}
          onSave={createUser}
          loading={createLoading}
        />
      )}
    </PageLayout>
  )
}

export default NewUser
