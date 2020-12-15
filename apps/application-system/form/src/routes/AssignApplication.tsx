import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import decode from 'jwt-decode'
import qs from 'qs'

import { Text, Page } from '@island.is/island-ui/core'

import useAuth from '../hooks/useAuth'
import { SUBMIT_APPLICATION } from 'libs/application/graphql/src'

interface DecodedToken {
  applicationId: string
}

export const AssignApplication = () => {
  const location = useLocation()
  const history = useHistory()
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
  const [tokenParsingError, setTokenParsingError] = useState<Error | null>(null)

  const [
    submitApplication,
    { loading, error: assignApplicationError },
  ] = useMutation(SUBMIT_APPLICATION, {
    onCompleted({ submitApplication }) {
      history.push(`../application/${submitApplication.id}`)
    },
  })

  const { userInfo } = useAuth()

  const isMissingToken = !queryParams.token
  const hasInvalidToken = tokenParsingError !== null
  const couldNotAssignApplication = !!assignApplicationError

  const assignUserToApplication = (
    applicationId: string,
    newAssigneeNationalRegistryId: string,
  ) => {
    submitApplication({
      variables: {
        input: {
          id: applicationId,
          event: 'SUBMIT',
          assignees: [newAssigneeNationalRegistryId],
        },
      },
    })
  }

  useEffect(() => {
    if (isMissingToken) {
      return
    }

    const { token } = queryParams
    try {
      setTokenParsingError(null)
      const decoded = decode(token as string) as DecodedToken
      assignUserToApplication(
        decoded.applicationId,
        userInfo?.profile.nationalId,
      )
    } catch (e) {
      setTokenParsingError(e)
    }
  }, [])

  return (
    <Page>
      {isMissingToken ? (
        <Text variant="h2">Missing design for when token is missing</Text>
      ) : hasInvalidToken ? (
        <Text variant="h2">Missing design for when token is invalid</Text>
      ) : couldNotAssignApplication ? (
        <Text variant="h2">
          Missing design for when application could not be assigned
        </Text>
      ) : loading ? (
        <Text variant="default">This should be a loading indicator</Text>
      ) : null}
    </Page>
  )
}
