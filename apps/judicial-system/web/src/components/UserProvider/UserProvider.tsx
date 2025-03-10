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
  isPublicProsecutorUser,
} from '@island.is/judicial-system/types'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCurrentUserQuery } from './currentUser.generated'

interface UserProvider {
  isAuthenticated?: boolean
  limitedAccess?: boolean
  user?: User
  eligibleUsers?: User[]
}

export const UserContext = createContext<UserProvider>({})

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

  const isAuthenticated =
    authenticated || Boolean(Cookies.get(CSRF_COOKIE_NAME))

  const { data } = useCurrentUserQuery({
    skip: !isAuthenticated || Boolean(user),
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const currentUser = data?.currentUser

  useEffect(() => {
    if (currentUser?.user && !user) {
      setUser(currentUser?.user ?? undefined)
    }
    if (currentUser?.eligibleUsers && !eligibleUsers) {
      setEligibleUsers(currentUser?.eligibleUsers)
    }
  }, [setUser, currentUser, user, eligibleUsers])

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user: user,
        eligibleUsers: eligibleUsers,
        limitedAccess:
          user && // Needed for e2e tests as they do not have a logged in user
          !isProsecutionUser(user) &&
          !isDistrictCourtUser(user) &&
          !isCourtOfAppealsUser(user) &&
          !isPublicProsecutorUser(user),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
