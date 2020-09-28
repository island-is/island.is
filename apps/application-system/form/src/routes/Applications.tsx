import React, { FC, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { CREATE_APPLICATION } from '@island.is/application/graphql'
import useAuth from '../hooks/useAuth'

export const Applications: FC = () => {
  const { type } = useParams()
  const history = useHistory()
  const { userInfo } = useAuth()

  const [createApplication, { error }] = useMutation(CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      history.replace(`../application/${createApplication.id}`)
    },
  })
  const nationalRegistryId = userInfo?.profile?.natreg

  useEffect(() => {
    if (nationalRegistryId) {
      createApplication({
        variables: {
          input: {
            applicant: nationalRegistryId,
            state: 'draft',
            attachments: {},
            typeId: type,
            assignee: nationalRegistryId,
            externalId: 'some_id',
            answers: {},
          },
        },
      })
    }
  }, [createApplication, nationalRegistryId, type])

  if (error) return <p>Error! {error.message}</p>
  return <p>Loading...</p>
}
