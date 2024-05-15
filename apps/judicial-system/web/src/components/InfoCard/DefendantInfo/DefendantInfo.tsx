import React, { FC } from 'react'

import { IconMapIcon } from '@island.is/island-ui/core'
import { Box, Button, LinkV2, Text } from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import { link } from '../../MarkdownWrapper/MarkdownWrapper.css'
import * as styles from '../InfoCard.css'

export type DefendantActionButton = {
  text: string
  onClick: () => void
  icon?: IconMapIcon
}
interface DefendantInfoProps {
  defendant: Defendant
  displayDefenderInfo: boolean
  defendantActionButton?: DefendantActionButton
}

export const DefendantInfo: FC<DefendantInfoProps> = ({
  defendant,
  displayDefenderInfo,
  defendantActionButton,
}) => {
  return (
    <div key={defendant.id}>
      <span className={styles.infoCardDefendant}>
        <Text as="span" fontWeight="semiBold">{`${defendant.name}`}</Text>
        {defendant.nationalId && (
          <Text as="span" fontWeight="semiBold">
            {`, ${formatDOB(defendant.nationalId, defendant.noNationalId)}`}
          </Text>
        )}
        {defendant.citizenship && <span>{`, (${defendant.citizenship})`}</span>}
        {defendant.address && <span>{`, ${defendant.address}`}</span>}
      </span>
      <span>
        {defendant.defenderName && displayDefenderInfo && (
          <Text as="span">
            <Box
              display="flex"
              key={defendant.defenderName}
              role="paragraph"
              marginBottom={1}
            >
              <Text as="span">{defendant.defenderName}</Text>
              {defendant.defenderEmail && (
                <Text as="span" whiteSpace="pre">{`, `}</Text>
              )}
              <LinkV2
                href={`mailto:${defendant.defenderEmail}`}
                key={defendant.defenderEmail}
                className={link}
              >
                <Text as="span">{defendant.defenderEmail}</Text>
              </LinkV2>
            </Box>
          </Text>
        )}
      </span>
      {defendantActionButton && (
        <Button
          variant="text"
          size="small"
          onClick={defendantActionButton.onClick}
          icon={defendantActionButton.icon}
          iconType="outline"
        >
          {defendantActionButton.text}
        </Button>
      )}
    </div>
  )
}
