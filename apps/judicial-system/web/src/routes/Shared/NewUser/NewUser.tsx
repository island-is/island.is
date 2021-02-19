import React, { useEffect } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { User, UserRole } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { CreateUserMutation } from '@island.is/judicial-system-web/src/utils/mutations'
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
  const history = useHistory()

  useEffect(() => {
    document.title = 'Nýr notandi - Réttarvörslugátt'
  }, [])

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

    history.push(Constants.USER_LIST_ROUTE)
  }

  return (
    <PageLayout showSidepanel={false} isLoading={false} notFound={false}>
      <UserForm user={user} onSave={createUser} loading={createLoading} />
    </PageLayout>
  )
}

export default NewUser
