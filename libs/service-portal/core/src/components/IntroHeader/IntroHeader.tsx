import {
  GridColumn,
  GridRow,
  Text,
  Hidden,
  Box,
} from '@island.is/island-ui/core'
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

  // marginBottom={marginBottom ? marginBottom : [0, 0, 2]}
  return (
    <>
      <GridRow marginBottom={marginBottom}>
        <GridColumn span={['8/8', '5/8']}>
          <Text variant="h3" as="h1">
            {formatMessage(props.title)}
          </Text>
          {props.intro && (
            <Text variant="default" paddingTop={2}>
              {formatMessage(props.intro)}
            </Text>
          )}
        </GridColumn>
        {currentOrganization && (
          <GridColumn span={'1/8'} offset={'2/8'}>
            <InstitutionPanel
              loading={loading}
              linkHref={currentOrganization?.link ?? ''}
              img={currentOrganization?.logo?.url ?? ''}
              imgContainerDisplay="block"
            />
          </GridColumn>
        )}
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/8']} order={3} paddingTop={4}>
          <ModuleAlertBannerSection />
        </GridColumn>
      </GridRow>
    </>
  )
}

export default IntroHeader
