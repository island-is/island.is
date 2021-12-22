import '@island.is/api/mocks'
import { useSession } from 'next-auth/client'
import { useContext } from 'react'
import { AuthContext } from '../../components/AuthProvider'
//import { withLocale } from '../i18n'
import { Header, Box, Divider, Page, Link } from '@island.is/island-ui/core'
import ClientPage from '../../pages/client'
import React from 'react'
import router, { Router } from 'next/router'

const welcomeMessage = ({
  id: 'reference:welcome',
  defaultMessage: 'Hæ, {name}!',
  description: 'Welcome message',
})

const Training = () => {
  return (
    <div>
      <Page>
        <Box padding="containerGutter">
          <Header />
        </Box>
        <Box padding="containerGutter">
          <h2>Strings</h2>
          <p>
            FOO
          </p>
          <Link href="/api/auth/signin">Very nice Login link</Link>
          {/* <button onClick={() => {router.push('api/auth/signin')}}>PRESS ME</button> */}
        </Box>

        <Divider />
        <Box padding="containerGutter">
          <h2>Dates</h2>

        </Box>
        <Divider />
        <Box padding="containerGutter">
          <h2>Time</h2>

        </Box>
        <Box padding="containerGutter">
          <p>
456
          </p>

        </Box>
      </Page>
    </div>
  )
}

Training.getInitialProps = async () => {
  return {}
}

export default (Training)
