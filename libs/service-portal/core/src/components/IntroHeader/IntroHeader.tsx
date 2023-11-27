import {
  GridColumn,
  GridRow,
  Text,
  LoadingDots,
  GridColumnProps,
} from '@island.is/island-ui/core'
import { IntroHeaderProps } from '@island.is/portals/core'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { useOrganization } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationSlugType } from '@island.is/shared/constants'

interface Props {
  serviceProviderSlug?: OrganizationSlugType
  serviceProviderTooltip?: string
  span?: GridColumnProps['span']
  narrow?: boolean
  loading?: boolean
  backgroundColor?: 'purple100' | 'blue100' | 'white'
  tooltipVariant?: 'light' | 'dark' | 'white'
}
export const IntroHeader = (props: IntroHeaderProps & Props) => {
  const { marginBottom } = props
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const { data: organization, loading } = useOrganization(
    props.serviceProviderSlug,
  )

  const columnSpan = isMobile ? '8/8' : props.narrow ? '4/8' : '5/8'

  if (props.loading) {
    return <LoadingDots />
  }

  return (
    <GridRow marginBottom={marginBottom ?? 4}>
      <GridColumn span={props.span ? props.span : columnSpan}>
        <Text variant="h3" as={props.isSubheading ? 'h2' : 'h1'}>
          {formatMessage(props.title)}
        </Text>
        {props.intro && (
          <Text variant="default" paddingTop={1}>
            {formatMessage(props.intro)}
          </Text>
        )}
        {props.children}
      </GridColumn>
      {!isMobile && organization && (
        <GridColumn span={'2/8'} offset={'1/8'}>
          <InstitutionPanel
            loading={loading}
            linkHref={organization.link ?? ''}
            img={organization.logo?.url ?? ''}
            imgContainerDisplay={isMobile ? 'block' : 'flex'}
            tooltipText={props.serviceProviderTooltip}
            backgroundColor={props.backgroundColor}
            tooltipVariant={props.tooltipVariant ?? 'light'}
          />
        </GridColumn>
      )}
    </GridRow>
  )
}

export default IntroHeader
