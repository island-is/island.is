import React, { FC, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { CREATE_APPLICATION } from '@island.is/application/graphql'
import { useAuthState } from '../context/AuthProvider'

export const Applications: FC<{}> = () => {
  const { type } = useParams()
  const history = useHistory()
  const [{ userInfo }] = useAuthState()

  const [createApplication, { error }] = useMutation(CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      history.replace(`../application/${createApplication.id}`)
    },
  })

  useEffect(() => {
    createApplication({
      variables: {
        input: {
          applicant: userInfo?.profile?.natreg,
          state: 'draft',
          attachments: {},
          typeId: type,
          assignee: '123456-1235',
          externalId: 'some_id',
          answers: {},
        },
      },
    })
  }, [createApplication, type])

  if (error) return <p>Error! {error.message}</p>
  return <p>Loading...</p>
}
