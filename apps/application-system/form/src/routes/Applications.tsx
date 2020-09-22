import React, { FC, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { CREATE_APPLICATION } from '@island.is/application/graphql'
import useAuth from '../hooks/useAuth'

export const Applications: FC<{}> = () => {
  const { type } = useParams()
  const history = useHistory()
  const { userInfo } = useAuth()

  const [createApplication, { error }] = useMutation(CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      history.replace(`../application/${createApplication.id}`)
    },
  })
  const { natreg } = userInfo.profile

  useEffect(() => {
    createApplication({
      variables: {
        input: {
          applicant: natreg,
          state: 'draft',
          attachments: {},
          typeId: type,
          assignee: natreg,
          externalId: 'some_id',
          answers: {},
        },
      },
    })
  }, [createApplication, natreg, type])

  if (error) return <p>Error! {error.message}</p>
  return <p>Loading...</p>
}
