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
import JudgeOverview from '../../routes/Judge/Overview/Overview'
import CourtRecord from '../../routes/Judge/CourtRecord/CourtRecord'
import { RulingStepOne, RulingStepTwo } from '../../routes/Judge/Ruling'
import Confirmation from '../../routes/Judge/Confirmation/Confirmation'
import { client } from '../../graphql'
import HearingArrangements from '../../routes/Judge/HearingArrangements/HearingArrangements'
import { UserProvider } from '../UserProvider/UserProvider'

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <UserProvider>
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
        </UserProvider>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
