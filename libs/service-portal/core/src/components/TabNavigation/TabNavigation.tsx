import { useEffect, useState } from 'react'
import { PortalNavigationItem } from '@island.is/portals/core'
import { Box, FocusableBox, Button, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { SubTabItem } from './SubTabItem'
import * as styles from './TabNavigation.css'
import LinkResolver from '../LinkResolver/LinkResolver'

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

  useEffect(() => {
    const activeItem = items.filter((itm) => itm.active)?.[0] ?? undefined
    setActiveItem(activeItem)
    setActiveItemChildren(
      activeItem?.children?.filter((itm) => itm.active && !itm.navHide),
    )
  }, [items])

  const tabChangeHandler = (id?: string) => {
    if (id && id !== pathname) {
      navigate(id)
    }
  }

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
            className={cn(styles.tab, {
              [styles.tabSelected]: item.active,
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
      {activeItem && activeItemChildren?.length ? (
        <Box
          display="flex"
          flexDirection="row"
          marginTop={5}
          marginBottom={[2, 1, 0]}
        >
          <SubTabItem
            colorScheme={
              activeItemChildren.filter((item) => item.active).length === 0
                ? 'default'
                : 'light'
            }
            title={formatMessage(activeItem.name)}
            onClick={
              activeItem.path
                ? () => tabChangeHandler(activeItem.path)
                : undefined
            }
            marginLeft={0}
          />
          {activeItemChildren?.map((itemChild, ii) => (
            <SubTabItem
              key={`subnav-${ii}`}
              onClick={
                itemChild.path
                  ? () => tabChangeHandler(itemChild.path)
                  : undefined
              }
              title={formatMessage(itemChild.name)}
              colorScheme={
                itemChild.active && activeItem.path !== itemChild.path
                  ? 'default'
                  : 'light'
              }
            />
          ))}
        </Box>
      ) : null}
    </>
  )
}
