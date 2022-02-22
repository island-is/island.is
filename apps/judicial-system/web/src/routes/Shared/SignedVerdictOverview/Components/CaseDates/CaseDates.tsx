import React from 'react'

import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'

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
      <Box marginBottom={3}>
        <Text variant="h5" as="h5">
          {`Úrskurðað ${formatDate(
            workingCase.courtEndTime,
            'PPP',
          )} kl. ${formatDate(workingCase.courtEndTime, TIME_FORMAT)}`}
        </Text>
      </Box>
      <div className={styles.caseDateContainer}>
        {workingCase.isValidToDateInThePast ? (
          <Text variant="h5" as="h5">
            {`${
              isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
            } rann út ${formatDate(
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
              <Text variant="h5" as="h5">
                {`${
                  isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
                } til ${formatDate(
                  workingCase.validToDate,
                  'PPP',
                )} kl. ${formatDate(workingCase.validToDate, TIME_FORMAT)}`}
              </Text>
              {workingCase.isCustodyIsolation && workingCase.isolationToDate && (
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
    </Box>
  )
}

export default CaseDates
