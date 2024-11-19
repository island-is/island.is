import {
  Button,
  Table as T,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { ExpandRow } from '../ExpandableTable'
import { SortableData } from './types'

export const TableRow = ({
  item,
  headerSorted,
  labels,
  tagOutlined,
  expandable,
}: {
  item: SortableData
  headerSorted: string[]
  labels: Record<string, string>
  tagOutlined?: boolean
  expandable?: boolean
}) => {
  const { id, name, tag, lastNode, children, ...itemObject } = item
  const valueItems = Object.values(itemObject)

  const renderValueItem = (valueItem: any, i: number) => {
    if (tag && valueItems.length - 1 === i) {
      return (
        <Tag variant={tag} outlined={tagOutlined}>
          {valueItem}
        </Tag>
      )
    }
    if (valueItems.length - 1 === i && lastNode) {
      if (lastNode.type === 'info') {
        return <Tooltip text={lastNode.label} />
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
      <Text variant="medium" as="span">
        {valueItem}
      </Text>
    )
  }

  return expandable ? (
    <ExpandRow
      key={id}
      data={valueItems.map((valueItem, i) => ({
        value: renderValueItem(valueItem, i),
        align: valueItems.slice(-2).includes(valueItem) ? 'right' : 'left',
      }))}
    >
      {children}
    </ExpandRow>
  ) : (
    <T.Row key={id}>
      <T.Data>
        <Text variant="medium" as="span">
          {name}
        </Text>
      </T.Data>
      {valueItems.map((valueItem, i) => (
        <T.Data key={`body-${id}-${i}`}>{renderValueItem(valueItem, i)}</T.Data>
      ))}
    </T.Row>
  )
}
