import React, { FC, PropsWithChildren } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  IconMapIcon,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './DefendantInfo.strings'
import { link } from '../../MarkdownWrapper/MarkdownWrapper.css'
import * as styles from './DefendantInfo.css'

export type DefendantInfoActionButton = {
  text: string
  onClick: (defendant: Defendant) => void
  icon?: IconMapIcon
  isDisabled: (defendant: Defendant) => boolean
}

interface DefendantInfoProps {
  defendant: Defendant
  defendantInfoActionButton?: DefendantInfoActionButton
}

export const DefendantInfo: FC<PropsWithChildren<DefendantInfoProps>> = (
  props,
) => {
  const { defendant, defendantInfoActionButton } = props
  const { formatMessage } = useIntl()

  const getAppealExpirationInfo = (viewDate?: string) => {
    if (!viewDate) {
      return formatMessage(strings.appealDateNotBegun)
    }

    const today = new Date()
    const expiryDate = new Date(viewDate)
    expiryDate.setDate(expiryDate.getDate() + 28)

    const message =
      today < expiryDate
        ? strings.appealExpirationDate
        : strings.appealDateExpired

    return formatMessage(message, {
      appealExpirationDate: formatDate(expiryDate, 'P'),
    })
  }

  return (
    <div
      key={defendant.id}
      className={
        defendantInfoActionButton
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
            <Text
              as="span"
              fontWeight="light"
            >{`, (${defendant.citizenship})`}</Text>
          )}
          {defendant.address && (
            <Text as="span" fontWeight="light">{`, ${defendant.address}`}</Text>
          )}
        </span>

        <div>
          <Text as="span">
            {getAppealExpirationInfo(defendant.verdictViewDate ?? '')}
          </Text>
        </div>

        {defendant.defenderName && (
          <Text as="span">
            <Box
              display="flex"
              key={defendant.defenderName}
              role="paragraph"
              marginBottom={1}
            >
              <Text as="span">{`${formatMessage(strings.defender)}: ${
                defendant.defenderName
              }`}</Text>
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

      {defendantInfoActionButton && (
        <Box>
          <Button
            variant="text"
            size="medium"
            onClick={() => defendantInfoActionButton.onClick(defendant)}
            icon={defendantInfoActionButton.icon}
            iconType="outline"
            disabled={defendantInfoActionButton.isDisabled(defendant)}
          >
            {defendantInfoActionButton.text}
          </Button>
        </Box>
      )}
    </div>
  )
}
