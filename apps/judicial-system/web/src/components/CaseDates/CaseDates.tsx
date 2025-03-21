import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { caseDates } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import * as styles from './CaseDates.css'

export interface Props {
  workingCase: Case
  button?: {
    label: string
    onClick: () => void
    icon: IconMapIcon
  }
}

const CaseDates: FC<Props> = (props) => {
  const { workingCase, button } = props
  const { formatMessage } = useIntl()

  const isTravelBan =
    workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
    workingCase.type === CaseType.TRAVEL_BAN

  return (
    <Box data-testid="caseDates">
      <div className={styles.caseDateContainer}>
        {workingCase.isValidToDateInThePast ? (
          <Text variant="h5">
            {formatMessage(caseDates.restrictionExpired, {
              caseType: isTravelBan ? CaseType.TRAVEL_BAN : workingCase.type,
              date: `${formatDate(
                workingCase.validToDate,
                'PPP',
              )} kl. ${formatDate(workingCase.validToDate, TIME_FORMAT)}`,
            })}
          </Text>
        ) : (
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
          >
            <Box>
              <Text variant="h5">
                {formatMessage(caseDates.restrictionValidTo, {
                  caseType: isTravelBan
                    ? CaseType.TRAVEL_BAN
                    : workingCase.type,
                  date: `${formatDate(
                    workingCase.validToDate,
                    'PPP',
                  )} kl. ${formatDate(workingCase.validToDate, TIME_FORMAT)}`,
                })}
              </Text>
              {workingCase.isCustodyIsolation && workingCase.isolationToDate && (
                <Text variant="h5" as="h5">
                  {formatMessage(caseDates.isolationValidTo, {
                    date: `${formatDate(
                      workingCase.isolationToDate,
                      'PPP',
                    )} kl. ${formatDate(
                      workingCase.isolationToDate,
                      TIME_FORMAT,
                    )}`,
                  })}
                </Text>
              )}
            </Box>
            <Box>
              {button && (
                <Button
                  size="small"
                  variant="text"
                  onClick={button.onClick}
                  icon={button.icon}
                >
                  {button.label}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </div>
    </Box>
  )
}

export default CaseDates
