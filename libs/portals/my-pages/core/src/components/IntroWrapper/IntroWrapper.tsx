import {
  Box,
  BoxProps,
  Text,
  GridColumn,
  GridColumnProps,
  GridRow,
  SkeletonLoader,
  Stack,
  Inline,
} from '@island.is/island-ui/core'
import FootNote from '../FootNote/FootNote'
import { MessageDescriptor } from 'react-intl'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { useOrganization } from '@island.is/portals/my-pages/graphql'
import { ISLANDIS_SLUG } from '../../utils/constants'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { m } from '../../lib/messages'

type BaseProps = {
  title: MessageDescriptor | string
  img?: string
  isSubheading?: boolean
  children?: React.ReactNode
  childrenWidthFull?: boolean
  buttonGroup?: Array<React.ReactNode>
  serviceProviderSlug?: OrganizationSlugType
  serviceProviderTooltip?: string
  span?: GridColumnProps['span']
  marginBottom?: BoxProps['marginBottom']
  narrow?: boolean
  loading?: boolean
  backgroundColor?: 'purple100' | 'blue100' | 'white'
  tooltipVariant?: 'light' | 'dark' | 'white'
}

interface WithIntroComponentProps extends BaseProps {
  introComponent?: React.ReactNode
  intro?: never
}

interface WithIntroProps extends BaseProps {
  introComponent?: never
  intro?: MessageDescriptor | string
}

export type IntroWrapperProps = WithIntroComponentProps | WithIntroProps

export const IntroWrapper = (props: IntroWrapperProps) => {
  const { marginBottom, childrenWidthFull = false } = props
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
    <Box>
      <GridRow marginBottom={props.buttonGroup ? 0 : marginBottom ?? 4}>
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
            </>
          )}
        </GridColumn>
        {!isMobile && (
          <GridColumn span={'2/8'} offset={isTablet ? '0' : '1/8'}>
            {props.img && (
              <Box
                alt=""
                component="img"
                src={props.img}
                width="full"
                height="full"
                marginRight={0}
              />
            )}
            {props.serviceProviderSlug && organization?.link && (
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
            )}
          </GridColumn>
        )}
      </GridRow>
      {!props.loading && props.buttonGroup && (
        <GridRow marginBottom={marginBottom ?? 4}>
          <GridColumn>
            <Box marginTop={4}>
              <Inline space={2}>{props.buttonGroup}</Inline>
            </Box>
          </GridColumn>
        </GridRow>
      )}
      <GridRow>
        <GridColumn span={childrenWidthFull || isMobile ? '12/12' : '10/12'}>
          {props.children}
        </GridColumn>
      </GridRow>
      <FootNote serviceProviderSlug={props.serviceProviderSlug} />
    </Box>
  )
}

export default IntroWrapper
