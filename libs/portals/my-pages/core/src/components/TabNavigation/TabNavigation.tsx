import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { PortalNavigationItem } from '@island.is/portals/core'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { TabBar } from './TabBar'
import * as styles from './TabNavigation.css'
import { TabNavigationInstitutionPanel } from './TabNavigationInstitutionPanel'

interface Props {
  pathname?: string
  label: string
  items: PortalNavigationItem[]
}

interface ActivePath extends PortalNavigationItem {
  activeChild?: PortalNavigationItem
}

export const TabNavigation: React.FC<Props> = ({ items, pathname, label }) => {
  const { formatMessage } = useLocale()

  const navigate = useNavigate()
  const { width } = useWindowSize()

  const activePath: ActivePath | undefined = useMemo(() => {
    const active = items?.find((i) => i.active)
    if (!active) {
      //default to first one
      return items[0]
    }
    return {
      ...active,
      activeChild: active?.children?.find((c) => c.active),
    }
  }, [items])

  const tabChangeHandler = (id?: string) => {
    if (id && pathname && !(id === pathname || id === activePath.path)) {
      navigate(id)
    }
  }

  const serviceProvider =
    activePath?.activeChild?.serviceProvider ?? activePath.serviceProvider
  const descriptionText =
    activePath.activeChild?.description ?? activePath?.description
  const tooltipText =
    activePath.activeChild?.serviceProviderTooltip ??
    activePath.serviceProviderTooltip

  const isMobile = width < theme.breakpoints.md

  return (
    <>
      <TabBar
        aria-label={label}
        tabs={items?.map((item, index) => {
          const active = item.path === activePath.path
          return {
            id: `tab-item-${index}`,
            active: active,
            onClick: () => tabChangeHandler(item.path),
            name: formatMessage(item.name),
          }
        })}
      />
      {activePath.path && isMobile && (
        <Box className={styles.select}>
          <Select
            size="xs"
            backgroundColor="blue"
            name={label}
            label={label}
            onChange={(opt) => tabChangeHandler(opt?.value)}
            options={items.map((item) => ({
              label: formatMessage(item.name),
              value: item.path,
            }))}
            defaultValue={{
              value: activePath.path,
              label: formatMessage(activePath.name),
            }}
            isSearchable={false}
          />
        </Box>
      )}
      <Box marginTop={[0, 0, 2, 4, 4]}>
        <GridContainer>
          <GridRow>
            {(!!activePath.description || !!activePath.children?.length) && (
              <GridColumn span="6/8">
                <Box printHidden className={styles.description}>
                  <TabBar
                    label={formatMessage(activePath.name)}
                    variant="alternative"
                    tabs={
                      activePath.children?.map((itemChild, ii) => {
                        const activeChild = itemChild.path
                          ? itemChild?.path === pathname
                          : false

                        return {
                          id: `subnav-item-${ii}`,
                          active: activeChild,
                          onClick: () => tabChangeHandler(itemChild.path),
                          name: formatMessage(itemChild.name),
                        }
                      }) ?? []
                    }
                  />
                  {activePath.children && activePath.name && isMobile && (
                    <Box className={styles.select}>
                      <Select
                        size="sm"
                        name={formatMessage(activePath.name)}
                        label={formatMessage(activePath.name)}
                        onChange={(opt) => tabChangeHandler(opt?.value)}
                        options={activePath.children.map((itemChild) => ({
                          label: formatMessage(itemChild.name),
                          value: itemChild.path,
                        }))}
                        defaultValue={{
                          label: formatMessage(activePath.children[0].name),
                          value: activePath.children[0].path,
                        }}
                        isSearchable={false}
                      />
                    </Box>
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
            {activePath?.displayServiceProviderLogo &&
              serviceProvider &&
              !isMobile && (
                <TabNavigationInstitutionPanel
                  serviceProvider={serviceProvider}
                  tooltipText={tooltipText}
                />
              )}
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}
