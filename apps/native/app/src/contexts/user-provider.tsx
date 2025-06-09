import { ApolloError } from '@apollo/client'
import { PropsWithChildren, createContext, useContext } from 'react'
import { GetProfileQuery, useGetProfileQuery } from '../graphql/types/schema'

type UserContextType = {
  user: GetProfileQuery['getUserProfile'] | null
  refetch(): void
  loading: boolean
  error?: ApolloError
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { data, loading, error, refetch } = useGetProfileQuery()
  const userProfile = data?.getUserProfile

  return (
    <UserContext.Provider
      value={{ user: userProfile ?? null, refetch, loading, error }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
