import React, { FC, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'
import {
  Box,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PlausiblePageviewDetail,
  ServicePortalPath,
  m,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import Greeting from '../../components/Greeting/Greeting'
import { iconIdMapper, iconTypeToSVG } from '../../utils/Icons/idMapper'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { useListDocuments } from '@island.is/service-portal/graphql'
import * as styles from './Dashboard.css'
import cn from 'classnames'

export const Dashboard: FC<{}> = () => {
  const { userInfo } = useAuth()
  const { unreadCounter } = useListDocuments()
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const location = useLocation()
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const isMobile = width < theme.breakpoints.md
  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'

  useEffect(() => {
    PlausiblePageviewDetail(
      ServicePortalPath.MinarSidurRoot,
      IS_COMPANY ? 'company' : 'person',
    )
  }, [location])

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
            navRoot.path !== ServicePortalPath.MinarSidurRoot && (
              <GridColumn
                key={formatMessage(navRoot.name) + '-' + index}
                span={['12/12', '12/12', '6/12', '4/12', '3/12']}
                paddingBottom={3}
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
                      <CategoryCard
                        autoStack
                        hyphenate
                        truncateHeading
                        component={Link}
                        to={navRoot.path}
                        icon={
                          isMobile && navRoot.icon ? (
                            <Icon
                              icon={navRoot.icon.icon}
                              type="outline"
                              color="blue400"
                            />
                          ) : (
                            iconTypeToSVG(navRoot.icon?.icon ?? '', '') ??
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
                      {navRoot.subscribesTo === 'documents' && (
                        <Box
                          borderRadius="circle"
                          className={cn(styles.badge[badgeActive])}
                        />
                      )}
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
          <GridRow>{displayCards()}</GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}

export default Dashboard
