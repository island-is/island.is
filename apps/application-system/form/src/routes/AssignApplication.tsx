import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import qs from 'qs'

import { Text, Page, Box, LoadingIcon, Stack } from '@island.is/island-ui/core'
import { NotFound } from '@island.is/application/ui-shell'

import { ASSIGN_APPLICATION } from '@island.is/application/graphql'
import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/core'

export const AssignApplication = () => {
  const location = useLocation()
  const history = useHistory()
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })

  const [
    assignApplication,
    { loading, error: assignApplicationError },
  ] = useMutation(ASSIGN_APPLICATION, {
    onCompleted({ assignApplication }) {
      const { id, typeId } = assignApplication
      const applicationConfiguration =
        ApplicationConfigurations[typeId as ApplicationTypes]

      const applicationSlug =
        applicationConfiguration !== undefined
          ? applicationConfiguration.slug
          : 'application' // fallback if for some reason we can not find the configuration

      ApplicationConfigurations[typeId as ApplicationTypes].slug
      history.push(`../${applicationSlug}/${id}`)
    },
  })

  const isMissingToken = !queryParams.token
  const couldNotAssignApplication = !!assignApplicationError

  useEffect(() => {
    if (isMissingToken) {
      return
    }

    const { token } = queryParams

    assignApplication({
      variables: {
        input: {
          token,
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
