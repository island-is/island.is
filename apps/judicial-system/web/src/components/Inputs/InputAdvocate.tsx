import {
  ChangeEvent,
  FC,
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
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { replaceTabs } from '@island.is/judicial-system-web/src/utils/formatters'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { LawyerRegistryContext } from '../LawyerRegistryProvider/LawyerRegistryProvider'
import {
  emailLabelStrings,
  nameLabelStrings,
  phoneNumberLabelStrings,
  placeholderStrings,
} from './InputAdvocate.strings'

interface Props {
  advocateType: 'defender' | 'spokesperson' | 'lawyer' | 'legalRightsProtector'
  name: string | undefined | null
  email: string | undefined | null
  phoneNumber: string | undefined | null
  onAdvocateNotFound?: (advocateNotFound: boolean) => void
  onAdvocateChange: (
    name: string | null,
    nationalId: string | null,
    email: string | null,
    phoneNumber: string | null,
  ) => void
  onEmailChange: (email: string | null) => void
  onEmailSave: (email: string | null) => void
  onPhoneNumberChange: (phoneNumber: string | null) => void
  onPhoneNumberSave: (phoneNumber: string | null) => void
  disabled?: boolean | null
}

/**
 * A reusable input component for advocates. It handles lawyer lookup, input validation
 * and setting/removing validation error message.
 */
const InputAdvocate: FC<Props> = ({
  // The type of advocate being set.
  advocateType,

  // The name of the advocate.
  name: lawyerName,

  // The email of the advocate.
  email: lawyerEmail,

  // The phone number of the advocate.
  phoneNumber: lawyerPhoneNumber,

  // A function that is called when a new advocate is selected.
  onAdvocateChange,

  // A function that is called if an advocate is not found.
  onAdvocateNotFound,

  // A function that is called when an advocate email is changed.
  onEmailChange,

  // A function that is called when an advocate email is blurred.
  onEmailSave,

  // A function that is called when an advocate phone number is changed.
  onPhoneNumberChange,

  // A function that is called when an advocate phone number is blurred.
  onPhoneNumberSave,

  disabled,
}) => {
  const { formatMessage } = useIntl()
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] =
    useState<string>('')

  const { lawyers } = useContext(LawyerRegistryContext)

  const options = useMemo(
    () =>
      lawyers?.map((l: Lawyer) => ({
        label: `${l.name}${l.practice ? ` (${l.practice})` : ''}`,
        value: l.email,
      })),

    [lawyers],
)

  const handleAdvocateChange = useCallback(
    (selectedOption: SingleValue<ReactSelectOption>) => {
      let name: string | null = null
      let nationalId: string | null = null
      let email: string | null = null
      let phoneNumber: string | null = null

      if (selectedOption) {
        const { label, value, __isNew__: defenderNotFound } = selectedOption

        onAdvocateNotFound && onAdvocateNotFound(defenderNotFound || false)

        const lawyer = lawyers?.find(
          (l: Lawyer) => l.email === (value as string),
        )

        name = lawyer ? lawyer.name : label
        nationalId = lawyer ? lawyer.nationalId : null
        email = lawyer ? lawyer.email : null
        phoneNumber = lawyer ? lawyer.phoneNr : null
      }

      setEmailErrorMessage('')
      setPhoneNumberErrorMessage('')
      onAdvocateChange(name, nationalId, email, phoneNumber)
    },
    [onAdvocateChange, onAdvocateNotFound, lawyers],
  )

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const email = replaceTabs(event.target.value)

      removeErrorMessageIfValid(
        ['email-format'],
        email,
        emailErrorMessage,
        setEmailErrorMessage,
      )

      onEmailChange(email || null)
    },
    [emailErrorMessage, onEmailChange],
  )

  const handleLEmailBlur = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const email = replaceTabs(event.target.value)

      validateAndSetErrorMessage(['email-format'], email, setEmailErrorMessage)

      onEmailSave(email || null)
    },
    [onEmailSave],
  )

  const handlePhoneNumberChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const phoneNumber = replaceTabs(event.target.value)

      removeErrorMessageIfValid(
        ['phonenumber'],
        phoneNumber,
        phoneNumberErrorMessage,
        setPhoneNumberErrorMessage,
      )

      onPhoneNumberChange(phoneNumber || null)
    },
    [phoneNumberErrorMessage, onPhoneNumberChange],
  )

  const handlePhoneNumberBlur = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const phoneNumber = replaceTabs(event.target.value)

      validateAndSetErrorMessage(
        ['phonenumber'],
        phoneNumber,
        setPhoneNumberErrorMessage,
      )

      onPhoneNumberSave(phoneNumber || null)
    },
    [onPhoneNumberSave],
  )

  return (
    <>
      <Box marginBottom={2}>
        <Select
          name="advocateName"
          icon="search"
          options={options}
          label={formatMessage(nameLabelStrings[advocateType])}
          placeholder={formatMessage(placeholderStrings.namePlaceholder)}
          value={
            lawyerName ? { label: lawyerName, value: lawyerEmail ?? '' } : null
          }
          onChange={handleAdvocateChange}
          noOptionsMessage="Ekki náðist samband við lögmannaskrá LMFÍ."
          isDisabled={Boolean(disabled)}
          isCreatable
          isClearable
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          data-testid="defenderEmail"
          name="defenderEmail"
          autoComplete="off"
          label={formatMessage(emailLabelStrings[advocateType])}
          placeholder={formatMessage(placeholderStrings.emailPlaceholder)}
          value={lawyerEmail ?? ''}
          errorMessage={emailErrorMessage}
          hasError={emailErrorMessage !== ''}
          disabled={Boolean(disabled)}
          onChange={handleEmailChange}
          onBlur={handleLEmailBlur}
        />
      </Box>
      <InputMask
        mask="999-9999"
        maskPlaceholder={null}
        value={lawyerPhoneNumber || ''}
        disabled={Boolean(disabled)}
        onChange={handlePhoneNumberChange}
        onBlur={handlePhoneNumberBlur}
      >
        <Input
          data-testid="defenderPhoneNumber"
          name="defenderPhoneNumber"
          autoComplete="off"
          label={formatMessage(phoneNumberLabelStrings[advocateType])}
          placeholder={formatMessage(placeholderStrings.phoneNumberPlaceholder)}
          errorMessage={phoneNumberErrorMessage}
          hasError={phoneNumberErrorMessage !== ''}
        />
      </InputMask>
    </>
  )
}

export default InputAdvocate
