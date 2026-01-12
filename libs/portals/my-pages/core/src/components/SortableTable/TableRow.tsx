import {
  Box,
  Button,
  Table as T,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { ExpandRow } from '../ExpandableTable'
import { SortableData } from './types'
import { ellipsis } from '../../utils/utils'

export const TableRow = ({
  item,
  tagOutlined,
  expandable,
  onExpandCallback,
  align,
  ellipsisLength,
}: {
  item: SortableData
  tagOutlined?: boolean
  expandable?: boolean
  align?: 'left' | 'right'
  ellipsisLength?: number
  onExpandCallback?: () => void
}) => {
  const {
    id,
    tag,
    lastNode,
    children,
    subTitleFirstCol,
    onExpandCallback: onExpandCallbackProp,
    ...itemObject
  } = item
  const valueItems = Object.values(itemObject)

  const renderValueItem = (valueItem: any, i: number) => {
    if (tag && valueItems.length - 1 === i) {
      return (
        <Tag variant={tag} outlined={tagOutlined} disabled>
          {valueItem}
        </Tag>
      )
    }
    if (valueItems.length - 1 === i && lastNode) {
      if (lastNode.type === 'info') {
        return (
          <Box display="flex">
            {lastNode.text && <Text variant="medium">{lastNode.text}</Text>}
            <Tooltip text={lastNode.label} />
          </Box>
        )
      } else if (lastNode.type === 'action') {
        return (
          <Button
            variant="text"
            type="button"
            size="small"
            icon={lastNode.icon?.icon}
            iconType={lastNode.icon?.type}
            onClick={lastNode.action}
          >
            {lastNode.label}
          </Button>
        )
      } else {
        return (
          <Text variant="medium" as="span">
            {lastNode.label}
          </Text>
        )
      }
    }
    return (
      <>
        <Text variant="medium" as="span">
          {ellipsisLength && valueItem
            ? ellipsis(valueItem, ellipsisLength)
            : valueItem}
        </Text>
        {i === 0 && subTitleFirstCol && (
          <Text variant="small">{subTitleFirstCol}</Text>
        )}
      </>
    )
  }

  return expandable ? (
    <ExpandRow
      key={id}
      data={valueItems.map((valueItem, i) => ({
        value: renderValueItem(valueItem, i),
        align: i === valueItems.length - 1 ? 'right' : align ?? 'left',
      }))}
      onExpandCallback={onExpandCallback}
    >
      {children}
    </ExpandRow>
  ) : (
    <T.Row key={id}>
      {valueItems.map((valueItem, i) => (
        <T.Data key={`body-${id}-${i}`}>{renderValueItem(valueItem, i)}</T.Data>
      ))}
    </T.Row>
  )
}
