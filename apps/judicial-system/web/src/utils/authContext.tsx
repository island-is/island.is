import { createContext } from 'react'

const authContext = createContext({
  authenticated: false,
  user: {},
  accessToken: '',
})

export default authContext
