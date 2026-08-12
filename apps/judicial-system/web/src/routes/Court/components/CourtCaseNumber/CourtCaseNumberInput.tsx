import { FC, useContext, useRef, useState } from 'react'

import { Button, Input } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  BlueBox,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'

import * as styles from './CourtCaseNumber.css'

interface Props {
  caseId: string
  isIndictmentCase: boolean
  courtCaseNumber: string | undefined | null
  isDisabled: boolean
  setCourtCaseNumber(courtCaseNumber: string): void
}

export const CourtCaseNumberInput: FC<Props> = (props) => {
  const {
    caseId,
    isIndictmentCase,
    courtCaseNumber,
    isDisabled,
    setCourtCaseNumber,
  } = props

  const { updateCase, createCourtCase, isCreatingCourtCase } = useCase()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] =
    useState<boolean>(false)

  // The value the field held when it last gained focus, so blur can tell
  // whether the user actually changed anything. Assigning a court case number
  // is not an idempotent write: the backend reads an update carrying one on a
  // submitted case as receiving the case, and a changed number resets case file
  // states. Tabbing through the field, or typing and undoing, must send
  // nothing.
  const valueOnFocus = useRef(courtCaseNumber ?? '')

  const validations: Validation[] = [
    'empty',
    isIndictmentCase ? 'S-case-number' : 'R-case-number',
  ]

  const handleChange = (value: string) => {
    setCreateCourtCaseSuccess(false)
    removeErrorMessageIfValid(validations, value, errorMessage, setErrorMessage)
    setCourtCaseNumber(value)
  }

  const handleBlur = (value: string) => {
    const isValid = validateAndSetErrorMessage(
      validations,
      value,
      setErrorMessage,
    )

    if (!isValid || value === valueOnFocus.current) {
      return
    }

    valueOnFocus.current = value
    updateCase(caseId, { courtCaseNumber: value })
  }

  const handleCreateCourtCase = async () => {
    const createdCourtCaseNumber = await createCourtCase(caseId)

    setCourtCaseNumber(createdCourtCaseNumber)

    if (createdCourtCaseNumber !== '') {
      // The server assigned it, so a later blur must not send it back.
      valueOnFocus.current = createdCourtCaseNumber
      setErrorMessage('')
      setCreateCourtCaseSuccess(true)
    } else {
      setErrorMessage(
        'Ekki tókst að stofna nýtt mál, reyndu aftur eða sláðu inn málsnúmer',
      )
    }
  }

  return (
    <BlueBox className={styles.createCourtCaseContainer}>
      <div className={styles.createCourtCaseButton}>
        <Button
          size="small"
          onClick={handleCreateCourtCase}
          loading={isCreatingCourtCase}
          disabled={isDisabled || Boolean(courtCaseNumber)}
          fluid
        >
          Stofna nýtt mál
        </Button>
      </div>
      <div className={styles.createCourtCaseInput}>
        <Input
          data-testid="courtCaseNumber"
          name="courtCaseNumber"
          label="Mál nr."
          placeholder={`${
            isIndictmentCase ? 'S' : 'R'
          }-X/${new Date().getFullYear()}`}
          autoComplete="off"
          size="sm"
          backgroundColor="white"
          value={courtCaseNumber ?? ''}
          icon={
            courtCaseNumber && createCourtCaseSuccess
              ? { name: 'checkmark' }
              : undefined
          }
          errorMessage={errorMessage}
          hasError={!isCreatingCourtCase && errorMessage !== ''}
          onFocus={(evt) => {
            valueOnFocus.current = evt.target.value
          }}
          onChange={(evt) => handleChange(evt.target.value)}
          onBlur={(evt) => handleBlur(evt.target.value)}
          disabled={isDisabled}
          required
        />
      </div>
    </BlueBox>
  )
}

const CourtCaseNumberCurrentCaseInput: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const setCourtCaseNumber = (courtCaseNumber: string) => {
    setWorkingCase?.((prevWorkingCase) => ({
      ...prevWorkingCase,
      courtCaseNumber,
    }))
  }

  return (
    <CourtCaseNumberInput
      caseId={workingCase.id}
      isIndictmentCase={isIndictmentCase(workingCase.type)}
      courtCaseNumber={workingCase.courtCaseNumber}
      isDisabled={
        workingCase.state !== CaseState.SUBMITTED &&
        workingCase.state !== CaseState.WAITING_FOR_CANCELLATION &&
        workingCase.state !== CaseState.RECEIVED
      }
      setCourtCaseNumber={setCourtCaseNumber}
    />
  )
}

export default CourtCaseNumberCurrentCaseInput
