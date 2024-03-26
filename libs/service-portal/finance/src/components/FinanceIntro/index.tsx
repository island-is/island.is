import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { ISLANDIS_SLUG, InstitutionPanel } from '@island.is/service-portal/core'
import { useOrganization } from '@island.is/service-portal/graphql'
import { useWindowSize } from 'react-use'
import { OrganizationSlugType } from '@island.is/shared/constants'

interface Props {
  children?: React.ReactNode
  text?: React.ReactNode
  buttonGroup?: Array<React.ReactNode>
  serviceProviderSlug?: OrganizationSlugType
  serviceProviderTooltip?: string
}
const FinanceIntro = ({
  children,
  buttonGroup,
  serviceProviderSlug,
  serviceProviderTooltip,
}: Props) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const { data: organization, loading } = useOrganization(
    serviceProviderSlug ?? ISLANDIS_SLUG,
  )

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['6/8']}>
          <Box paddingBottom={4}>{children}</Box>
          {buttonGroup && (
            <Hidden print={true}>
              <Inline flexWrap="wrap" space={2}>
                {buttonGroup}
              </Inline>
            </Hidden>
          )}
        </GridColumn>
        {!isMobile && serviceProviderSlug && organization && (
          <GridColumn span={'2/8'}>
            <Hidden print={true}>
              <InstitutionPanel
                loading={loading}
                linkHref={organization.link ?? ''}
                img={organization.logo?.url ?? ''}
                imgContainerDisplay={isMobile ? 'block' : 'flex'}
                tooltipText={serviceProviderTooltip}
              />
            </Hidden>
          </GridColumn>
        )}
      </GridRow>
    </GridContainer>
  )
}

export default FinanceIntro
