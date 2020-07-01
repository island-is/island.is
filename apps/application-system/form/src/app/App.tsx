import React from 'react'

import { Route } from 'react-router-dom'

import { ApplicationForm } from '@island.is/application/form'
import { ExampleForm } from '@island.is/application/schema'
import { Header, Page } from '@island.is/island-ui/core'

export const App = () => {
  return (
    <Page>
      <Route path="/">
        <Header />
        <ApplicationForm form={ExampleForm} initialAnswers={{}} />
      </Route>
    </Page>
  )
}

export default App
