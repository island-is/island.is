import React, { FC } from 'react'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { parentalLeaveFormMessages } from '../../../lib/messages'
import { TimelinePeriod } from './Timeline'
import * as styles from './Panel.treat'

export const Panel: FC<{
  editable: boolean
  initDate: Date
  title: string
  titleSmall: string
  periods: TimelinePeriod[]
  isMobile: boolean
  onDeletePeriod?: (index: number) => void
}> = ({
  editable = true,
  initDate,
  title,
  titleSmall,
  periods,
  isMobile,
  onDeletePeriod,
}) => {
  const { formatMessage } = useLocale()
  const formatStyle = isMobile ? 'dd MMM' : 'dd MMM yyyy'
  const titleLabel = isMobile ? titleSmall : title
  const firstPeriodUsingActualDateOfBirth = periods?.[0]?.actualDob

  return (
    <Box className={styles.panel}>
      <Box className={styles.panelRow}>
        <Text variant="small">
          <Text variant="small" as="span" fontWeight="semiBold" color="blue400">
            {titleLabel}
          </Text>

          <br />

          {firstPeriodUsingActualDateOfBirth
            ? ''
            : format(initDate, 'dd MMM yyyy')}
        </Text>
        <Box className={styles.firstPanelRowSeparator} />
      </Box>

      {periods.map((p, index) => (
        <Box className={styles.panelRow} key={index}>
          {p.canDelete && editable && onDeletePeriod && (
            <Box
              className={styles.deleteIcon}
              onClick={() => onDeletePeriod(p.rawIndex)}
            >
              <Icon
                color="dark200"
                icon="removeCircle"
                size="medium"
                type="outline"
              />
            </Box>
          )}

          <Text variant="small">
            <Text variant="small" as="span" fontWeight="semiBold">
              {p.title}
            </Text>

            <br />

            {p.actualDob
              ? formatMessage(
                  parentalLeaveFormMessages.reviewScreen.periodActualDob,
                  {
                    duration: p.duration,
                  },
                )
              : `${format(parseISO(p.startDate), formatStyle)} - ${format(
                  parseISO(p.endDate),
                  formatStyle,
                )}`}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
