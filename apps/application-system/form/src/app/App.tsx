import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Box, GridContainer } from '@island.is/island-ui/core'
import { initializeClient } from '@island.is/application/graphql'
import { LocaleProvider } from '@island.is/localization'
import { NotFound } from '@island.is/application/ui-shell'
import { defaultLanguage } from '@island.is/shared/constants'

import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { Signin } from '../routes/SignIn'
import { SilentSignIn } from '../routes/SilentSignin'
import { AssignApplication } from '../routes/AssignApplication'
import { AuthProvider } from '../context/AuthProvider'
import { InfoProvider } from '../context/InfoProvider'
import Header from '../components/Header'
import Authenticator from '../components/Authenticator'
import { environment } from '../environments'

export const App = () => (
  <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
    <AuthProvider>
      <InfoProvider>
        <LocaleProvider locale={defaultLanguage} messages={{}}>
          <Router basename="/umsoknir">
            <Box background="white">
              <GridContainer>
                <Header />
              </GridContainer>
            </Box>

            <Switch>
              <Route path="/signin-oidc" component={Signin} />
              <Route path="/silent/signin-oidc" component={SilentSignIn} />

              <Route>
                <Authenticator>
                  <Switch>
                    <Route
                      exact
                      path="/tengjast-umsokn"
                      component={AssignApplication}
                    />

                    <Route exact path="/:slug" component={Applications} />
                    <Route exact path="/:slug/:id" component={Application} />

                    <Route path="*">
                      <NotFound />
                    </Route>
                  </Switch>
                </Authenticator>
              </Route>
            </Switch>
          </Router>
        </LocaleProvider>
      </InfoProvider>
    </AuthProvider>
  </ApolloProvider>
)

export default App
