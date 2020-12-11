import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'

import {
  Text,
  Box,
  Stack,
  ActionCard,
  Page,
  Button,
} from '@island.is/island-ui/core'

import useAuth from '../hooks/useAuth'

export const AssignApplication = () => {
  const location = useLocation()
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
  console.log(queryParams)
  const { userInfo } = useAuth()

  let error: string | null = null
  if (!queryParams.token) {
    error = 'Missing token'
  }

  return (
    <Page>
      {error !== null ? (
        <h2>{error}</h2>
      ) : (
        <h2>New assignee: {userInfo?.profile.nationalId}</h2>
      )}
    </Page>
  )
}
