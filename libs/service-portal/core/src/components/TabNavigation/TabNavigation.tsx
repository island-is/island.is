import { useEffect, useState } from 'react'
import { PortalNavigationItem } from '@island.is/portals/core'
import {
  Box,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { SubTabItem } from './SubTabItem'
import * as styles from './TabNavigation.css'
import LinkResolver from '../LinkResolver/LinkResolver'
import { useOrganization } from '@island.is/service-portal/graphql'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'

interface Props {
  pathname?: string
  label: string
  items: PortalNavigationItem[]
}

export const TabNavigation: React.FC<Props> = ({ items, pathname, label }) => {
  const { formatMessage } = useLocale()
  const [activeItem, setActiveItem] = useState<
    PortalNavigationItem | undefined
  >()
  const [activeItemChildren, setActiveItemChildren] = useState<
    PortalNavigationItem[] | undefined
  >()
  const navigate = useNavigate()
  const { width } = useWindowSize()

  const { data: organization, loading } = useOrganization(
    activeItem?.serviceProvider,
  )

  useEffect(() => {
    const activeItem = items.filter((itm) => itm.active)?.[0] ?? undefined
    setActiveItem(activeItem)
    setActiveItemChildren(activeItem?.children?.filter((itm) => !itm.navHide))
  }, [items])

  const tabChangeHandler = (id?: string) => {
    if (id && id !== pathname) {
      navigate(id)
    }
  }

  const descriptionText =
    activeItemChildren?.find((itemChild) => pathname === itemChild.path)
      ?.description ?? activeItem?.description

  const isMobile = width < theme.breakpoints.md
  return (
    <>
      <Box className={styles.tabList}>
        {items?.map((item, index) => (
          <FocusableBox
            component={LinkResolver}
            key={index}
            id={item.path}
            justifyContent="center"
            alignItems="center"
            padding={1}
            className={cn(styles.tab, {
              [styles.tabSelected]: item.active,
              [styles.tabNotSelected]: !item.active,
            })}
            href={item.path}
          >
            {formatMessage(item.name)}
          </FocusableBox>
        ))}
      </Box>
      {activeItem && activeItem.path && isMobile && (
        <Box className={styles.select}>
          <Select
            size="sm"
            name={label}
            label={label}
            onChange={(opt) => tabChangeHandler(opt?.value)}
            options={items.map((item) => ({
              label: formatMessage(item.name),
              value: item.path,
            }))}
            defaultValue={{
              value: activeItem.path,
              label: formatMessage(activeItem.name),
            }}
            isSearchable={false}
          />
        </Box>
      )}
      {activeItem && (
        <Box marginTop={[1, 1, 2, 4, 4]}>
          <GridContainer>
            <GridRow>
              {(!!activeItem.description ||
                (activeItemChildren?.length ?? 0) > 1) && (
                <GridColumn span="6/8">
                  <Box className={styles.description}>
                    {(activeItemChildren?.length ?? 0) > 1 && (
                      <Inline collapseBelow="sm">
                        {activeItemChildren?.map((itemChild, ii) => (
                          <SubTabItem
                            key={`subnav-${ii}`}
                            href={itemChild.path ?? '/'}
                            onClick={
                              itemChild.path
                                ? () => tabChangeHandler(itemChild.path)
                                : undefined
                            }
                            title={formatMessage(itemChild.name)}
                            colorScheme={
                              pathname === itemChild.path ? 'default' : 'light'
                            }
                            marginLeft={ii === 0 ? 0 : 2}
                          />
                        ))}
                      </Inline>
                    )}
                    {descriptionText && (
                      <Box>
                        <Text marginBottom={4}>
                          {formatMessage(descriptionText, {
                            br: (
                              <>
                                <br />
                                <br />
                              </>
                            ),
                          })}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </GridColumn>
              )}
              {activeItem.displayServiceProviderLogo && (
                <GridColumn span="1/8" offset="1/8">
                  {organization?.logo && (
                    <InstitutionPanel
                      loading={loading}
                      linkHref={organization.link ?? ''}
                      img={organization.logo?.url ?? ''}
                      tooltipText={
                        activeItem.serviceProviderTooltip
                          ? formatMessage(activeItem.serviceProviderTooltip)
                          : ''
                      }
                      imgContainerDisplay={isMobile ? 'block' : 'flex'}
                    />
                  )}
                </GridColumn>
              )}
            </GridRow>
          </GridContainer>
        </Box>
      )}
    </>
  )
}
