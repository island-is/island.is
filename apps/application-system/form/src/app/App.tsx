import React from 'react'

import { Route } from 'react-router-dom'

import { ApplicationForm } from '@island.is/application/form'
import { ExampleForm3 } from '@island.is/application/schema'
import { Header, Box } from '@island.is/island-ui/core'

import * as styles from './App.treat'

export const App = () => {
  return (
    <Box className={styles.root}>
      <Route path="/">
        <Box paddingLeft={[3, 3, 5]}>
          <Header />
        </Box>
        <ApplicationForm form={ExampleForm3} initialAnswers={{}} />
      </Route>
    </Box>
  )
}

export default App
