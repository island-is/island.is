import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import qs from 'qs'
import * as Sentry from '@sentry/react'

import { Text, Page, Box, LoadingDots, Stack } from '@island.is/island-ui/core'
import { NotFound } from '@island.is/application/ui-shell'
import { ASSIGN_APPLICATION } from '@island.is/application/graphql'
import { getSlugFromType } from '@island.is/application/core'

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

      // fall back to application if for some reason we can not find the configuration
      const slug = getSlugFromType(typeId) || 'application'

      history.push(`../${slug}/${id}`)
    },
  })

  const isMissingToken = !queryParams.token
  const couldNotAssignApplication = !!assignApplicationError

  useEffect(() => {
    const init = async () => {
      if (isMissingToken) {
        Sentry.captureException(
          new Error(
            `Missing token, cannot assign the application ${location.search}`,
          ),
        )

        return
      }

      const { token } = queryParams

      await assignApplication({
        variables: {
          input: {
            token,
          },
        },
      })
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO: move code from <NotFound /> into a generic <Error/> component
  // that receives status code as prop and use here as in <NotFound/>
  return (
    <Page>
      {isMissingToken && (
        <NotFound
          title="Enginn tóki fannst"
          subTitle="Ekki er hægt að tengja umsókn án auðkenningartóka"
        />
      )}

      {couldNotAssignApplication && (
        <NotFound
          title="Ekki tókst að tengjast umsókn"
          subTitle="Villa koma upp við að tengjast umsókn og hefur hún verið skráð"
        />
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Stack space={3} align="center">
            <LoadingDots large />

            <Text variant="h4" color="blue600">
              Tengist umsókn
            </Text>
          </Stack>
        </Box>
      )}
    </Page>
  )
}
