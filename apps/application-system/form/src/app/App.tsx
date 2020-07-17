import React from 'react'

import { Route } from 'react-router-dom'

import { ApplicationForm } from '@island.is/application/form'
import { ExampleForm3 } from '@island.is/application/schema'
import { Header, Page, Box } from '@island.is/island-ui/core'

export const App = () => {
  return (
    <Page>
      <Route path="/">
        <Box paddingLeft={5}>
          <Header />
        </Box>
        <ApplicationForm form={ExampleForm3} initialAnswers={{}} />
      </Route>
    </Page>
  )
}

export default App
