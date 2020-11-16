import React from 'react'
import { User } from '../../graphql/schema'

interface UserProviderProps {
  isAuthenticated: boolean
  user: User
  setUser: any
}

export const UserProvider = ({
  isAuthenticated,
  user,
  setUser,
}: UserProviderProps) => {}
