import React from 'react'

import {
  Case,
  CaseState,
  CaseDecision,
  CaseType,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'

import * as styles from './CaseDates.css'

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

  const isTravelBan =
    workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
    workingCase.type === CaseType.TRAVEL_BAN

  return (
    <Box>
      {workingCase.state === CaseState.ACCEPTED &&
        isRestrictionCase(workingCase.type) && (
          <div className={styles.caseDateContainer}>
            {workingCase.isValidToDateInThePast ? (
              <Text variant="h5">
                {`${isTravelBan ? 'Farbann' : 'Gæsla'} rann út ${formatDate(
                  workingCase.validToDate,
                  'PPP',
                )} kl. ${formatDate(workingCase.validToDate, TIME_FORMAT)}`}
              </Text>
            ) : (
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexEnd"
              >
                <Box>
                  <Text variant="h5">
                    {`${isTravelBan ? 'Farbann' : 'Gæsla'} til ${formatDate(
                      workingCase.validToDate,
                      'PPP',
                    )} kl. ${formatDate(workingCase.validToDate, TIME_FORMAT)}`}
                  </Text>
                  {workingCase.type === CaseType.CUSTODY &&
                    workingCase.isCustodyIsolation &&
                    workingCase.isolationToDate && (
                      <Text variant="h5" as="h5">
                        {`Einangrun til ${formatDate(
                          workingCase.isolationToDate,
                          'PPP',
                        )} kl. ${formatDate(
                          workingCase.isolationToDate,
                          TIME_FORMAT,
                        )}`}
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
        )}
    </Box>
  )
}

export default CaseDates
