import React from 'react'

import {
  Case,
  CaseDecision,
  CaseType,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
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
    <Text variant="h5" as="h5">
      <div className={styles.caseDateContainer}>
        {workingCase.decision === CaseDecision.REJECTING ||
        workingCase.decision === CaseDecision.DISMISSING ||
        isInvestigationCase(workingCase.type) ? (
          `Úrskurðað ${formatDate(
            workingCase.courtEndTime,
            'PPP',
          )} kl. ${formatDate(workingCase.courtEndTime, TIME_FORMAT)}`
        ) : workingCase.isValidToDateInThePast ? (
          <>
            <Box component="span" display="block">
              {`Úrskurðað ${formatDate(
                workingCase.rulingDate,
                'PPP',
              )} kl. ${formatDate(workingCase.rulingDate, TIME_FORMAT)}`}
            </Box>
            <Box component="span">
              {`${
                isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
              } rann út ${formatDate(
                workingCase.validToDate,
                'PPP',
              )} kl. ${formatDate(workingCase.validToDate, TIME_FORMAT)}`}
            </Box>
          </>
        ) : (
          <>
            <Box component="span" display="block">
              {`Úrskurðað ${formatDate(
                workingCase.rulingDate,
                'PPP',
              )} kl. ${formatDate(workingCase.rulingDate, TIME_FORMAT)}`}
            </Box>
            <Box
              component="span"
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              {`${
                isTravelBan ? 'Farbann' : 'Gæsla' // ACCEPTING
              } til ${formatDate(
                workingCase.validToDate,
                'PPP',
              )} kl. ${formatDate(workingCase.validToDate, TIME_FORMAT)}`}
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
          </>
        )}
      </div>
    </Text>
  )
}

export default CaseDates
