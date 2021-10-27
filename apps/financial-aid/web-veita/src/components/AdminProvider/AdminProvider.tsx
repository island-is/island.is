import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Municipality, User } from '@island.is/financial-aid/shared/lib'

import { CurrentUserQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { useSession } from 'next-auth/client'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLogOut } from '../../utils/useLogOut'
import { useMunicipality } from '@island.is/financial-aid/shared/components'

interface AdminProvider {
  isAuthenticated?: boolean
  admin?: User
  setAdmin?: React.Dispatch<React.SetStateAction<User | undefined>>
  municipality?: Municipality
}

interface PageProps {
  children: ReactNode
}

export const AdminContext = createContext<AdminProvider>({})

const AdminProvider = ({ children }: PageProps) => {
  const [session] = useSession()
  const logOut = useLogOut()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )
  const [admin, setAdmin] = useState<User>()

  const { data, error } = useQuery(CurrentUserQuery, {
    fetchPolicy: 'no-cache',
  })
  const loggedInUser = data?.currentUser

  const { municipality, setMunicipality } = useMunicipality()

  useEffect(() => {
    if (loggedInUser && !admin) {
      setAdmin(loggedInUser)
      setMunicipality(loggedInUser.staff.municipalityIds[0])
      setIsAuthenticated(true)
    }
  }, [setAdmin, loggedInUser, admin])

  if (error && session) {
    // TODO: Get design and implement
    return (
      <Box margin={8}>
        <Text marginBottom={8}>Notandi fannst ekki</Text>
        <Button onClick={() => logOut()}>Skrá mig út</Button>
      </Box>
    )
  }

  return (
    <AdminContext.Provider
      value={{ isAuthenticated, admin, setAdmin, municipality }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export default AdminProvider
