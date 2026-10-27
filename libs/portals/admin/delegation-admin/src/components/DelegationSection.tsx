import { ReactNode } from 'react'

import { Box, Icon, Stack, Text } from '@island.is/island-ui/core'

import { DelegationView } from '../lib/delegationView'
import { DelegationTable } from './DelegationTable'

interface DelegationSectionProps {
  title: string
  emptyMessage: string
  direction: 'incoming' | 'outgoing'
  delegations: DelegationView[]
  renderRowActions?: (delegation: DelegationView) => ReactNode
}

export const DelegationSection = ({
  title,
  emptyMessage,
  direction,
  delegations,
  renderRowActions,
}: DelegationSectionProps) => {
  const color = direction === 'outgoing' ? 'blue' : 'purple'

  return (
    <Stack space={3}>
      <Box display="flex" columnGap={2} alignItems="center">
        <Box
          borderRadius="large"
          background={`${color}100`}
          padding={1}
          display="flex"
          alignItems="center"
        >
          <Icon
            size="small"
            color={`${color}400`}
            type="outline"
            icon="person"
          />
          <Icon
            size="small"
            color={`${color}400`}
            icon={direction === 'outgoing' ? 'arrowForward' : 'arrowBack'}
          />
        </Box>
        <Text variant="h4" as="h2">
          {title}
        </Text>
      </Box>
      {delegations.length > 0 ? (
        <DelegationTable
          delegations={delegations}
          direction={direction}
          renderRowActions={renderRowActions}
        />
      ) : (
        <Text>{emptyMessage}</Text>
      )}
    </Stack>
  )
}
