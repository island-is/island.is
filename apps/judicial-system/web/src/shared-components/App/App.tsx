import React, { useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { Header } from '../Header'
import * as Constants from '../../utils/constants'
import { Overview } from '../../routes/Prosecutor/Overview'
import {
  StepOne,
  StepTwo,
} from '../../routes/Prosecutor/CreateDetentionRequest'
import { DetentionRequests } from '../../routes/DetentionRequests'
import { Login } from '../../routes/Login'
import { userContext } from '../../utils/userContext'
import JudgeOverview from '../../routes/Judge/Overview/Overview'
import CourtRecord from '../../routes/Judge/CourtRecord/CourtRecord'
import { RulingStepOne, RulingStepTwo } from '../../routes/Judge/Ruling'
import Confirmation from '../../routes/Judge/Confirmation/Confirmation'
import { client } from '../../graphql'
import { User } from '@island.is/judicial-system/types'
import Cookie from 'js-cookie'
import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import HearingArrangements from '../../routes/Judge/HearingArrangements/HearingArrangements'

const App: React.FC = () => {
  const [user, setUser] = useState<User>(null)
  const isAuthenticated = () => Boolean(Cookie.get(CSRF_COOKIE_NAME))

  if (
    !isAuthenticated() &&
    window.location.pathname !== '/' &&
    window.location.pathname.substring(0, 1) !== '/?'
  ) {
    window.location.assign('/')
  }

  return (
    <ApolloProvider client={client}>
      <userContext.Provider
        value={{
          isAuthenticated: isAuthenticated,
          user,
          setUser,
        }}
      >
        <BrowserRouter>
          <Route
            render={(props) => {
              return <Header pathname={props.location.pathname} />
            }}
          ></Route>
          <main>
            <Switch>
              <Route
                path={Constants.FEEDBACK_FORM_ROUTE}
                component={() => {
                  window.open(Constants.FEEDBACK_FORM_URL, '_blank')
                  return <DetentionRequests />
                }}
              />
              <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
                <Confirmation />
              </Route>
              <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
                <RulingStepTwo />
              </Route>
              <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
                <RulingStepOne />
              </Route>
              <Route path={`${Constants.COURT_RECORD_ROUTE}/:id`}>
                <CourtRecord />
              </Route>
              <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
                <Overview />
              </Route>
              <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
                <StepTwo />
              </Route>
              <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
                <HearingArrangements />
              </Route>
              <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
                <JudgeOverview />
              </Route>
              <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id?`}>
                <StepOne />
              </Route>
              <Route path={Constants.DETENTION_REQUESTS_ROUTE}>
                <DetentionRequests />
              </Route>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </main>
        </BrowserRouter>
      </userContext.Provider>
    </ApolloProvider>
  )
}

export default App
