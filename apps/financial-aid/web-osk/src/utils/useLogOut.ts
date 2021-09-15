import { useContext } from 'react'

import { api } from '@island.is/financial-aid-web/osk/src/services'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

export const useLogOut = () => {
  const { setUser } = useContext(UserContext)
  const { updateForm } = useContext(FormContext)

  const logOut = () => {
    api.logOut()
    setUser && setUser(undefined)
    updateForm({
      submitted: false,
      incomeFiles: [],
      taxReturnFiles: [],
      otherFiles: [],
    })
  }

  //TODO
  return logOut
}
