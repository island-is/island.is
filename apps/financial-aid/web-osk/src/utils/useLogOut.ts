import { useContext } from 'react'

import { api } from '@island.is/financial-aid-web/osk/src/services'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

export const useLogOut = () => {
  const { setUser } = useContext(UserContext)
  const { initializeFormProvider } = useContext(FormContext)

  const logOut = () => {
    api.logOut()
    setUser && setUser(undefined)
    initializeFormProvider()
  }
  return logOut
}
