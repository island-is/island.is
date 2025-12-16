import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'

import { Button, Input } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UpdateCase,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { courtCaseNumber } from './CourtCaseNumber.strings'
import * as styles from './CourtCaseNumber.css'

interface Props {
  workingCase: Case
  setWorkingCase?: Dispatch<SetStateAction<Case>>
  onCreateCourtCase?: () => void
  onChange?: (courtCaseNumber: string) => void
}

const CourtCaseNumberInput: FC<Props> = (props) => {
  const { workingCase, setWorkingCase, onCreateCourtCase, onChange } = props
  const { formatMessage } = useIntl()
  const { updateCase, createCourtCase, isCreatingCourtCase } = useCase()
  const [value, setValue] = useState<string>(workingCase.courtCaseNumber ?? '')
  const [courtCaseNumberErrorMessage, setCourtCaseNumberErrorMessage] =
    useState<string>('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] =
    useState<boolean>(false)

  const handleCreateCourtCase = async (caseId: string) => {
    const courtCaseNumber = await createCourtCase(caseId)

    setWorkingCase?.((prevWorkingCase) => ({
      ...prevWorkingCase,
      courtCaseNumber,
    }))

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

  const validateInput = (inputValue: string) => {
    const validation = validate([
      [
        inputValue,
        [
          'empty',
          isIndictmentCase(workingCase.type)
            ? 'S-case-number'
            : 'R-case-number',
        ],
      ],
    ])

    setCourtCaseNumberErrorMessage(
      validation.isValid ? '' : validation.errorMessage,
    )
  }

  useDebounce(
    () => {
      if (createCourtCaseSuccess) {
        setCreateCourtCaseSuccess(false)
      }

      updateCourtCaseNumber(workingCase.id, { courtCaseNumber: value })
    },
    500,
    [value],
  )

  return (
    <BlueBox className={styles.createCourtCaseContainer}>
      <div className={styles.createCourtCaseButton}>
        <Button
          size="small"
          onClick={() =>
            onCreateCourtCase
              ? onCreateCourtCase()
              : handleCreateCourtCase(workingCase.id)
          }
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
          value={value}
          icon={
            workingCase.courtCaseNumber && createCourtCaseSuccess
              ? { name: 'checkmark' }
              : undefined
          }
          errorMessage={courtCaseNumberErrorMessage}
          hasError={!isCreatingCourtCase && courtCaseNumberErrorMessage !== ''}
          onChange={(evt) => {
            setCourtCaseNumberErrorMessage('')
            setValue(evt.target.value)
            onChange?.(evt.target.value)

            if (!setWorkingCase) {
              return
            }

            setWorkingCase((prevWorkingCase) => {
              return { ...prevWorkingCase, courtCaseNumber: evt.target.value }
            })
          }}
          onBlur={(evt) => validateInput(evt.target.value)}
          disabled={
            workingCase.state !== CaseState.SUBMITTED &&
            workingCase.state !== CaseState.WAITING_FOR_CANCELLATION &&
            workingCase.state !== CaseState.RECEIVED
          }
          required
        />
      </div>
    </BlueBox>
  )
}

export default CourtCaseNumberInput
