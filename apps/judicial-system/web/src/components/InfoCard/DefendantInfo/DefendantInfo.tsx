import React, { FC } from 'react'

import {
  Box,
  Button,
  IconMapIcon,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import { link } from '../../MarkdownWrapper/MarkdownWrapper.css'
import * as styles from './DefendantInfo.css'

export type DefendantActionButton = {
  text: string
  onClick: (defendant: Defendant) => void
  icon?: IconMapIcon
  isDisabled: (defendant: Defendant) => boolean
}

interface DefendantInfoProps {
  defendant: Defendant
  displayDefenderInfo: boolean
  defendantActionButton?: DefendantActionButton
}

export const DefendantInfo: FC<DefendantInfoProps> = (props) => {
  const { defendant, displayDefenderInfo, defendantActionButton } = props

  return (
    <div
      key={defendant.id}
      className={
        defendantActionButton
          ? styles.gridRow.withButton
          : styles.gridRow.withoutButton
      }
    >
      <div className={styles.infoCardDefendant}>
        <span>
          <Text as="span" fontWeight="semiBold">
            {defendant.name}
          </Text>
          {defendant.nationalId && (
            <Text as="span" fontWeight="semiBold">
              {`, ${formatDOB(defendant.nationalId, defendant.noNationalId)}`}
            </Text>
          )}
          {defendant.citizenship && (
            <span>{`, (${defendant.citizenship})`}</span>
          )}
          {defendant.address && <span>{`, ${defendant.address}`}</span>}
        </span>

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
      </div>

      {defendantActionButton && (
        <Box>
          <Button
            variant="text"
            size="small"
            onClick={() => defendantActionButton.onClick(defendant)}
            icon={defendantActionButton.icon}
            iconType="outline"
            disabled={defendantActionButton.isDisabled(defendant)}
          >
            {defendantActionButton.text}
          </Button>
        </Box>
      )}
    </div>
  )
}
