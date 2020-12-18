import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Box, GridContainer } from '@island.is/island-ui/core'
import { initializeClient } from '@island.is/application/graphql'
import { defaultLanguage, LocaleProvider } from '@island.is/localization'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { Signin } from '../routes/SignIn'
import { SilentSignIn } from '../routes/SilentSignin'
import { AssignApplication } from '../routes/AssignApplication'
import { AuthProvider } from '../context/AuthProvider'
import Header from '../components/Header'
import Authenticator from '../components/Authenticator'
import { environment } from '../environments'
import { NotFound } from '@island.is/application/ui-shell'

export const App = () => {
  return (
    <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
      <AuthProvider>
        <LocaleProvider locale={defaultLanguage} messages={{}}>
          <BrowserRouter>
            <Box background="white">
              <GridContainer>
                <Header />
              </GridContainer>
            </Box>
            <Switch>
              <Route path="/signin-oidc" component={Signin} />
              <Route path="/silent/signin-oidc" component={SilentSignIn} />
              <Redirect from="/applications/:type" to="/umsoknir/:type" />
              <Redirect from="/application/:id" to="/umsokn/:id" />
              <Authenticator>
                <Switch>
                  <Route
                    strict
                    exact
                    path="/tengjast-umsokn"
                    component={AssignApplication}
                  />
                  <Route
                    strict
                    exact
                    path="/umsoknir/:type"
                    component={Applications}
                  />
                  <Route path="/umsokn/:id" component={Application} />
                  <Route path="*">
                    <NotFound />
                  </Route>
                </Switch>
              </Authenticator>
            </Switch>
          </BrowserRouter>
        </LocaleProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App
