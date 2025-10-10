import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import {
  MultipleValueList,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseOrigin,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { policeCaseNumber as m } from './PoliceCaseNumbers.strings'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  clientPoliceNumbers?: string[] | null
  setClientPoliceNumbers: Dispatch<SetStateAction<string[] | undefined | null>>
}

// Needed so that users can remove all loke numbers in client without syncing to server
export const usePoliceCaseNumbers = (workingCase: Case) => {
  const [clientPoliceNumbers, setClientPoliceNumbers] = useState<
    string[] | undefined | null
  >(workingCase.policeCaseNumbers)
  useEffect(() => {
    if (workingCase.id) {
      setClientPoliceNumbers(workingCase.policeCaseNumbers)
    }
  }, [workingCase.id, workingCase.policeCaseNumbers])

  return { clientPoliceNumbers, setClientPoliceNumbers }
}

const validatePoliceCaseNumber = (
  value: string | undefined,
  existingNumbers: string[] | null | undefined,
): { isValid: boolean; errorMessage?: string } => {
  if (!value) {
    return { isValid: false, errorMessage: 'Value is required' }
  }

  const baseValidation = validate([
    [value, ['empty', 'police-casenumber-format']],
  ])

  if (!baseValidation.isValid) {
    return baseValidation
  }

  if (existingNumbers?.includes(value)) {
    return {
      isValid: false,
      errorMessage: 'This police case number already exists',
    }
  }

  return { isValid: true }
}

export const PoliceCaseNumbers: FC<Props> = ({
  workingCase,
  setWorkingCase,
  clientPoliceNumbers,
  setClientPoliceNumbers,
}) => {
  const { user } = useContext(UserContext)
  const { setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  const isLOKECase = workingCase.origin === CaseOrigin.LOKE
  const [hasError, setHasError] = useState(false)

  const updatePoliceNumbers = useCallback(
    (newPoliceCaseNumbers: string[]) => {
      setClientPoliceNumbers(newPoliceCaseNumbers)
      if (newPoliceCaseNumbers.length > 0) {
        setAndSendCaseToServer(
          [{ policeCaseNumbers: newPoliceCaseNumbers, force: true }],
          workingCase,
          setWorkingCase,
        )
        setHasError(false)
      } else {
        setHasError(true)
      }
    },
    [
      workingCase,
      setWorkingCase,
      setAndSendCaseToServer,
      setClientPoliceNumbers,
    ],
  )

  const onAdd = useCallback(
    (value: string) => {
      const validation = validatePoliceCaseNumber(
        value,
        clientPoliceNumbers ?? [],
      )
      if (validation.isValid) {
        updatePoliceNumbers([...(clientPoliceNumbers ?? []), value])
      }
    },
    [clientPoliceNumbers, updatePoliceNumbers],
  )

  const onRemove = useCallback(
    (value: string) => () => {
      if (!clientPoliceNumbers) return

      let firstOccurrenceSkipped = false

      const newPoliceCaseNumbers = clientPoliceNumbers.filter(
        (number, index) => {
          if (isLOKECase && number === value && index === 0) {
            if (!firstOccurrenceSkipped) {
              firstOccurrenceSkipped = true // Skip the first occurrence
              return true
            }
            return false // Remove all other instances
          }
          return number !== value // Remove in non-LOKE cases
        },
      )

      updatePoliceNumbers(newPoliceCaseNumbers)
    },
    [clientPoliceNumbers, updatePoliceNumbers, isLOKECase],
  )

  const renderPoliceCaseNumbersList = () => {
    if (!clientPoliceNumbers?.length) {
      return (
        <Text color="dark400" dataTestId="noPoliceCaseNumbersAssignedMessage">
          {formatMessage(m.noPoliceCaseNumbersAssignedMessage)}
        </Text>
      )
    }

    return (
      <Box
        display="flex"
        flexWrap="wrap"
        columnGap={1}
        rowGap={1}
        data-testid="policeCaseNumbers-list"
      >
        {clientPoliceNumbers.map((policeCaseNumber, index) => (
          <Tag
            variant="darkerBlue"
            onClick={onRemove(policeCaseNumber)}
            aria-label={`Eyða númeri ${policeCaseNumber}`}
            disabled={isLOKECase && index === 0}
            key={`${policeCaseNumber}-${index}`}
          >
            <Box display="flex" alignItems="center">
              <Box paddingRight={'smallGutter'}>{policeCaseNumber}</Box>
              {isLOKECase && index === 0 ? null : (
                <Icon icon="close" size="small" />
              )}
            </Box>
          </Tag>
        ))}
      </Box>
    )
  }

  return (
    <>
      <SectionHeading title={formatMessage(m.heading)} required />
      <MultipleValueList
        name="policeCaseNumbers"
        inputMask="police-case-numbers"
        inputLabel={formatMessage(m.label)}
        inputPlaceholder={formatMessage(m.placeholder, {
          prefix:
            workingCase.prosecutorsOffice?.policeCaseNumberPrefix ??
            user?.institution?.policeCaseNumberPrefix ??
            '',
          year: new Date().getFullYear(),
        })}
        onAddValue={onAdd}
        buttonText={formatMessage(m.buttonText)}
        // this disabled the button
        isDisabled={(value) => {
          if (!value) return true
          return !validatePoliceCaseNumber(value, clientPoliceNumbers ?? [])
            .isValid
        }}
        onBlur={(event) => {
          setHasError(
            Boolean(
              clientPoliceNumbers &&
                clientPoliceNumbers.length === 0 &&
                !event.target.value,
            ),
          )
        }}
        hasError={hasError}
        errorMessage={validate([[undefined, ['empty']]]).errorMessage}
      >
        {renderPoliceCaseNumbersList()}
      </MultipleValueList>
    </>
  )
}
