import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import Cookies from 'js-cookie'

import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import {
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCurrentUserQuery } from './currentUser.generated'

interface UserProvider {
  isLoading?: boolean
  isAuthenticated?: boolean
  limitedAccess?: boolean
  user?: User
  eligibleUsers?: User[]
  hasError?: boolean
}

export const UserContext = createContext<UserProvider>({})

// Used for accessing the current user outside of React components
export const userRef: { current?: User; authBypass?: boolean } = {}

// Setting authenticated to true forces current user query in unit tests
interface Props {
  authenticated?: boolean
}

export const UserProvider: FC<PropsWithChildren<Props>> = ({
  children,
  authenticated = false,
}) => {
  const [user, setUser] = useState<User>()
  const [eligibleUsers, setEligibleUsers] = useState<User[]>()
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated =
    authenticated || Boolean(Cookies.get(CSRF_COOKIE_NAME))

  const { data, error } = useCurrentUserQuery({
    skip: !isAuthenticated,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (!data?.currentUser) {
      return
    }

    const currentUser = data.currentUser

    if (currentUser.user) {
      setIsLoading(false)
      setUser(currentUser.user)
      userRef.current = currentUser.user
    }

    setEligibleUsers(currentUser.eligibleUsers)
    userRef.authBypass = Boolean(Cookies.get(CSRF_COOKIE_NAME))
  }, [data?.currentUser])

  return (
    <UserContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        eligibleUsers,
        limitedAccess:
          user && // Needed for e2e tests as they do not have a logged in user
          !isProsecutionUser(user) &&
          !isDistrictCourtUser(user) &&
          !isCourtOfAppealsUser(user) &&
          !isPublicProsecutionOfficeUser(user),
        hasError: Boolean(error),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
