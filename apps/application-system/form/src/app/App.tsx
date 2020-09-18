import React, { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'

import { Redirect, Route, Switch } from 'react-router-dom'

import { Box, GridContainer } from '@island.is/island-ui/core'
import { client } from '@island.is/application/graphql'
import { LocalizedRouter } from '@island.is/localization'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { Signin } from '../routes/SignIn'
import { SilentSignIn } from '../routes/SilentSignin'

import { fixSvgUrls } from '../utils'

import * as styles from './App.treat'
import { Test } from '../routes/Test'
import { AuthProvider } from '../context/AuthProvider'

import Header from '../components/Header'
import ProtectedRoute from '../components/ProtectedRoute'

export const App = () => {
  useEffect(() => {
    // Fixes the island.is logo and other SVGs not appearing on
    // Mobile Safari, when a <base> tag exists in index.html.
    fixSvgUrls()
  }, [])

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <LocalizedRouter RouterComponent={BrowserRouter}>
          {({ match: { path } }) => (
            <Box className={styles.root}>
              <Box background="white">
                <GridContainer>
                  <Header />
                </GridContainer>
              </Box>
              <Switch>
                <Route path="/signin-oidc" component={Signin} />
                <Route path="/silent/signin-oidc" component={SilentSignIn} />
                <Route exact path="/">
                  <Redirect to="/application/" />
                </Route>
                <ProtectedRoute
                  strict
                  exact
                  path="/applications/:type"
                  component={Applications}
                />
                <ProtectedRoute
                  path="/application/:id"
                  component={Application}
                />
                <ProtectedRoute path={`${path}/test`} component={Test} />
              </Switch>
            </Box>
          )}
        </LocalizedRouter>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App
