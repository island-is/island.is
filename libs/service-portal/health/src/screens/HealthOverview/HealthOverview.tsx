import React from 'react'
import { InfoScreen, m } from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'
import { Navigate } from 'react-router-dom'
import { HealthPaths } from '../../lib/paths'

export const HealthOverview = () => {
  useNamespaces('sp.health')

  return <Navigate to={HealthPaths.HealthTherapies} replace />
}

export default HealthOverview
