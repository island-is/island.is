import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { Redirect, Route, Switch } from 'react-router-dom'

import {
  Header,
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Columns,
  Column,
  Hidden,
  Logo,
} from '@island.is/island-ui/core'
import { client } from '@island.is/application/graphql'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'

import * as styles from './App.treat'

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <Box className={styles.root}>
        <GridContainer>
          <Header />
        </GridContainer>
        <Switch>
          <Route exact path="/">
            <Redirect to="/application/" />
          </Route>
          <Route strict exact path="/applications/:type">
            <Applications />
          </Route>
          <Route path="/application/:id">
            <Application />
          </Route>
        </Switch>
      </Box>
    </ApolloProvider>
  )
}

export default App
