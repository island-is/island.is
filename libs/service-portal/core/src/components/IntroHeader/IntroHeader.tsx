import { ReactNode } from 'react'
import {
  GridColumn,
  GridRow,
  Text,
  GridColumnProps,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { IntroHeaderProps } from '@island.is/portals/core'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { useOrganization } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { ISLANDIS_SLUG } from '../../utils/constants'
import { m } from '../../lib/messages'

interface Props {
  serviceProviderSlug?: OrganizationSlugType
  serviceProviderTooltip?: string
  span?: GridColumnProps['span']
  narrow?: boolean
  loading?: boolean
  backgroundColor?: 'purple100' | 'blue100' | 'white'
  introComponent?: ReactNode
  tooltipVariant?: 'light' | 'dark' | 'white'
}

/**
 * @deprecated Do not use manually. Use <IntroWrapper /> instead
 */

export const IntroHeader = (props: IntroHeaderProps & Props) => {
  const { marginBottom } = props
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

  const { data: organization, loading } = useOrganization(
    props.serviceProviderSlug ?? ISLANDIS_SLUG,
  )

  const columnSpan = isMobile
    ? '8/8'
    : isTablet
    ? '6/8'
    : props.narrow
    ? '4/8'
    : '5/8'

  return (
    <GridRow marginBottom={marginBottom ?? 4}>
      <GridColumn span={props.span ? props.span : columnSpan}>
        {props.loading ? (
          <Stack space={2}>
            <SkeletonLoader height={24} width={120} />
            <SkeletonLoader height={24} width={300} />
          </Stack>
        ) : (
          <>
            <Text variant="h3" as={props.isSubheading ? 'h2' : 'h1'}>
              {formatMessage(props.title)}
            </Text>
            {props.intro && (
              <Text variant="default" paddingTop={1}>
                {formatMessage(props.intro)}
              </Text>
            )}
            {props.introComponent && (
              <Box paddingTop={1}>{props.introComponent}</Box>
            )}
            {props.children}
          </>
        )}
      </GridColumn>
      {!isMobile && props.serviceProviderSlug && organization && (
        <GridColumn span={'2/8'} offset={isTablet ? '0' : '1/8'}>
          <InstitutionPanel
            loading={loading}
            linkHref={organization.link ?? ''}
            linkLabel={
              organization.title
                ? formatMessage(m.readMoreAbout, {
                    arg: organization.title,
                  })
                : ''
            }
            img={organization.logo?.url ?? ''}
            imgContainerDisplay={isMobile ? 'block' : 'flex'}
            isSvg={organization.logo?.contentType === 'image/svg+xml'}
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
