import {
  GridColumn,
  GridRow,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import React from 'react'

interface StatusModalItemProps {
  text: string
  tagLabel: string
  tagVariant: TagVariant
}

const StatusModalItem: React.FC<StatusModalItemProps> = ({
  text,
  tagLabel,
  tagVariant,
}) => {
  return (
    <GridRow>
      <GridColumn span={['3/12', '3/12', '3/12', '2/12']}>
        <Tag outlined variant={tagVariant} disabled>
          {tagLabel}
        </Tag>
      </GridColumn>
      <GridColumn span={['9/12', '9/12', '9/12', '10/12']}>
        <Text>{text}</Text>
      </GridColumn>
    </GridRow>
  )
}

export default StatusModalItem
