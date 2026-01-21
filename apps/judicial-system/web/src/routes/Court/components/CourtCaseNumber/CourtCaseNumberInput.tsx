import { FC, useContext, useState } from 'react'
import { useDebounce } from 'react-use'

import { Button, Input } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  BlueBox,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

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

  const [value, setValue] = useState<string>(courtCaseNumber ?? '')
  const [courtCaseNumberErrorMessage, setCourtCaseNumberErrorMessage] =
    useState<string>('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] =
    useState<boolean>(false)

  const placeholder = isIndictmentCase ? 'S-case-number' : 'R-case-number'

  const handleCreateCourtCase = async () => {
    const courtCaseNumber = await createCourtCase(caseId)

    setCourtCaseNumber(courtCaseNumber)

    if (courtCaseNumber !== '') {
      setCourtCaseNumberErrorMessage('')
      setValue(courtCaseNumber)
      setCreateCourtCaseSuccess(true)
    } else {
      setCourtCaseNumberErrorMessage(
        'Ekki tókst að stofna nýtt mál, reyndu aftur eða sláðu inn málsnúmer',
      )
    }
  }

  const updateCourtCaseNumber = async () => {
    const isValid = validate([[value, ['empty', placeholder]]]).isValid

    if (!isValid) {
      return
    }

    updateCase(caseId, { courtCaseNumber: value })
    setCourtCaseNumber(value)
  }

  const validateInput = (inputValue: string) => {
    const validation = validate([[inputValue, ['empty', placeholder]]])

    setCourtCaseNumberErrorMessage(
      validation.isValid ? '' : validation.errorMessage,
    )
  }

  useDebounce(updateCourtCaseNumber, 500, [value])

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
          placeholder={placeholder}
          autoComplete="off"
          size="sm"
          backgroundColor="white"
          value={value}
          icon={
            courtCaseNumber && createCourtCaseSuccess
              ? { name: 'checkmark' }
              : undefined
          }
          errorMessage={courtCaseNumberErrorMessage}
          hasError={!isCreatingCourtCase && courtCaseNumberErrorMessage !== ''}
          onChange={(evt) => {
            setCourtCaseNumberErrorMessage('')
            setCreateCourtCaseSuccess(false)
            setValue(evt.target.value)
            setCourtCaseNumber(evt.target.value)
          }}
          onBlur={(evt) => validateInput(evt.target.value)}
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
