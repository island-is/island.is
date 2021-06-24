import { useContext } from 'react'

import { api } from '../../services'
import { AdminContext } from '../components/AdminProvider/AdminProvider'

export const useLogOut = () => {
  const { setAdmin } = useContext(AdminContext)

  const logOut = () => {
    api.logOut()
    setAdmin && setAdmin(undefined)
  }

  return logOut
}
