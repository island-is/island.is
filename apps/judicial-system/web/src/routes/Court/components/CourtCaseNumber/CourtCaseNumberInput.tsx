import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Input } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  UpdateCase,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { courtCaseNumber } from './CourtCaseNumber.strings'
import * as styles from './CourtCaseNumber.css'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const CourtCaseNumberInput: FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props

  const { formatMessage } = useIntl()
  const { updateCase, createCourtCase, isCreatingCourtCase } = useCase()
  const [courtCaseNumberErrorMessage, setCourtCaseNumberErrorMessage] =
    useState('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] =
    useState<boolean>(false)

  const handleCreateCourtCase = async (workingCase: Case) => {
    const courtCaseNumber = await createCourtCase(workingCase, setWorkingCase)

    if (courtCaseNumber !== '') {
      setCourtCaseNumberErrorMessage('')
      setCreateCourtCaseSuccess(true)
    } else {
      setCourtCaseNumberErrorMessage(
        'Ekki tókst að stofna nýtt mál, reyndu aftur eða sláðu inn málsnúmer',
      )
    }
  }

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
                  workingCase.state !== CaseState.WAITING_FOR_CANCELLATION &&
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
              errorMessage={courtCaseNumberErrorMessage}
              hasError={
                !isCreatingCourtCase && courtCaseNumberErrorMessage !== ''
              }
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
                  setWorkingCase,
                  courtCaseNumberErrorMessage,
                  setCourtCaseNumberErrorMessage,
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
                  setCourtCaseNumberErrorMessage,
                )
              }}
              disabled={
                workingCase.state !== CaseState.SUBMITTED &&
                workingCase.state !== CaseState.WAITING_FOR_CANCELLATION &&
                workingCase.state !== CaseState.RECEIVED
              }
              required
            />
          </div>
        </Box>
      </div>
    </BlueBox>
  )
}

export default CourtCaseNumberInput
