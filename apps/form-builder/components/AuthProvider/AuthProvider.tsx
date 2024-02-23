// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ReactNode } from "react"
import useUser from "../../hooks/useUser"
import UserContext from "../../context/UserContext"
import { User } from "../../types/interfaces"

interface UserProps {
  children: ReactNode
}


const AuthProvider = ({ children }: UserProps) => {
  const { isAuthenticated, setIsAuthenticated, user, setUser, userLoading } = useUser()

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        userLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider
