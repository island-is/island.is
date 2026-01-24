import React from 'react'

import type { IconMapIcon } from '@island.is/island-ui/core'
import { Box, Icon,Text } from '@island.is/island-ui/core'

interface MetaItemProps {
  icon: IconMapIcon
  label: string
  value: string
  size?: 'small' | 'medium'
}

export const DatasetMetaItem: React.FC<MetaItemProps> = ({
  icon,
  label,
  value,
  size = 'medium',
}) => {
  const iconSize = size === 'small' ? 'small' : 'medium'
  const gap = size === 'small' ? '0.5rem' : '0.75rem'
  const textColor = size === 'small' ? 'dark300' : 'dark400'

  return (
    <Box display="flex" alignItems="center" style={{ gap }}>
      <Icon icon={icon} type="outline" color="blue400" size={iconSize} />
      <Text variant="small" color={textColor}>
        {label}: {value}
      </Text>
    </Box>
  )
}

interface DatasetMetaProps {
  lastUpdated: string
  accessLabel: string
  accessValue: string
  formatLabel: string
  format: string
  size?: 'small' | 'medium'
  layout?: 'vertical' | 'horizontal'
}

export const DatasetMeta: React.FC<DatasetMetaProps> = ({
  lastUpdated,
  accessLabel,
  accessValue,
  formatLabel,
  format,
  size = 'medium',
  layout = 'vertical',
}) => {
  const isHorizontal = layout === 'horizontal'
  const gap = isHorizontal ? '2rem' : undefined

  return (
    <Box
      display="flex"
      flexDirection={isHorizontal ? 'row' : 'column'}
      alignItems={isHorizontal ? 'center' : 'flexStart'}
      style={isHorizontal ? { gap } : undefined}
    >
      <Box marginBottom={isHorizontal ? 0 : 1}>
        <DatasetMetaItem
          icon="calendar"
          label={lastUpdated.split(':')[0]}
          value={lastUpdated.split(': ')[1] || lastUpdated}
          size={size}
        />
      </Box>
      <Box marginBottom={isHorizontal ? 0 : 1}>
        <DatasetMetaItem
          icon={isHorizontal ? 'lockOpened' : 'person'}
          label={accessLabel}
          value={accessValue}
          size={size}
        />
      </Box>
      <DatasetMetaItem
        icon="document"
        label={formatLabel}
        value={format}
        size={size}
      />
    </Box>
  )
}

export default DatasetMeta
