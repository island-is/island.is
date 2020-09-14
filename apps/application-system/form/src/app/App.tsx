import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'

import { Redirect, Route, Switch } from 'react-router-dom'

import { Header, Box } from '@island.is/island-ui/core'
import { client } from '@island.is/application/graphql'
import { LocalizedRouter } from '@island.is/localization'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'

import * as styles from './App.treat'
import { Test } from '../routes/Test'

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <LocalizedRouter RouterComponent={BrowserRouter}>
        {({ match: { path } }) => (
          <Box className={styles.root}>
            <Box paddingLeft={[3, 3, 5]}>
              <Header />
            </Box>
            <Switch>
              <Route exact path="/">
                <Redirect to="/application/" />
              </Route>
              <Route strict exact path={`${path}/applications/:type`}>
                <Applications />
              </Route>
              <Route path={`${path}/application/:id`}>
                <Application />
              </Route>
              <Route path={`${path}/test`}>
                <Test />
              </Route>
            </Switch>
          </Box>
        )}
      </LocalizedRouter>
    </ApolloProvider>
  )
}

export default App
