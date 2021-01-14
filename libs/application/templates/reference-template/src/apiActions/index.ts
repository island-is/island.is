import { API_ACTIONS } from '../shared'

export default {
  [API_ACTIONS.doStuff]: async () => {
    console.log('RUNNING API ACTION:', API_ACTIONS.doStuff)
  },
  [API_ACTIONS.performSomeAPIAction]: async () => {
    console.log('RUNNING API ACTION:', API_ACTIONS.performSomeAPIAction)
  },
}
