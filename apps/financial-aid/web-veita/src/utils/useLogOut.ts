import { useContext } from 'react'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import { signOut, useSession } from 'next-auth/client'
import { signOutUrl } from '@island.is/financial-aid/shared/lib'

export const useLogOut = () => {
  const { setAdmin } = useContext(AdminContext)
  const [session] = useSession()

  const logOut = () => {
    setAdmin && setAdmin(undefined)
    signOut({
      callbackUrl: signOutUrl(window, session?.idToken),
    })
  }

  return logOut
}
