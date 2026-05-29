import {
  Box,
  DropdownMenu,
  Icon,
  IconProps,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Colors } from '@island.is/island-ui/theme'
import { MessageDescriptor } from 'react-intl'

import * as styles from './TableActionMenu.css'

export type TableMenuAction = {
  show?: boolean
  title: MessageDescriptor
  icon: IconProps['icon']
  color?: Colors
  onClick: () => void
}

export const buildTableMenuItems = (
  formatMessage: (descriptor: MessageDescriptor) => string,
  actions: TableMenuAction[],
) =>
  actions
    .filter(({ show = true }) => show)
    .map(({ title, icon, color, onClick }) => ({
      title: formatMessage(title),
      noStyle: true,
      render: () => (
        <TableMenuItem
          title={formatMessage(title)}
          icon={icon}
          color={color}
          onClick={onClick}
        />
      ),
    }))

export const TableActionMenu = ({
  actions,
}: {
  actions: TableMenuAction[]
}) => {
  const { formatMessage } = useLocale()
  const items = buildTableMenuItems(formatMessage, actions)

  if (items.length === 0) {
    return null
  }

  return (
    <DropdownMenu
      disclosure={
        <button type="button">
          <Icon icon="ellipsisHorizontal" size="medium" color="blue400" />
        </button>
      }
      items={items}
    />
  )
}

const TableMenuItem = ({
  title,
  icon,
  color,
  onClick,
}: {
  title: string
  icon: IconProps['icon']
  color?: Colors
  onClick: () => void
}) => (
  <Box
    as="button"
    columnGap={1}
    paddingY={2}
    onClick={onClick}
    className={styles.menuItem}
  >
    <Text
      color={color ?? 'currentColor'}
      fontWeight="semiBold"
      variant="small"
      lineHeight="xs"
    >
      {title}
    </Text>
    <Icon icon={icon} type="outline" color={color ?? 'blue400'} size="small" />
  </Box>
)
