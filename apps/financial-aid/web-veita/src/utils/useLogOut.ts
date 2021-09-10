import { useContext } from 'react'

import { api } from '@island.is/financial-aid-web/veita/services'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

export const useLogOut = () => {
  const { setAdmin } = useContext(AdminContext)

  const logOut = () => {
    api.logOut()
    setAdmin && setAdmin(undefined)
  }

  return logOut
}
