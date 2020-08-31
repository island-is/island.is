import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { Route, Switch } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import { client } from '@island.is/application/graphql'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'

import * as styles from './App.treat'
import { Signin } from '../routes/SignIn'
import { AuthProvider } from '../context/AuthProvider'
import { SilentSignIn } from '../routes/SilentSignin'
import ProtectedRoute from '../components/ProtectedRoute'
import Header from '../components/Header'

export const App = () => {

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Box className={styles.root}>
          <Box paddingLeft={[3, 3, 5]}>
            <Header />
          </Box>
          <Switch>
            <Route path="/signin-oidc" component={Signin} />
            <Route path="/silent/signin-oidc" component={SilentSignIn} />

            <ProtectedRoute path="/applications/:type" component={Applications} />
            <ProtectedRoute path="/:id?" component={Application} />
          </Switch>
        </Box>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App
