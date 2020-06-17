import React, { useContext } from 'react'
import { useQuery, useMutation } from 'react-apollo'
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
import appleSvg from '@island.is/gjafakort-web/assets/appstore.svg'
import googlePlaySvg from '@island.is/gjafakort-web/assets/googlePlay.svg'
import { UserContext } from '@island.is/gjafakort-web/context'
import { ContentLoader } from '@island.is/gjafakort-web/components'

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
  const { user, setUser } = useContext(UserContext)

  /*
   *
   * TODO: split into components and check loading
   *
   */

  if (!user) {
    return <ContentLoader />
  }

  const onSubmit = (values) => {
    setUser({ ...user, mobile: values.phoneNumber })
  }

  if (!user.mobile) {
    return <MobileForm onSubmit={onSubmit} />
  }

  // TODO: separate component:
  const [createUserApplication, { called: shouldPoll }] = useMutation(
    CreateUserApplicationMutation,
  )
  useQuery(UserApplicationQuery, {
    onCompleted: async (data) => {
      if (!data.userApplication) {
        await createUserApplication({
          variables: {
            input: {
              mobile: user.mobile,
            },
          },
        })
      }
    },
  })

  return (
    <Box marginTop={12}>
      <ContentBlock width="large">
        <Columns space={15} collapseBelow="lg">
          <Column width="2/3">
            <Box paddingLeft={[0, 0, 0, 9]} marginBottom={5}>
              <Stack space={3}>
                <Typography variant="h1" as="h1">
                  Ferðagjöfin þín
                </Typography>
                <Typography variant="intro">
                  Til að nota Ferðagjöfina sækir þú smáforritið Ferðagjöf, sem
                  er fáanlegt bæði fyrir Apple iOS og Android snjalltæki. Í
                  smáforritinu getur þú nýtt gjafakortið, séð yfirlit yfir
                  ferðaþjónustufyrirtæki eða gefið öðrum Ferðagjöfina. Ef þú
                  kýst að sækja ekki smáforritið má búa til gjafakóða á
                  strikamerki hér að neðan.
                </Typography>
              </Stack>
            </Box>
            <Box
              background="purple100"
              paddingX={[5, 12]}
              paddingY={[5, 9]}
              marginBottom={12}
            >
              <Stack space={3}>
                <Typography variant="h4" as="h2">
                  Sæktu smáforritið fyrir Apple iOS eða Android.
                </Typography>
                <Typography variant="p">
                  Einnig er hægt að leita að „Ferðagjöf“ inni á Apple App Store
                  og Google Play Store.
                </Typography>
                <Box marginTop={3}>
                  <Tiles space={4} columns={[1, 2, 3]}>
                    <a
                      href="https://play.google.com/store/apps"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <img src={googlePlaySvg} alt="smáforrit google play" />
                    </a>
                    <a
                      href="https://www.apple.com/ios/app-store/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <img src={appleSvg} alt="smáforrit apple app store" />
                    </a>
                  </Tiles>
                </Box>
              </Stack>
            </Box>
            <Box paddingLeft={[0, 0, 0, 9]}>
              <Stack space={3}>
                <Typography variant="h1" as="h2">
                  Gjafakóði á strikamerki
                </Typography>
                <Typography variant="intro">
                  Til að nota gjöfina getur þú sýnt söluaðila strikamerkið á
                  farsímanum þínum. Hjá völdum aðilum getur þú nýtt númerið á
                  strikamerkinu sem gjafakóða á vefsíðum
                  ferðaþjónustufyrirtækja.
                </Typography>
              </Stack>
              <Box marginTop={5}>
                <Barcode shouldPoll={shouldPoll} />
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
