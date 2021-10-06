import { useContext } from 'react'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { signOut, useSession } from 'next-auth/client'
import { signOutUrl } from '@island.is/financial-aid/shared/lib'

export const useLogOut = () => {
  const { setUser } = useContext(UserContext)
  const { initializeFormProvider } = useContext(FormContext)
  const [session] = useSession()

  const logOut = () => {
    setUser && setUser(undefined)
    initializeFormProvider()
    signOut({
      callbackUrl: signOutUrl(window, session?.idToken),
    })
  }
  return logOut
}
