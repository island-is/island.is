import { GridColumn } from '@island.is/island-ui/core'
import { useOrganization } from '@island.is/portals/my-pages/graphql'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { MessageDescriptor } from 'react-intl'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  serviceProvider: OrganizationSlugType
  tooltipText?: MessageDescriptor
}

export const TabNavigationInstitutionPanel = ({
  tooltipText,
  serviceProvider,
}: Props) => {
  const { formatMessage } = useLocale()
  const { data: organization, loading } = useOrganization(serviceProvider)
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  return (
    <GridColumn span="1/8" offset="1/8">
      {organization?.logo && (
        <InstitutionPanel
          loading={loading}
          linkHref={organization.link ?? ''}
          linkLabel={organization.title}
          img={organization.logo?.url ?? ''}
          tooltipText={tooltipText ? formatMessage(tooltipText) : ''}
          imgContainerDisplay={isMobile ? 'block' : 'flex'}
        />
      )}
    </GridColumn>
  )
}
