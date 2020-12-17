import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import qs from 'qs'

import { Text, Page, Box, LoadingIcon, Stack } from '@island.is/island-ui/core'
import { NotFound } from '@island.is/application/ui-shell'

import { ASSIGN_APPLICATION } from 'libs/application/graphql/src'

export const AssignApplication = () => {
  const location = useLocation()
  const history = useHistory()
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
  const [tokenParsingError, setTokenParsingError] = useState<Error | null>(null)

  const [
    assignApplication,
    { loading, error: assignApplicationError },
  ] = useMutation(ASSIGN_APPLICATION, {
    onCompleted({ assignApplication }) {
      history.push(`../application/${assignApplication.id}`)
    },
  })

  const isMissingToken = !queryParams.token
  const hasInvalidToken = tokenParsingError !== null
  const couldNotAssignApplication = !!assignApplicationError

  useEffect(() => {
    if (isMissingToken) {
      return
    }

    const { token } = queryParams
    try {
      setTokenParsingError(null)
      assignApplication({
        variables: {
          input: {
            token,
          },
        },
      })
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
        <Box display="flex" justifyContent="center" alignItems="center">
          <Stack space={3} align="center">
            <LoadingIcon animate size={40} />
            <Text variant="h4" color="blue600">
              Tengist umsókn
            </Text>
          </Stack>
        </Box>
      ) : null}
    </Page>
  )
}
