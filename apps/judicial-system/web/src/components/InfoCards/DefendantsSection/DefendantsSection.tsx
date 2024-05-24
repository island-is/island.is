// DefendantsSection.tsx
import React, { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  DefendantInfo,
  DefendantInfoActionButton,
} from '../DefendantInfo/DefendantInfo'
import { strings } from './DefendantsSection.strings'

interface DefendantsSectionProps {
  defendants?: Defendant[] | null
  actionButton?: DefendantInfoActionButton
}

export const DefendantsSection: FC<DefendantsSectionProps> = ({
  defendants,
  actionButton,
}) => {
  const { formatMessage } = useIntl()

  const title = defendants
    ? capitalize(
        defendants.length > 1
          ? formatMessage(strings.indictmentDefendants)
          : formatMessage(strings.indictmentDefendant),
      )
    : ''

  return (
    defendants && (
      <Box>
        <Text variant="h4">{title}</Text>
        {defendants.map((defendant) => (
          <DefendantInfo
            key={defendant.id}
            defendant={defendant}
            defendantInfoActionButton={actionButton}
          />
        ))}
      </Box>
    )
  )
}
