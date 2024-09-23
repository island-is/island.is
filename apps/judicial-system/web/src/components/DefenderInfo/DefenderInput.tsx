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

import useCivilClaimants from '../../utils/hooks/useCivilClaimants'
import { defenderInput as m } from './DefenderInput.strings'

interface Props {
  onDefenderNotFound: (defenderNotFound: boolean) => void
  disabled?: boolean | null
  clientId?: string | null
  defenderType?: 'lawyer' | 'spokesperson' | 'legalRightsProtector'
  isCivilClaim?: boolean
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

const DefenderInput: FC<Props> = ({
  onDefenderNotFound,
  disabled,
  clientId,
  defenderType,
  isCivilClaim = false,
}) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const lawyers = useGetLawyers()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const { updateDefendant, updateDefendantState, setAndSendDefendantToServer } =
    useDefendants()
  const {
    setAndSendCivilClaimantToServer,
    updateCivilClaimantState,
    updateCivilClaimant,
  } = useCivilClaimants()
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] =
    useState<string>('')

  const defendantInDefendants = workingCase.defendants?.find(
    (defendant) => defendant.id === clientId,
  )

  const civilClaimantInCivilClaimants = workingCase.civilClaimants?.find(
    (civilClaimant) => civilClaimant.id === clientId,
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
    (selectedOption: SingleValue<ReactSelectOption>, isCivilClaim: boolean) => {
      if (selectedOption) {
        const { label, value, __isNew__: defenderNotFound } = selectedOption

        onDefenderNotFound(defenderNotFound || false)

        const lawyer = lawyers.find(
          (l: Lawyer) => l.email === (value as string),
        )

        const updatedLawyer = isCivilClaim
          ? {
              spokespersonName: lawyer ? lawyer.name : label,
              spokespersonNationalId: lawyer ? lawyer.nationalId : '',
              spokespersonEmail: lawyer ? lawyer.email : '',
              spokespersonPhoneNumber: lawyer ? lawyer.phoneNr : '',
            }
          : {
              defenderName: lawyer ? lawyer.name : label,
              defenderNationalId: lawyer ? lawyer.nationalId : '',
              defenderEmail: lawyer ? lawyer.email : '',
              defenderPhoneNumber: lawyer ? lawyer.phoneNr : '',
            }

        if (isCivilClaim && clientId) {
          setAndSendCivilClaimantToServer(
            {
              ...updatedLawyer,
              caseId: workingCase.id,
              civilClaimantId: clientId,
            },
            setWorkingCase,
          )
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
      }
    },
    [
      clientId,
      onDefenderNotFound,
      lawyers,
      setAndSendCivilClaimantToServer,
      workingCase,
      setWorkingCase,
      setAndSendDefendantToServer,
      setAndSendCaseToServer,
    ],
  )

  const propertyValidations = useCallback(
    (property: InputType) => {
      const propertyValidation: PropertyValidation =
        property === 'defenderEmail' || property === 'spokespersonEmail'
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
    return property === 'defenderEmail' || property === 'spokespersonEmail'
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
      isCivilClaim: boolean,
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

      if (isCivilClaim) {
        updateCivilClaimantState(
          { ...update, caseId: workingCase.id, civilClaimantId: clientId },
          setWorkingCase,
        )
      } else {
        updateDefendantState(
          { ...update, caseId: workingCase.id, defendantId: clientId },
          setWorkingCase,
        )
      }
    },
    [
      formatUpdate,
      propertyValidations,
      updateCivilClaimantState,
      updateDefendantState,
      workingCase.id,
    ],
  )

  const handleLawyerPropertyBlur = useCallback(
    (
      caseId: string,
      clientId: string,
      property: InputType,
      value: string,
      isCivilClaim: boolean,
    ) => {
      const propertyValidation = propertyValidations(property)
      const update = formatUpdate(property, value)

      validateAndSetErrorMessage(
        propertyValidation.validations,
        value,
        propertyValidation.errorMessageHandler.setErrorMessage,
      )

      if (isCivilClaim) {
        updateCivilClaimant({ ...update, caseId, civilClaimantId: clientId })
      } else {
        updateDefendant({ ...update, caseId, defendantId: clientId })
      }
    },
    [formatUpdate, propertyValidations, updateCivilClaimant, updateDefendant],
  )

  return (
    <>
      <Box marginBottom={2}>
        <Select
          name={`defenderName${clientId ? `-${clientId}` : ''}`}
          icon="search"
          options={options}
          label={
            defenderType === 'legalRightsProtector'
              ? formatMessage(m.spokespersonNameLabel)
              : formatMessage(m.nameLabel, {
                  sessionArrangements: workingCase.sessionArrangements,
                })
          }
          placeholder={formatMessage(m.namePlaceholder)}
          value={
            isCivilClaim
              ? civilClaimantInCivilClaimants?.spokespersonName === '' ||
                !civilClaimantInCivilClaimants?.spokespersonName
                ? null
                : {
                    label:
                      civilClaimantInCivilClaimants?.spokespersonName ?? '',
                    value:
                      civilClaimantInCivilClaimants?.spokespersonEmail ?? '',
                  }
              : clientId
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
          onChange={(selectedOption) =>
            handleLawyerChange(selectedOption, isCivilClaim)
          }
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
          label={
            defenderType === 'legalRightsProtector'
              ? formatMessage(m.spokespersonEmailLabel)
              : formatMessage(m.emailLabel, {
                  sessionArrangements: workingCase.sessionArrangements,
                })
          }
          placeholder={formatMessage(m.emailPlaceholder)}
          value={
            isCivilClaim
              ? civilClaimantInCivilClaimants?.spokespersonEmail || ''
              : clientId
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
                defenderType === 'legalRightsProtector'
                  ? 'spokespersonEmail'
                  : 'defenderEmail',
                event.target.value,
                isCivilClaim,
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
                defenderType === 'legalRightsProtector'
                  ? 'spokespersonEmail'
                  : 'defenderEmail',
                event.target.value,
                isCivilClaim,
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
          isCivilClaim
            ? civilClaimantInCivilClaimants?.spokespersonPhoneNumber || ''
            : clientId
            ? defendantInDefendants?.defenderPhoneNumber || ''
            : workingCase.defenderPhoneNumber || ''
        }
        disabled={Boolean(disabled)}
        onChange={(event) => {
          if (clientId) {
            handleLawyerPropertyChange(
              clientId,
              defenderType === 'legalRightsProtector'
                ? 'spokespersonPhoneNumber'
                : 'defenderPhoneNumber',
              event.target.value,
              isCivilClaim,
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
              defenderType === 'legalRightsProtector'
                ? 'spokespersonPhoneNumber'
                : 'defenderPhoneNumber',
              event.target.value,
              isCivilClaim,
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
          label={
            defenderType === 'legalRightsProtector'
              ? formatMessage(m.spokespersonPhoneNumberLabel)
              : formatMessage(m.phoneNumberLabel, {
                  sessionArrangements: workingCase.sessionArrangements,
                })
          }
          placeholder={formatMessage(m.phoneNumberPlaceholder)}
          errorMessage={phoneNumberErrorMessage}
          hasError={phoneNumberErrorMessage !== ''}
        />
      </InputMask>
    </>
  )
}

export default DefenderInput
