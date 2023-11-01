import React from 'react'
import { PortalNavigationItem } from '@island.is/portals/core'
import { Box, Button, FocusableBox, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { SubTabItem } from './SubTabItem'
import * as styles from './TabNavigation.css'

interface Props {
  pathname?: string
  label: string
  items: PortalNavigationItem[]
}

export const TabNavigation: React.FC<Props> = ({ items, pathname, label }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { width } = useWindowSize()

  const tabChangeHandler = (id?: string) => {
    if (id && id !== pathname) {
      navigate(id)
    }
  }

  const isMobile = width < theme.breakpoints.md
  const activeItem = items.filter((item) => item.active)?.[0]
  return (
    <>
      <Box className={styles.tabList}>
        {items?.map((item, index) => (
          <>
            <FocusableBox
              component={Button}
              type="button"
              key={index}
              id={item.path}
              justifyContent="center"
              aria-label={formatMessage(item.name)}
              className={cn(styles.tab, {
                [styles.tabSelected]: item.active,
              })}
              onClick={
                item.path ? () => tabChangeHandler(item.path) : undefined
              }
            >
              {formatMessage(item.name)}
            </FocusableBox>
          </>
        ))}
      </Box>
      {activeItem && activeItem.path && isMobile && (
        <Box className={styles.select}>
          <Select
            size="sm"
            name={label}
            label={label}
            onChange={(opt) => {
              opt ? tabChangeHandler(opt.value) : undefined
            }}
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
      {activeItem && activeItem?.children && activeItem.children.length > 0 ? (
        <Box
          display="flex"
          flexDirection="row"
          marginTop={5}
          marginBottom={[2, 1, 0]}
        >
          <SubTabItem
            colorScheme={
              activeItem.children.filter((item) => item.active).length === 0
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
          {activeItem.children?.map((itemChild, ii) => (
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
