import { useContext } from 'react'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { signOut, useSession } from 'next-auth/client'
import { signOutUrl } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import { AuthSession } from '@island.is/next-ids-auth'

export const useLogOut = () => {
  const { setUser } = useContext(AppContext)
  const { initializeFormProvider } = useContext(FormContext)
  const [session]: AuthSession = useSession()

  const logOut = () => {
    setUser && setUser(undefined)
    sessionStorage.clear()

    initializeFormProvider()
    signOut({
      callbackUrl: signOutUrl(window, session?.idToken),
    })
  }
  return logOut
}
