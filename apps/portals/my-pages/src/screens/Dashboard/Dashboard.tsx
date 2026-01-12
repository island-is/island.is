import { DocumentsScope } from '@island.is/auth/scopes'
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
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  FALLBACK_ORG_LOGO_URL,
  LinkResolver,
  ORG_LOGO_PARAMS,
  PlausiblePageviewDetail,
  ServicePortalPaths,
  m,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import {
  DocumentLine,
  DocumentsPaths,
  useDocumentList,
} from '@island.is/portals/my-pages/documents'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'
import cn from 'classnames'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import DocumentsEmpty from '../../components/DocumentsEmpty/DocumentsEmpty'
import Greeting from '../../components/Greeting/Greeting'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { iconIdMapper, iconTypeToSVG } from '../../utils/Icons/idMapper'
import * as styles from './Dashboard.css'

export const Dashboard = () => {
  const userInfo = useUserInfo()

  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const location = useLocation()
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const isMobile = width < theme.breakpoints.md
  const IS_COMPANY = isCompany(userInfo)
  const hasDelegationAccess = userInfo?.scopes?.includes(DocumentsScope.main)

  const { filteredDocuments, data, loading } = useDocumentList()

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
                          borderRadius="full"
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
                      borderRadius="full"
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
                      <DocumentLine
                        img={
                          doc?.sender?.logoUrl
                            ? doc.sender.logoUrl.concat(ORG_LOGO_PARAMS)
                            : FALLBACK_ORG_LOGO_URL
                        }
                        documentLine={doc}
                        active={false}
                        asFrame
                        includeTopBorder={i === 0}
                      />
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
