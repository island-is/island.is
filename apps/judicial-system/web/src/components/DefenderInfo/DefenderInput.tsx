import React, { useCallback, useContext, useMemo, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import { Box, Input, Select } from '@island.is/island-ui/core'
import { FormContext } from '../FormProvider/FormProvider'

import { useCase, useGetLawyers } from '../../utils/hooks'
import { defenderInput as m } from './DefenderInput.strings'
import { Lawyer, ReactSelectOption } from '../../types'
import { ValueType } from 'react-select'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'

interface Props {
  onDefenderNotFound: (defenderNotFound: boolean) => void
  disabled?: boolean
}
const DefenderInput: React.FC<Props> = ({ onDefenderNotFound, disabled }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const lawyers = useGetLawyers()
  const { updateCase } = useCase()

  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [
    phoneNumberErrorMessage,
    setPhoneNumberErrorMessage,
  ] = useState<string>('')

  const options = useMemo(
    () =>
      lawyers.map((l: Lawyer) => ({
        label: `${l.name}${l.practice ? ` (${l.practice})` : ''}`,
        value: l.email,
      })),

    [lawyers],
  )

  const onChange = useCallback(
    async (selectedOption: ValueType<ReactSelectOption>) => {
      let updatedLawyer = {
        defenderName: '',
        defenderNationalId: '',
        defenderEmail: '',
        defenderPhoneNumber: '',
      }

      if (selectedOption) {
        const {
          label,
          value,
          __isNew__: defenderNotFound,
        } = selectedOption as ReactSelectOption

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

      await updateCase(workingCase.id, updatedLawyer)
      setWorkingCase({ ...workingCase, ...updatedLawyer })
    },
    [lawyers, setWorkingCase, workingCase, updateCase, onDefenderNotFound],
  )

  return (
    <>
      <Box marginBottom={2}>
        <Select
          name="defenderName"
          icon="search"
          options={options}
          label={formatMessage(m.nameLabel, {
            sessionArrangements: workingCase.sessionArrangements,
          })}
          placeholder={formatMessage(m.namePlaceholder)}
          value={
            workingCase.defenderName
              ? {
                  label: workingCase.defenderName ?? '',
                  value: workingCase.defenderEmail ?? '',
                }
              : null
          }
          onChange={onChange}
          filterConfig={{ matchFrom: 'start' }}
          isCreatable
          disabled={disabled}
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          data-testid="defenderEmail"
          name="defenderEmail"
          autoComplete="off"
          label={formatMessage(m.emailLabel, {
            sessionArrangements: workingCase.sessionArrangements,
          })}
          placeholder={formatMessage(m.emailPlaceholder)}
          value={workingCase.defenderEmail || ''}
          errorMessage={emailErrorMessage}
          hasError={emailErrorMessage !== ''}
          disabled={disabled}
          onChange={(event) =>
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
          onBlur={(event) =>
            validateAndSendToServer(
              'defenderEmail',
              event.target.value,
              ['email-format'],
              workingCase,
              updateCase,
              setEmailErrorMessage,
            )
          }
        />
      </Box>
      <InputMask
        mask="999-9999"
        maskPlaceholder={null}
        value={workingCase.defenderPhoneNumber || ''}
        disabled={disabled}
        onChange={(event) =>
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
        onBlur={(event) =>
          validateAndSendToServer(
            'defenderPhoneNumber',
            event.target.value,
            ['phonenumber'],
            workingCase,
            updateCase,
            setPhoneNumberErrorMessage,
          )
        }
      >
        <Input
          data-testid="defenderPhoneNumber"
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
