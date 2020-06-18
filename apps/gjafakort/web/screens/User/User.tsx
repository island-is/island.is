import React, { useContext, useEffect } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Box,
  Column,
  Columns,
  ContentBlock,
  Hidden,
  Stack,
  Tiles,
  Typography,
} from '@island.is/island-ui/core'

import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'
import { ReactComponent as AppleSvg } from '@island.is/gjafakort-web/assets/appstore.svg'
import { ReactComponent as GooglePlaySvg } from '@island.is/gjafakort-web/assets/googlePlay.svg'
import { UserContext } from '@island.is/gjafakort-web/context'
import { ContentLoader } from '@island.is/gjafakort-web/components'
import { useI18n } from '@island.is/gjafakort-web/i18n'

import { Barcode, MobileForm } from './components'

export const UserApplicationQuery = gql`
  query UserApplicationQuery {
    userApplication {
      id
    }
  }
`

const CreateUserApplicationMutation = gql`
  mutation CreateUserApplicationMutation($input: CreateUserApplicationInput!) {
    createUserApplication(input: $input) {
      application {
        id
      }
    }
  }
`

function User() {
  const {
    t: { user: t },
  } = useI18n()
  const { user } = useContext(UserContext)
  const [createUserApplication, { called: shouldPoll }] = useMutation(
    CreateUserApplicationMutation,
    {
      update(cache, { data: { createUserApplication } }) {
        cache.writeQuery({
          query: UserApplicationQuery,
          data: { userApplication: createUserApplication.application },
        })
      },
    },
  )
  const [getUserApplication, { data, loading }] = useLazyQuery(
    UserApplicationQuery,
    {
      onCompleted: async ({ userApplication }) => {
        if (!userApplication && user.mobile) {
          await createUserApplication({
            variables: {
              input: {
                mobile: user.mobile,
              },
            },
          })
        }
      },
    },
  )
  const { userApplication } = data || {}

  useEffect(() => {
    if (user && !userApplication) {
      getUserApplication()
    }
  }, [user, userApplication, getUserApplication])

  const onMobileSubmit = async ({ phoneNumber }) => {
    await createUserApplication({
      variables: {
        input: {
          mobile: phoneNumber,
        },
      },
    })
  }

  if ((loading && !data) || !user) {
    return <ContentLoader />
  } else if (!userApplication && !user.mobile) {
    return <MobileForm onSubmit={onMobileSubmit} />
  }

  return (
    <Box paddingX="gutter" marginBottom={5}>
      <ContentBlock width="large">
        <Columns space={15} collapseBelow="lg">
          <Column width="2/3">
            <Box paddingLeft={[0, 0, 0, 12, 15]} marginBottom={5}>
              <Stack space={3}>
                <Typography variant="h1" as="h1">
                  {t.title}
                </Typography>
                <Typography variant="intro">{t.intro}</Typography>
              </Stack>
            </Box>
            <Box
              background="purple100"
              paddingX={[3, 3, 3, 12, 15]}
              paddingY={[5, 9]}
              marginBottom={12}
            >
              <Stack space={3}>
                <Typography variant="h4" as="h2">
                  {t.appStore.title}
                </Typography>
                <Typography variant="p">{t.appStore.content}</Typography>
                <Box marginTop={3}>
                  <Tiles space={4} columns={[1, 2, 3, 2, 3]}>
                    <a
                      href="https://play.google.com/store/apps/details?id=is.ferdagjof.app"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <GooglePlaySvg title={t.appStore.google} />
                    </a>
                    <a
                      href="https://apps.apple.com/is/app/fer%C3%B0agj%C3%B6f/id1514948705"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <AppleSvg title={t.appStore.apple} />
                    </a>
                  </Tiles>
                </Box>
              </Stack>
            </Box>
            <Box paddingLeft={[0, 0, 0, 12, 15]}>
              <Stack space={3}>
                <Typography variant="h1" as="h2">
                  {t.barcode.title}
                </Typography>
                <Typography variant="intro">{t.barcode.intro}</Typography>
              </Stack>
              <Box marginTop={5}>
                {userApplication && <Barcode shouldPoll={shouldPoll} />}
              </Box>
            </Box>
          </Column>
          <Column width="1/3">
            <Hidden below="lg">
              <Box textAlign="center" padding={3}>
                <img src={packageSvg} alt="" />
              </Box>
            </Hidden>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

export default User
