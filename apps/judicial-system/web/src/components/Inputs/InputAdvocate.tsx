import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { SingleValue } from 'react-select'

import { Box, Input, Select } from '@island.is/island-ui/core'
import { type Lawyer } from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  ReactSelectOption,
  TempCase as Case,
} from '@island.is/judicial-system-web/src/types'
import { replaceTabs } from '@island.is/judicial-system-web/src/utils/formatters'
import {
  removeErrorMessageIfValid,
  removeTabsValidateAndSet,
  validateAndSendToServer,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useDefendants,
  useGetLawyers,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'

import { defenderInput as m } from '../DefenderInfo/DefenderInput.strings'

interface Props {
  onAdvocateNotFound: (advocateNotFound: boolean) => void
  disabled?: boolean | null
  clientId?: string | null
  advocateType?: 'defender' | 'spokesperson' | 'legal_rights_protector'
}

interface PropertyValidation {
  validations: Validation[]
  errorMessageHandler: {
    errorMessage: string
    setErrorMessage: Dispatch<SetStateAction<string>>
  }
}

type InputType =
  | 'defenderEmail'
  | 'defenderPhoneNumber'
  | 'spokespersonEmail'
  | 'spokespersonPhoneNumber'

/**
 * A component that handles setting any kind of legal advocate. In doing so
 * there are three things to consider.
 *
 * 1. In R-cases, a single *defender* is set on the case itself.
 * 2. In S-cases, a *defender* or *spokesperson* is set on each defendant,
 *    depending on what SESSION_ARRANGEMENT is set.
 * 3. In S-cases, a *legal rights protector* is set on each civil claimant.
 */
const InputAdvocate: FC<Props> = ({
  // A function that runs if an advocate is not found.
  onAdvocateNotFound,

  /**
   * The id of the client of the advocate. Used to update the advocate info
   * of the client.
   */
  clientId,

  // The type of advocate being set. See description above.
  advocateType,

  disabled,
}) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const lawyers = useGetLawyers()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const { updateDefendant, updateDefendantState, setAndSendDefendantToServer } =
    useDefendants()
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] =
    useState<string>('')

  const defendantInDefendants = workingCase.defendants?.find(
    (defendant) => defendant.id === clientId,
  )

  const options = useMemo(
    () =>
      lawyers.map((l: Lawyer) => ({
        label: `${l.name}${l.practice ? ` (${l.practice})` : ''}`,
        value: l.email,
      })),

    [lawyers],
  )

  const handleLawyerChange = useCallback(
    (selectedOption: SingleValue<ReactSelectOption>) => {
      if (!selectedOption) {
        return
      }

      const { label, value, __isNew__: defenderNotFound } = selectedOption

      onAdvocateNotFound(defenderNotFound || false)

      const lawyer = lawyers.find((l: Lawyer) => l.email === (value as string))

      const updatedLawyer = {
        defenderName: lawyer ? lawyer.name : label,
        defenderNationalId: lawyer ? lawyer.nationalId : '',
        defenderEmail: lawyer ? lawyer.email : '',
        defenderPhoneNumber: lawyer ? lawyer.phoneNr : '',
      }

      if (advocateType === 'legal_rights_protector' && clientId) {
        const updatedSpokesperson = {
          spokespersonName: lawyer ? lawyer.name : label,
          spokespersonNationalId: lawyer ? lawyer.nationalId : '',
          spokespersonEmail: lawyer ? lawyer.email : '',
          spokespersonPhoneNumber: lawyer ? lawyer.phoneNr : '',
        }

        // TODO: Implement setAndSendCivilClaimantToServer and call it here.
      } else if (clientId) {
        setAndSendDefendantToServer(
          { ...updatedLawyer, caseId: workingCase.id, defendantId: clientId },
          setWorkingCase,
        )
      } else {
        setAndSendCaseToServer(
          [{ ...updatedLawyer, force: true }],
          workingCase,
          setWorkingCase,
        )
      }
    },
    [
      clientId,
      onAdvocateNotFound,
      lawyers,
      setAndSendDefendantToServer,
      workingCase,
      setWorkingCase,
      setAndSendCaseToServer,
    ],
  )

  const propertyValidations = useCallback(
    (property: InputType) => {
      const propertyValidation: PropertyValidation =
        property === 'defenderEmail'
          ? {
              validations: ['email-format'],
              errorMessageHandler: {
                errorMessage: emailErrorMessage,
                setErrorMessage: setEmailErrorMessage,
              },
            }
          : {
              validations: ['phonenumber'],
              errorMessageHandler: {
                errorMessage: phoneNumberErrorMessage,
                setErrorMessage: setPhoneNumberErrorMessage,
              },
            }

      return propertyValidation
    },
    [emailErrorMessage, phoneNumberErrorMessage],
  )

  const formatUpdate = useCallback((property: InputType, value: string) => {
    return property === 'defenderEmail'
      ? {
          defenderEmail: value,
        }
      : {
          defenderPhoneNumber: value,
        }
  }, [])

  const handleLawyerPropertyChange = useCallback(
    (
      clientId: string,
      property: InputType,
      value: string,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      let newValue = value
      const propertyValidation = propertyValidations(property)
      const update = formatUpdate(property, value)

      if (newValue.includes('\t')) {
        newValue = replaceTabs(value)
      }

      removeErrorMessageIfValid(
        propertyValidation.validations,
        newValue,
        propertyValidation.errorMessageHandler.errorMessage,
        propertyValidation.errorMessageHandler.setErrorMessage,
      )

      updateDefendantState(
        { ...update, caseId: workingCase.id, defendantId: clientId },
        setWorkingCase,
      )
    },
    [formatUpdate, propertyValidations, updateDefendantState, workingCase.id],
  )

  const handleLawyerPropertyBlur = useCallback(
    (caseId: string, clientId: string, property: InputType, value: string) => {
      const propertyValidation = propertyValidations(property)
      const update = formatUpdate(property, value)

      validateAndSetErrorMessage(
        propertyValidation.validations,
        value,
        propertyValidation.errorMessageHandler.setErrorMessage,
      )

      updateDefendant({
        ...update,
        caseId: workingCase.id,
        defendantId: clientId,
      })
    },
    [formatUpdate, propertyValidations, updateDefendant, workingCase.id],
  )

  return (
    <>
      <Box marginBottom={2}>
        <Select
          name={`defenderName${clientId ? `-${clientId}` : ''}`}
          icon="search"
          options={options}
          label={formatMessage(m.nameLabel, {
            sessionArrangements: workingCase.sessionArrangements,
          })}
          placeholder={formatMessage(m.namePlaceholder)}
          value={
            clientId
              ? defendantInDefendants?.defenderName === '' ||
                !defendantInDefendants?.defenderName
                ? null
                : {
                    label: defendantInDefendants?.defenderName ?? '',
                    value: defendantInDefendants?.defenderEmail ?? '',
                  }
              : workingCase.defenderName
              ? {
                  label: workingCase.defenderName ?? '',
                  value: workingCase.defenderEmail ?? '',
                }
              : null
          }
          onChange={handleLawyerChange}
          filterConfig={{ matchFrom: 'start' }}
          isCreatable
          isDisabled={Boolean(disabled)}
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          data-testid={`defenderEmail${clientId ? `-${clientId}` : ''}`}
          name="defenderEmail"
          autoComplete="off"
          label={formatMessage(m.emailLabel, {
            sessionArrangements: workingCase.sessionArrangements,
          })}
          placeholder={formatMessage(m.emailPlaceholder)}
          value={
            clientId
              ? defendantInDefendants?.defenderEmail || ''
              : workingCase.defenderEmail || ''
          }
          errorMessage={emailErrorMessage}
          hasError={emailErrorMessage !== ''}
          disabled={Boolean(disabled)}
          onChange={(event) => {
            if (clientId) {
              handleLawyerPropertyChange(
                clientId,
                'defenderEmail',
                event.target.value,
                setWorkingCase,
              )
            } else {
              removeTabsValidateAndSet(
                'defenderEmail',
                event.target.value,
                ['email-format'],
                setWorkingCase,
                emailErrorMessage,
                setEmailErrorMessage,
              )
            }
          }}
          onBlur={(event) => {
            if (clientId) {
              handleLawyerPropertyBlur(
                workingCase.id,
                clientId,
                'defenderEmail',
                event.target.value,
              )
            } else {
              validateAndSendToServer(
                'defenderEmail',
                event.target.value,
                ['email-format'],
                workingCase,
                updateCase,
                setEmailErrorMessage,
              )
            }
          }}
        />
      </Box>
      <InputMask
        mask="999-9999"
        maskPlaceholder={null}
        value={
          clientId
            ? defendantInDefendants?.defenderPhoneNumber || ''
            : workingCase.defenderPhoneNumber || ''
        }
        disabled={Boolean(disabled)}
        onChange={(event) => {
          if (clientId) {
            handleLawyerPropertyChange(
              clientId,
              'defenderPhoneNumber',
              event.target.value,
              setWorkingCase,
            )
          } else {
            removeTabsValidateAndSet(
              'defenderPhoneNumber',
              event.target.value,
              ['phonenumber'],
              setWorkingCase,
              phoneNumberErrorMessage,
              setPhoneNumberErrorMessage,
            )
          }
        }}
        onBlur={(event) => {
          if (clientId) {
            handleLawyerPropertyBlur(
              workingCase.id,
              clientId,
              'defenderPhoneNumber',
              event.target.value,
            )
          } else {
            validateAndSendToServer(
              'defenderPhoneNumber',
              event.target.value,
              ['phonenumber'],
              workingCase,
              updateCase,
              setPhoneNumberErrorMessage,
            )
          }
        }}
      >
        <Input
          data-testid={`defenderPhoneNumber${clientId ? `-${clientId}` : ''}`}
          name="defenderPhoneNumber"
          autoComplete="off"
          label={formatMessage(m.phoneNumberLabel, {
            sessionArrangements: workingCase.sessionArrangements,
          })}
          placeholder={formatMessage(m.phoneNumberPlaceholder)}
          errorMessage={phoneNumberErrorMessage}
          hasError={phoneNumberErrorMessage !== ''}
        />
      </InputMask>
    </>
  )
}

export default InputAdvocate
