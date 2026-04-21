import {
  Box,
  BoxProps,
  GridColumn,
  GridContainer,
  GridRow,
  ResponsiveProp,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { useOrganization } from '@island.is/portals/my-pages/graphql'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { MessageDescriptor } from 'react-intl'
import { useWindowSize } from 'react-use'
import { m } from '../../lib/messages'
import FootNote from '../FootNote/FootNote'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'

type IntroWrapperV2BaseProps = {
  title: MessageDescriptor | string
  loading?: boolean
  children?: React.ReactNode
  desktopContentSpan?: '12/12' | '10/12'
  marginBottom?: BoxProps['marginBottom']
  serviceProvider?: {
    slug: OrganizationSlugType
    tooltip?: string
  }
  buttonGroup?: {
    actions: Array<React.ReactNode>
    alignment?: ResponsiveProp<'flexStart' | 'flexEnd' | 'spaceBetween'>
  }
}

export type IntroWrapperV2Props = IntroWrapperV2BaseProps &
  (
    | { intro?: MessageDescriptor | string; introComponent?: never }
    | { introComponent?: React.ReactNode; intro?: never }
  )

export const IntroWrapperV2 = ({
  title,
  intro,
  introComponent,
  loading,
  children,
  desktopContentSpan = '12/12',
  marginBottom = [0, 0, 0, 4],
  serviceProvider,
  buttonGroup,
}: IntroWrapperV2Props) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

  const { data: organization, loading: orgLoading } = useOrganization(
    serviceProvider?.slug,
  )

  const effectiveContentSpan =
    desktopContentSpan === '10/12' && (isMobile || isTablet)
      ? '12/12'
      : desktopContentSpan

  return (
    <GridContainer>
      <GridRow marginBottom={buttonGroup ? 0 : marginBottom}>
        <GridColumn span="12/12">
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexStart"
            columnGap={4}
          >
            <Box>
              {loading ? (
                <Stack space={2}>
                  <SkeletonLoader height={24} width={120} />
                  <SkeletonLoader height={24} width={300} />
                </Stack>
              ) : (
                <>
                  <Text variant="h3" as="h1">
                    {formatMessage(title)}
                  </Text>
                  {intro && (
                    <Text variant="default" paddingTop={1}>
                      {formatMessage(intro)}
                    </Text>
                  )}
                  {introComponent && <Box paddingTop={1}>{introComponent}</Box>}
                </>
              )}
            </Box>
            {!isMobile && serviceProvider && organization?.link && (
              <Box flexShrink={0}>
                <InstitutionPanel
                  loading={orgLoading}
                  linkHref={organization.link}
                  linkLabel={
                    organization.title
                      ? formatMessage(m.readMoreAbout, {
                          arg: organization.title,
                        })
                      : ''
                  }
                  img={organization.logo?.url ?? ''}
                  imgContainerDisplay="flex"
                  isSvg={organization.logo?.contentType === 'image/svg+xml'}
                  tooltipText={serviceProvider.tooltip}
                />
              </Box>
            )}
          </Box>
        </GridColumn>
      </GridRow>
      {!loading && buttonGroup && (
        <GridRow marginBottom={marginBottom}>
          <GridColumn span={['12/12']}>
            <Box
              width="full"
              marginTop={4}
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              alignItems={isMobile ? 'flexStart' : 'flexEnd'}
              rowGap={isMobile ? 2 : 0}
              columnGap={2}
              justifyContent={
                isMobile ? 'flexStart' : buttonGroup.alignment ?? 'flexStart'
              }
            >
              {buttonGroup.actions}
            </Box>
          </GridColumn>
        </GridRow>
      )}
      <GridRow marginTop={2}>
        <GridColumn span={effectiveContentSpan}>{children}</GridColumn>
      </GridRow>
      <FootNote serviceProviderSlug={serviceProvider?.slug} />
    </GridContainer>
  )
}

export default IntroWrapperV2
