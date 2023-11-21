import React, {
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
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { Lawyer, ReactSelectOption } from '../../types'
import { replaceTabs } from '../../utils/formatters'
import {
  removeErrorMessageIfValid,
  removeTabsValidateAndSet,
  validateAndSendToServer,
  validateAndSetErrorMessage,
} from '../../utils/formHelper'
import { useCase, useGetLawyers } from '../../utils/hooks'
import useDefendants from '../../utils/hooks/useDefendants'
import { Validation } from '../../utils/validate'
import { FormContext } from '../FormProvider/FormProvider'
import { defenderInput as m } from './DefenderInput.strings'

interface Props {
  onDefenderNotFound: (defenderNotFound: boolean) => void
  disabled?: boolean
  defendantId?: string
}

interface PropertyValidation {
  validations: Validation[]
  errorMessageHandler: {
    errorMessage: string
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  }
}

type InputType = 'defenderEmail' | 'defenderPhoneNumber'

const DefenderInput: React.FC<React.PropsWithChildren<Props>> = ({
  onDefenderNotFound,
  disabled,
  defendantId,
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
    (defendant) => defendant.id === defendantId,
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
      let updatedLawyer = {
        defenderName: '',
        defenderNationalId: '',
        defenderEmail: '',
        defenderPhoneNumber: '',
      }

      if (selectedOption) {
        const { label, value, __isNew__: defenderNotFound } = selectedOption

        onDefenderNotFound(defenderNotFound || false)

        const lawyer = lawyers.find(
          (l: Lawyer) => l.email === (value as string),
        )

        updatedLawyer = {
          defenderName: lawyer ? lawyer.name : label,
          defenderNationalId: lawyer ? lawyer.nationalId : '',
          defenderEmail: lawyer ? lawyer.email : '',
          defenderPhoneNumber: lawyer ? lawyer.phoneNr : '',
        }
      }

      if (defendantId) {
        setAndSendDefendantToServer(
          workingCase.id,
          defendantId,
          { ...updatedLawyer, caseId: workingCase.id, defendantId },
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
      defendantId,
      onDefenderNotFound,
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
      defendantId: string,
      property: InputType,
      value: string,
      setWorkingCase: React.Dispatch<SetStateAction<Case>>,
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
        { ...update, caseId: workingCase.id, defendantId },
        setWorkingCase,
      )
    },
    [formatUpdate, propertyValidations, updateDefendantState, workingCase.id],
  )

  const handleLawyerPropertyBlur = useCallback(
    (
      caseId: string,
      defendantId: string,
      property: InputType,
      value: string,
    ) => {
      const propertyValidation = propertyValidations(property)
      const update = formatUpdate(property, value)

      validateAndSetErrorMessage(
        propertyValidation.validations,
        value,
        propertyValidation.errorMessageHandler.setErrorMessage,
      )

      updateDefendant({ ...update, caseId: workingCase.id, defendantId })
    },
    [formatUpdate, propertyValidations, updateDefendant, workingCase.id],
  )

  return (
    <>
      <Box marginBottom={2}>
        <Select
          name={`defenderName${defendantId ? `-${defendantId}` : ''}`}
          icon="search"
          options={options}
          label={formatMessage(m.nameLabel, {
            sessionArrangements: workingCase.sessionArrangements,
          })}
          placeholder={formatMessage(m.namePlaceholder)}
          value={
            defendantId
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
          isDisabled={disabled}
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          data-testid={`defenderEmail${defendantId ? `-${defendantId}` : ''}`}
          name="defenderEmail"
          autoComplete="off"
          label={formatMessage(m.emailLabel, {
            sessionArrangements: workingCase.sessionArrangements,
          })}
          placeholder={formatMessage(m.emailPlaceholder)}
          value={
            defendantId
              ? defendantInDefendants?.defenderEmail || ''
              : workingCase.defenderEmail || ''
          }
          errorMessage={emailErrorMessage}
          hasError={emailErrorMessage !== ''}
          disabled={disabled}
          onChange={(event) => {
            if (defendantId) {
              handleLawyerPropertyChange(
                defendantId,
                'defenderEmail',
                event.target.value,
                setWorkingCase,
              )
            } else {
              removeTabsValidateAndSet(
                'defenderEmail',
                event.target.value,
                ['email-format'],
                workingCase,
                setWorkingCase,
                emailErrorMessage,
                setEmailErrorMessage,
              )
            }
          }}
          onBlur={(event) => {
            if (defendantId) {
              handleLawyerPropertyBlur(
                workingCase.id,
                defendantId,
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
          defendantId
            ? defendantInDefendants?.defenderPhoneNumber || ''
            : workingCase.defenderPhoneNumber || ''
        }
        disabled={disabled}
        onChange={(event) => {
          if (defendantId) {
            handleLawyerPropertyChange(
              defendantId,
              'defenderPhoneNumber',
              event.target.value,
              setWorkingCase,
            )
          } else {
            removeTabsValidateAndSet(
              'defenderPhoneNumber',
              event.target.value,
              ['phonenumber'],
              workingCase,
              setWorkingCase,
              phoneNumberErrorMessage,
              setPhoneNumberErrorMessage,
            )
          }
        }}
        onBlur={(event) => {
          if (defendantId) {
            handleLawyerPropertyBlur(
              workingCase.id,
              defendantId,
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
          data-testid={`defenderPhoneNumber${
            defendantId ? `-${defendantId}` : ''
          }`}
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

export default DefenderInput
