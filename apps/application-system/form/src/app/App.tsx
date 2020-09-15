import React, { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'

import { Redirect, Route, Switch } from 'react-router-dom'

import { Header, Box, GridContainer } from '@island.is/island-ui/core'
import { client } from '@island.is/application/graphql'
import { LocalizedRouter } from '@island.is/localization'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'

import { fixSvgUrls } from '../utils'

import * as styles from './App.treat'
import { Test } from '../routes/Test'

export const App = () => {
  useEffect(() => {
    // Fixes the island.is logo and other SVGs not appearing on
    // Mobile Safari, when a <base> tag exists in index.html.
    fixSvgUrls()
  }, [])

  return (
    <ApolloProvider client={client}>
      <LocalizedRouter RouterComponent={BrowserRouter}>
        {({ match: { path } }) => (
          <Box className={styles.root}>
            <Box background="white">
              <GridContainer>
                <Header />
              </GridContainer>
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
