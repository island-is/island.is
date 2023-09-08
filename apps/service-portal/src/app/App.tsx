import { useEffect, useMemo } from 'react'
import { ApolloProvider } from '@apollo/client'

import { useEffectOnce } from '@island.is/react-spa/shared'
import { AuthProvider } from '@island.is/auth/react'
import { toast } from '@island.is/island-ui/core'
import {
  createApolloClient,
  useGetOrganizationsQuery,
} from '@island.is/service-portal/graphql'
import { LocaleProvider, useLocale } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import {
  ApplicationErrorBoundary,
  PortalRouter,
  m,
  useOrganizationStore,
} from '@island.is/portals/core'
import { modules } from '../lib/modules'
import { createRoutes } from '../lib/routes'
import { ServicePortalPaths } from '../lib/paths'
import { environment } from '../environments'

import * as styles from './App.css'

const App = () => {
  const { formatMessage } = useLocale()
  const setOrganizationData = useOrganizationStore.use.setOrganizationData()
  const organizations = useOrganizationStore.use.organizations()
  const { data: orgData } = useGetOrganizationsQuery()

  useEffect(() => {
    if (orgData?.getOrganizations.items && organizations.length === 0) {
      setOrganizationData(orgData.getOrganizations.items)
    }
  }, [orgData])

  useEffectOnce(() => {
    useOrganizationStore.subscribe(({ organization }) => {
      if (organization?.title) {
        toast.warning(formatMessage(m.shortThirdPartyServiceErrorMessage), {
          // Make sure that toast is not duplicated
          toastId: organization.title,
        })
      }
    })
  })

  return (
    <AuthProvider basePath={ServicePortalPaths.Base}>
      <ApplicationErrorBoundary>
        <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
          <PortalRouter
            modules={modules}
            createRoutes={createRoutes}
            portalMeta={{
              basePath: ServicePortalPaths.Base,
              portalType: 'my-pages',
            }}
          />
        </FeatureFlagProvider>
      </ApplicationErrorBoundary>
    </AuthProvider>
  )
}

const AppWrapper = () => {
  const setServiceError = useOrganizationStore.use.setServiceError()
  const client = useMemo(() => createApolloClient(setServiceError), [])

  return (
    <div className={styles.page}>
      <div className={styles.page}>
        <ApolloProvider client={client}>
          <LocaleProvider locale={defaultLanguage} messages={{}}>
            <App />
          </LocaleProvider>
        </ApolloProvider>
      </div>
    </div>
  )
}

export default AppWrapper
