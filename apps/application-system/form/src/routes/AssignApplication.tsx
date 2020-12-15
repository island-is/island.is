import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import decode from 'jwt-decode'
import qs from 'qs'

import { Text, Page } from '@island.is/island-ui/core'
import { NotFound } from '@island.is/application/ui-shell'

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

  // TODO: move code from <NotFound /> into a generic <Error/> component
  // that receives status code as prop and use here as in <NotFound/>
  return (
    <Page>
      {isMissingToken ? (
        <NotFound
          title="Enginn tóki fannst"
          subTitle="Ekki er hægt að tengja umsókn án auðkenningartóka"
        />
      ) : hasInvalidToken ? (
        <NotFound
          title="Ógildur tóki"
          subTitle="Sá tóki sem var lesinn úr slóð er ógildur og tókst því ekki að tengja umsókn"
        />
      ) : couldNotAssignApplication ? (
        <NotFound
          title="Ekki tókst að tengjast umsókn"
          subTitle="Villa koma upp við að tengjast umsókn og hefur hún verið skráð"
        />
      ) : loading ? (
        <Text variant="default">This should be a loading indicator</Text>
      ) : null}
    </Page>
  )
}
