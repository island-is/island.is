import React, { useContext, useEffect } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import { Box, Stack, Typography, Button } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/gjafakort-web/context'
import {
  ContentLoader,
  Layout,
  AppsSidebar,
} from '@island.is/gjafakort-web/components'
import { useI18n } from '@island.is/gjafakort-web/i18n'

import { Barcode, ConfirmMobile } from './components'
import Link from 'next/link'

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

const VerifyUserApplicationMutation = gql`
  mutation VerifyUserApplicationMutation($input: VerifyUserApplicationInput!) {
    verifyUserApplication(input: $input) {
      application {
        id
      }
    }
  }
`

function User() {
  const {
    t: { user: t, routes },
  } = useI18n()
  const { user } = useContext(UserContext)
  const [verifyUserApplication] = useMutation(VerifyUserApplicationMutation)
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
              input: {},
            },
          })
        }
      },
    },
  )
  const { userApplication } = data || {}

  useEffect(() => {
    if (user && !data) {
      getUserApplication()
    }
  }, [user, data, getUserApplication])

  const onConfirmMobileSubmit = async (mobile, confirmCode) => {
    await createUserApplication({
      variables: {
        input: {
          mobile,
          confirmCode,
        },
      },
    })
  }

  const onVerifyMobileSubmit = async (mobile, confirmCode) => {
    await verifyUserApplication({
      variables: {
        input: {
          mobile,
          confirmCode,
        },
      },
    })
  }

  if (!data || loading || !user) {
    return <ContentLoader />
  } else if (!userApplication && !user.mobile) {
    return <ConfirmMobile onSubmit={onConfirmMobileSubmit} />
  } else if (userApplication && userApplication.verified === false) {
    return (
      <ConfirmMobile
        onSubmit={onVerifyMobileSubmit}
        mobileNumber={userApplication.mobileNumber}
      />
    )
  } else if (!userApplication) {
    return <ContentLoader />
  }

  return (
    <Layout
      left={
        <Stack space={5}>
          <Stack space={3}>
            <Typography variant="h1" as="h1">
              {t.title}
            </Typography>
            <Typography variant="intro">{t.intro}</Typography>
          </Stack>
          <Stack space={3}>
            <Typography variant="h1" as="h2">
              {t.barcode.title}
            </Typography>
            <Typography variant="intro">{t.barcode.intro}</Typography>
          </Stack>
          <Box marginTop={5} marginBottom={5}>
            {userApplication && <Barcode shouldPoll={shouldPoll} />}
          </Box>
        </Stack>
      }
      right={
        <Stack space={3}>
          <AppsSidebar />
          <Link href={routes.privacyPolicy}>
            <Button variant="text" icon="arrowRight">
              {t.privacyPolicyButton}
            </Button>
          </Link>
        </Stack>
      }
    />
  )
}

export default User
