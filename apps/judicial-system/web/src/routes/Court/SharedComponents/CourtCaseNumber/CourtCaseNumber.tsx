import React from 'react'
import { useIntl } from 'react-intl'
import { Case, IntegratedCourts } from '@island.is/judicial-system/types'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { BlueBox } from '@island.is/judicial-system-web/src/shared-components'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { courtCaseNumber } from '@island.is/judicial-system-web/messages'
import * as styles from './CourtCaseNumber.treat'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  handleCreateCourtCase: (wc: Case) => void
  isCreatingCourtCase: boolean
}

const CourtCaseNumber: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    courtCaseNumberEM,
    setCourtCaseNumberEM,
    createCourtCaseSuccess,
    setCreateCourtCaseSuccess,
    handleCreateCourtCase,
    isCreatingCourtCase,
  } = props
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={2}>
        <Text as="h2" variant="h3">
          {formatMessage(courtCaseNumber.title)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>{formatMessage(courtCaseNumber.explanation)}</Text>
      </Box>
      <BlueBox>
        <div className={styles.createCourtCaseContainer}>
          <Box display="flex">
            {workingCase.court &&
              IntegratedCourts.includes(workingCase.court.id) && (
                <div className={styles.createCourtCaseButton}>
                  <Button
                    size="small"
                    onClick={() => handleCreateCourtCase(workingCase)}
                    loading={isCreatingCourtCase}
                    disabled={Boolean(workingCase.courtCaseNumber)}
                    fluid
                  >
                    Stofna nýtt mál
                  </Button>
                </div>
              )}
            <div className={styles.createCourtCaseInput}>
              <Input
                data-testid="courtCaseNumber"
                name="courtCaseNumber"
                label="Mál nr."
                placeholder="R-X/ÁÁÁÁ"
                size="sm"
                backgroundColor="white"
                value={workingCase.courtCaseNumber ?? ''}
                icon={
                  workingCase.courtCaseNumber && createCourtCaseSuccess
                    ? 'checkmark'
                    : undefined
                }
                errorMessage={courtCaseNumberEM}
                hasError={!isCreatingCourtCase && courtCaseNumberEM !== ''}
                onChange={(event) => {
                  setCreateCourtCaseSuccess(false)
                  removeTabsValidateAndSet(
                    'courtCaseNumber',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    courtCaseNumberEM,
                    setCourtCaseNumberEM,
                  )
                }}
                onBlur={(event) => {
                  validateAndSendToServer(
                    'courtCaseNumber',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setCourtCaseNumberEM,
                  )
                }}
                required
              />
            </div>
          </Box>
        </div>
      </BlueBox>
    </>
  )
}

export default CourtCaseNumber
