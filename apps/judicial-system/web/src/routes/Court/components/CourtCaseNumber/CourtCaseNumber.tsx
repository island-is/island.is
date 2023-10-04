import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { CaseState, isIndictmentCase } from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import {
  TempCase as Case,
  TempUpdateCase as UpdateCase,
} from '@island.is/judicial-system-web/src/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { courtCaseNumber } from './CourtCaseNumber.strings'
import * as styles from './CourtCaseNumber.css'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  handleCreateCourtCase: (wc: Case) => void
  isCreatingCourtCase: boolean
}

const CourtCaseNumber: React.FC<React.PropsWithChildren<Props>> = (props) => {
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

  const updateCourtCaseNumber = async (id: string, update: UpdateCase) => {
    const isValid = validate([
      [
        update.courtCaseNumber,
        [
          'empty',
          isIndictmentCase(workingCase.type)
            ? 'S-case-number'
            : 'R-case-number',
        ],
      ],
    ]).isValid

    if (!isValid) {
      return
    }

    await updateCase(id, update)
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
                {formatMessage(courtCaseNumber.createCaseButtonText)}
              </Button>
            </div>
            <div className={styles.createCourtCaseInput}>
              <Input
                data-testid="courtCaseNumber"
                name="courtCaseNumber"
                label={formatMessage(courtCaseNumber.label)}
                placeholder={formatMessage(courtCaseNumber.placeholder, {
                  isIndictment: isIndictmentCase(workingCase.type),
                  year: new Date().getFullYear(),
                })}
                autoComplete="off"
                size="sm"
                backgroundColor="white"
                value={workingCase.courtCaseNumber ?? ''}
                icon={
                  workingCase.courtCaseNumber && createCourtCaseSuccess
                    ? { name: 'checkmark' }
                    : undefined
                }
                errorMessage={courtCaseNumberEM}
                hasError={!isCreatingCourtCase && courtCaseNumberEM !== ''}
                onChange={(event) => {
                  setCreateCourtCaseSuccess(false)
                  removeTabsValidateAndSet(
                    'courtCaseNumber',
                    event.target.value,
                    [
                      'empty',
                      isIndictmentCase(workingCase.type)
                        ? 'S-case-number'
                        : 'R-case-number',
                    ],
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
                    [
                      'empty',
                      isIndictmentCase(workingCase.type)
                        ? 'S-case-number'
                        : 'R-case-number',
                    ],
                    workingCase,
                    updateCourtCaseNumber,
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
