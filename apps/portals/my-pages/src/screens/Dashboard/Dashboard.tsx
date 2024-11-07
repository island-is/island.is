import React, { FC, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'
import {
  Box,
  Button,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DocumentsPaths,
  DocumentLine,
  DocumentLineV3,
  useDocumentListV3,
} from '@island.is/service-portal/documents'
import {
  LinkResolver,
  PlausiblePageviewDetail,
  ServicePortalPaths,
  m,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import Greeting from '../../components/Greeting/Greeting'
import DocumentsEmpty from '../../components/DocumentsEmpty/DocumentsEmpty'
import { iconIdMapper, iconTypeToSVG } from '../../utils/Icons/idMapper'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { useOrganizations } from '@island.is/service-portal/graphql'
import * as styles from './Dashboard.css'
import cn from 'classnames'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { DocumentsScope } from '@island.is/auth/scopes'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

export const Dashboard: FC<React.PropsWithChildren<unknown>> = () => {
  const { userInfo } = useAuth()

  const { data: organizations } = useOrganizations()
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const location = useLocation()
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const isMobile = width < theme.breakpoints.md
  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'
  const hasDelegationAccess = userInfo?.scopes?.includes(DocumentsScope.main)

  // Versioning feature flag. Remove after feature is live.
  const [v3Enabled, setV3Enabled] = useState<boolean>()

  const { filteredDocuments, data, loading } = useDocumentListV3({
    defaultPageSize: 8,
  })

  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalDocumentsV3PageEnabled`,
        false,
      )
      if (ffEnabled) {
        setV3Enabled(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    PlausiblePageviewDetail(
      ServicePortalPaths.Root,
      IS_COMPANY ? 'company' : 'person',
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const unreadCounter = data?.documentsV2?.unreadCount ?? 0
  const badgeActive: keyof typeof styles.badge =
    unreadCounter > 0 ? 'active' : 'inactive'

  const onHover = (id: string) => {
    const a: HTMLElement | null | '' =
      id && document.getElementById(iconIdMapper(id))
    a && a.dispatchEvent(new Event('click'))
  }

  const displayCards = () => {
    // eslint-disable-next-line no-lone-blocks
    {
      return navigation?.children
        ?.filter((item) => !item.navHide)
        .map(
          (navRoot, index) =>
            navRoot.path !== ServicePortalPaths.Root &&
            navRoot.path && (
              <GridColumn
                key={formatMessage(navRoot.name) + '-' + index}
                span={['12/12', '6/12']}
                paddingBottom={[1, 2, 3]}
                hiddenAbove={
                  navRoot.path === DocumentsPaths.ElectronicDocumentsRoot
                    ? 'md'
                    : undefined
                }
              >
                <Box
                  onMouseEnter={() => onHover(navRoot.icon?.icon ?? '')}
                  height="full"
                  flexGrow={1}
                  className={styles.svgOutline}
                >
                  {navRoot.path && (
                    <>
                      {navRoot.enabled === false && (
                        <Icon
                          color="blue600"
                          type="outline"
                          icon="lockClosed"
                          size="small"
                          className={styles.lock}
                        />
                      )}

                      {navRoot.subscribesTo === 'documents' && (
                        <Box
                          borderRadius="circle"
                          className={cn(styles.badge[badgeActive])}
                        />
                      )}
                      <CategoryCard
                        autoStack
                        hyphenate
                        truncateHeading
                        component={Link}
                        to={navRoot.path}
                        headingVariant="h4"
                        headingAs="h2"
                        icon={
                          isMobile && navRoot.icon ? (
                            <Icon
                              icon={navRoot.icon.icon}
                              type="outline"
                              color="blue400"
                            />
                          ) : (
                            iconTypeToSVG(navRoot.icon?.icon ?? '') ??
                            (navRoot.icon ? (
                              <Icon
                                icon={navRoot.icon.icon}
                                type="outline"
                                color="blue400"
                              />
                            ) : undefined)
                          )
                        }
                        heading={formatMessage(navRoot.name)}
                        text={
                          navRoot.description
                            ? formatMessage(navRoot.description)
                            : formatMessage(navRoot.name)
                        }
                      />
                    </>
                  )}
                </Box>
              </GridColumn>
            ),
        )
    }
  }

  return (
    <Box>
      <Greeting />
      <Box paddingTop={[0, 0, 0, 4]} marginBottom={3}>
        <GridContainer>
          <GridRow data-testid="service-portal-dashboard">
            <GridColumn
              hiddenBelow="lg"
              span={['12/12', '12/12', '12/12', '5/12']}
            >
              <Box
                borderRadius="large"
                paddingY={3}
                paddingX={4}
                borderWidth="standard"
                borderColor="blue200"
              >
                <LinkResolver
                  className={styles.mailLink}
                  href={DocumentsPaths.ElectronicDocumentsRoot}
                >
                  <Box
                    onMouseEnter={() => onHover('mail')}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    paddingBottom={1}
                  >
                    <Box
                      paddingRight={1}
                      display="flex"
                      alignItems="center"
                      className={cn([styles.mailIcon, styles.svgOutline])}
                    >
                      {isMobile ? (
                        <Icon icon="mail" type="outline" color="blue400" />
                      ) : (
                        iconTypeToSVG('mail') ?? (
                          <Icon icon="mail" type="outline" color="blue400" />
                        )
                      )}
                    </Box>
                    <Text as="h2" variant="h4" color="blue400" truncate>
                      {formatMessage(m.documents)}
                    </Text>

                    <Box
                      borderRadius="circle"
                      className={cn(styles.badge[badgeActive])}
                    />
                  </Box>
                </LinkResolver>
                {loading ? (
                  <Box marginTop={4}>
                    <SkeletonLoader
                      space={2}
                      repeat={6}
                      display="block"
                      width="full"
                      height={65}
                    />
                  </Box>
                ) : filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc, i) => (
                    <Box key={doc.id}>
                      {v3Enabled ? (
                        <DocumentLineV3
                          img={
                            doc?.sender?.name
                              ? getOrganizationLogoUrl(
                                  doc?.sender?.name,
                                  organizations,
                                  60,
                                  'none',
                                )
                              : undefined
                          }
                          documentLine={doc}
                          active={false}
                          asFrame
                          includeTopBorder={i === 0}
                        />
                      ) : (
                        <DocumentLine
                          img={
                            doc?.sender?.name
                              ? getOrganizationLogoUrl(
                                  doc?.sender?.name,
                                  organizations,
                                  60,
                                  'none',
                                )
                              : undefined
                          }
                          documentLine={doc}
                          active={false}
                          asFrame
                          includeTopBorder={i === 0}
                        />
                      )}
                    </Box>
                  ))
                ) : (
                  <DocumentsEmpty hasDelegationAccess={!!hasDelegationAccess} />
                )}

                {hasDelegationAccess && (
                  <Box
                    textAlign="center"
                    marginBottom={1}
                    printHidden
                    marginY={3}
                  >
                    <LinkResolver href={DocumentsPaths.ElectronicDocumentsRoot}>
                      <Button
                        icon="arrowForward"
                        iconType="filled"
                        size="small"
                        type="button"
                        variant="text"
                      >
                        {formatMessage(m.openDocuments)}
                      </Button>
                    </LinkResolver>
                  </Box>
                )}
              </Box>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
              <GridContainer>
                <GridRow>{displayCards()}</GridRow>
              </GridContainer>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}

export default Dashboard
