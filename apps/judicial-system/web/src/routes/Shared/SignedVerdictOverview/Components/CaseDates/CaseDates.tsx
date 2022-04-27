import React from 'react'

import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'

import * as styles from './CaseDates.css'
import { useIntl } from 'react-intl'

interface Props {
  workingCase: Case
  button?: {
    label: string
    onClick: () => void
    icon: IconMapIcon
  }
}

const CaseDates: React.FC<Props> = (props) => {
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
            {formatMessage(m.sections.caseDates.restrictionExpired, {
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
                {formatMessage(m.sections.caseDates.restrictionValidTo, {
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
                  {formatMessage(m.sections.caseDates.isolationValidTo, {
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
