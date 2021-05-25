import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Box, GridContainer } from '@island.is/island-ui/core'
import { initializeClient } from '@island.is/application/graphql'
import { LocaleProvider } from '@island.is/localization'
import { NotFound } from '@island.is/application/ui-shell'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'

import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { AssignApplication } from '../routes/AssignApplication'
import { InfoProvider } from '../context/InfoProvider'
import { Header } from '../components/Header'
import { environment } from '../environments'

export const App = () => (
  <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
    <InfoProvider>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        <Router basename="/umsoknir">
          <Authenticator>
            <Box background="white">
              <GridContainer>
                <Header />
              </GridContainer>
            </Box>
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
        </Router>
      </LocaleProvider>
    </InfoProvider>
  </ApolloProvider>
)

export default App
