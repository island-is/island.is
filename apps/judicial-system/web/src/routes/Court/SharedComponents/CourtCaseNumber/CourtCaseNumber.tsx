import React from 'react'
import { useIntl } from 'react-intl'
import { IntegratedCourts } from '@island.is/judicial-system/consts'
import { CaseState } from '@island.is/judicial-system/types'
import type { Case, UpdateCase } from '@island.is/judicial-system/types'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { courtCaseNumber } from '@island.is/judicial-system-web/messages'
import * as styles from './CourtCaseNumber.css'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  handleCreateCourtCase: (wc: Case) => void
  isCreatingCourtCase: boolean
  receiveCase: (wc: Case, courtCaseNumber: string) => void
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
    receiveCase,
  } = props
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  const updateAndReceiveCase = async (id: string, update: UpdateCase) => {
    await updateCase(id, update)
    if (update.courtCaseNumber) {
      receiveCase(workingCase, update.courtCaseNumber)
    }
  }

  return (
    <>
      <Box marginBottom={2}>
        <Text as="h2" variant="h3">
          {formatMessage(courtCaseNumber.title)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>
          {workingCase.state !== CaseState.SUBMITTED &&
          workingCase.state !== CaseState.RECEIVED
            ? formatMessage(courtCaseNumber.explanationDisabled)
            : formatMessage(courtCaseNumber.explanation)}
        </Text>
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
                    disabled={Boolean(
                      (workingCase.state !== CaseState.SUBMITTED &&
                        workingCase.state !== CaseState.RECEIVED) ||
                        workingCase.courtCaseNumber,
                    )}
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
                autoComplete="off"
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
                    updateAndReceiveCase,
                    setCourtCaseNumberEM,
                  )
                }}
                disabled={
                  workingCase.state !== CaseState.SUBMITTED &&
                  workingCase.state !== CaseState.RECEIVED
                }
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
