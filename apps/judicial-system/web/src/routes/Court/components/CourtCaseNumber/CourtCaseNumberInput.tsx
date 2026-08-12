import { FC, useContext, useEffect, useRef, useState } from 'react'

import { Button, Input } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  BlueBox,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDebouncedField,
} from '@island.is/judicial-system-web/src/utils/hooks'

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

  const [createCourtCaseErrorMessage, setCreateCourtCaseErrorMessage] =
    useState<string>('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] =
    useState<boolean>(false)
  // Bumped whenever the button above creates a court case number for us. That
  // number replaces whatever the user may have typed, so the debounced field
  // has to re-adopt it rather than treat it as a server echo of its own edit.
  const [createCourtCaseCount, setCreateCourtCaseCount] = useState(0)

  // The number we know the server already has. `courtCaseNumber` can't be used
  // for this — it is the optimistic working case value, which every keystroke
  // updates.
  const persistedCourtCaseNumber = useRef(courtCaseNumber ?? '')
  const hasEditedCourtCaseNumber = useRef(false)

  // FormProvider renders its children while the case is still being fetched,
  // so the first render can see no court case number at all. Keep adopting the
  // incoming one until the user types, otherwise the unchanged-value check
  // below compares against a stale empty string and re-sends a number the
  // server already has.
  useEffect(() => {
    if (!hasEditedCourtCaseNumber.current) {
      persistedCourtCaseNumber.current = courtCaseNumber ?? ''
    }
  }, [courtCaseNumber])

  const policeCaseNumberValidator = isIndictmentCase
    ? 'S-case-number'
    : 'R-case-number'

  // The backend treats any update carrying a court case number on a submitted
  // case as receiving the case, and a changed number resets case file states.
  // So only persist a valid number, and only when it differs from what the
  // server already has.
  const courtCaseNumberField = useDebouncedField({
    value: courtCaseNumber,
    resetKey: String(createCourtCaseCount),
    validations: ['empty', policeCaseNumberValidator],
    disabled: isDisabled,
    onChange: (value) => {
      hasEditedCourtCaseNumber.current = true
      setCreateCourtCaseErrorMessage('')
      setCreateCourtCaseSuccess(false)
      setCourtCaseNumber(value)
    },
    onSave: (value) => {
      if (value === persistedCourtCaseNumber.current) {
        return
      }

      persistedCourtCaseNumber.current = value
      updateCase(caseId, { courtCaseNumber: value })
    },
  })

  const handleCreateCourtCase = async () => {
    const createdCourtCaseNumber = await createCourtCase(caseId)

    setCourtCaseNumber(createdCourtCaseNumber)

    if (createdCourtCaseNumber !== '') {
      persistedCourtCaseNumber.current = createdCourtCaseNumber
      setCreateCourtCaseErrorMessage('')
      setCreateCourtCaseCount((count) => count + 1)
      setCreateCourtCaseSuccess(true)
    } else {
      setCreateCourtCaseErrorMessage(
        'Ekki tókst að stofna nýtt mál, reyndu aftur eða sláðu inn málsnúmer',
      )
    }
  }

  const errorMessage =
    createCourtCaseErrorMessage || courtCaseNumberField.errorMessage

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
          value={courtCaseNumberField.value}
          icon={
            courtCaseNumber && createCourtCaseSuccess
              ? { name: 'checkmark' }
              : undefined
          }
          errorMessage={errorMessage}
          hasError={!isCreatingCourtCase && errorMessage !== ''}
          onChange={(evt) => courtCaseNumberField.onChange(evt.target.value)}
          onBlur={() => courtCaseNumberField.onBlur()}
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
