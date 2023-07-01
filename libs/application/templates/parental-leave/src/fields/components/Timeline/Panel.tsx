import React, { FC } from 'react'
import parseISO from 'date-fns/parseISO'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { parentalLeaveFormMessages } from '../../../lib/messages'
import { TimelinePeriod } from './Timeline'
import * as styles from './Panel.css'

export const Panel: FC<
  React.PropsWithChildren<{
    editable: boolean
    initDate: Date
    title: string
    titleSmall: string
    periods: TimelinePeriod[]
    isMobile: boolean
    onDeletePeriod?: (startDate: string) => void
  }>
> = ({
  editable = true,
  initDate,
  title,
  titleSmall,
  periods,
  isMobile,
  onDeletePeriod,
}) => {
  const { formatMessage, formatDateFns } = useLocale()
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
            : formatDateFns(initDate, 'dd MMM yyyy')}
        </Text>
        <Box className={styles.firstPanelRowSeparator} />
      </Box>

      {periods.map((p, index) => (
        <Box className={styles.panelRow} key={index}>
          {p.canDelete && editable && onDeletePeriod && (
            <Box
              className={styles.deleteIcon}
              onClick={() => onDeletePeriod(p.startDate)}
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
              : `${formatDateFns(
                  parseISO(p.startDate),
                  formatStyle,
                )} - ${formatDateFns(parseISO(p.endDate), formatStyle)}`}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
