import { GridColumn } from '@island.is/island-ui/core'
import { ModuleAlertBannerSection } from '../AlertMessage/ModuleAlertMessageSection'
import {
  IntroHeader as IntroHeaderBase,
  IntroHeaderProps,
  PortalNavigationItem,
} from '@island.is/portals/core'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { useEffect, useState } from 'react'
import {
  GET_ORGANIZATIONS_QUERY,
  Organization,
  useAlertBanners,
} from '@island.is/service-portal/graphql'
import { useDynamicRoutesWithNavigation } from '../..'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

interface Props {
  serviceProviderID?: string
}
export const IntroHeader = (
  props: Omit<IntroHeaderProps & Props, 'children'>,
) => {
  const { marginBottom } = props
  const { formatMessage } = useLocale()

  const [currentOrganization, setCurrentOrganization] = useState<
    Organization | undefined
  >(undefined)
  const { pathname } = useLocation()
  const { data: orgData, loading } = useQuery(GET_ORGANIZATIONS_QUERY)

  useEffect(() => {
    const organizations = orgData?.getOrganizations?.items || {}

    if (organizations && !loading) {
      const org = organizations.find(
        (org: Organization) => org.id === props.serviceProviderID,
      )
      if (org) setCurrentOrganization(org)
      else setCurrentOrganization(undefined)
    }
  }, [loading, pathname])

  return (
    <IntroHeaderBase
      {...props}
      marginBottom={marginBottom ? marginBottom : [0, 0, 2]}
    >
      {currentOrganization && (
        <InstitutionPanel
          loading={loading}
          institution={currentOrganization?.title ?? ''}
          institutionTitle={formatMessage(m.serviceProvider)}
          locale="is"
          linkHref={currentOrganization?.link ?? ''}
          img={currentOrganization?.logo?.url ?? ''}
          imgContainerDisplay="block"
        />
      )}
      <GridColumn span={['12/12', '12/12', '6/8']} order={3} paddingTop={4}>
        <ModuleAlertBannerSection />
      </GridColumn>
    </IntroHeaderBase>
  )
}

export default IntroHeader
