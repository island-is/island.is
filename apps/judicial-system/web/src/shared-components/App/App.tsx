import React, { useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Header } from '../Header'
import * as Constants from '../../utils/constants'
import { Overview } from '../../routes/Overview'
import { StepOne, StepTwo } from '../../routes/CreateDetentionRequest'
import { DetentionRequests } from '../../routes/DetentionRequests'
import { Login } from '../../routes/Login'
import * as styles from './App.treat'
import { User } from '../../types'
import { userContext } from '../../utils/userContext'
import JudgeOverview from '../../routes/Judge/Overview'

const App: React.FC = () => {
  const [user, setUser] = useState<User>(null)
  const onGetUser = (u: User) => {
    setUser(u)
  }

  return (
    <userContext.Provider value={{ user: user }}>
      <BrowserRouter>
        <Header />
        <main className={styles.mainConainer}>
          <Switch>
            <Route path={Constants.STEP_THREE_ROUTE}>
              <Overview />
            </Route>
            <Route path={Constants.STEP_TWO_ROUTE}>
              <StepTwo />
            </Route>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <JudgeOverview />
            </Route>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
            <Route path={Constants.STEP_ONE_ROUTE}>
              <StepOne />
            </Route>
            <Route path={Constants.DETENTION_REQUESTS_ROUTE}>
              <DetentionRequests onGetUser={onGetUser} />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </userContext.Provider>
  )
}

export default App
