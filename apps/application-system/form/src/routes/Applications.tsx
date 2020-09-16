import React, { FC, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { CREATE_APPLICATION } from '@island.is/application/graphql'

export const Applications: FC<{}> = () => {
  const { type } = useParams()
  const history = useHistory()

  const [createApplication, { error }] = useMutation(CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      history.replace(`../application/${createApplication.id}`)
    },
  })

  useEffect(() => {
    createApplication({
      variables: {
        input: {
          applicant: '123456-1234',
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
