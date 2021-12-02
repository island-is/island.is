import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import { Box, Checkbox, Input, Select, Text } from '@island.is/island-ui/core'
import lawyers from '@island.is/judicial-system-web/src/utils/lawyerScraper/db.json'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  Case,
  CaseType,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { accused } from '@island.is/judicial-system-web/messages'
import { defendant } from '@island.is/judicial-system-web/messages'

import { BlueBox } from '..'
import { useCase } from '../../utils/hooks'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  setAndSendToServer: (element: HTMLInputElement) => Promise<void>
}

const DefenderInfo: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, setAndSendToServer } = props
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()

  const [
    defenderEmailErrorMessage,
    setDefenderEmailErrorMessage,
  ] = useState<string>('')

  const [
    defenderPhoneNumberErrorMessage,
    setDefenderPhoneNumberErrorMessage,
  ] = useState<string>('')

  const handleDefenderChange = async (
    selectedOption: ValueType<ReactSelectOption>,
  ) => {
    let updatedLawyer = {
      defenderName: '',
      defenderEmail: '',
      defenderPhoneNumber: '',
    }

    if (selectedOption) {
      const { label, value } = selectedOption as ReactSelectOption
      const lawyer = lawyers.lawyers.find((l) => l.email === (value as string))

      updatedLawyer = {
        defenderName: lawyer ? lawyer.name : label,
        defenderEmail: lawyer ? lawyer.email : '',
        defenderPhoneNumber: lawyer ? lawyer.phoneNr : '',
      }
    }

    await updateCase(workingCase.id, updatedLawyer)
    setWorkingCase({ ...workingCase, ...updatedLawyer })
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="baseline"
        marginBottom={2}
      >
        <Text as="h3" variant="h3">
          {formatMessage(
            isRestrictionCase(workingCase.type)
              ? accused.sections.defenderInfo.heading
              : defendant.sections.defenderInfo.heading,
          )}
        </Text>
      </Box>
      <BlueBox>
        <Box marginBottom={2}>
          <Select
            name="defenderName"
            icon="search"
            options={lawyers.lawyers.map((l) => {
              return { label: `${l.name} (${l.practice})`, value: l.email }
            })}
            label={formatMessage(
              isRestrictionCase(workingCase.type)
                ? accused.sections.defenderInfo.name.label
                : defendant.sections.defenderInfo.name.label,
            )}
            placeholder={formatMessage(
              isRestrictionCase(workingCase.type)
                ? accused.sections.defenderInfo.name.placeholder
                : defendant.sections.defenderInfo.name.placeholder,
            )}
            defaultValue={
              workingCase.defenderName
                ? {
                    label: workingCase.defenderName ?? '',
                    value: workingCase.defenderEmail ?? '',
                  }
                : undefined
            }
            onChange={handleDefenderChange}
            isCreatable
          />
        </Box>
        <Box marginBottom={2}>
          <Input
            data-testid="defenderEmail"
            name="defenderEmail"
            autoComplete="off"
            label={formatMessage(
              isRestrictionCase(workingCase.type)
                ? accused.sections.defenderInfo.email.label
                : defendant.sections.defenderInfo.email.label,
            )}
            placeholder={formatMessage(
              isRestrictionCase(workingCase.type)
                ? accused.sections.defenderInfo.email.placeholder
                : defendant.sections.defenderInfo.email.placeholder,
            )}
            value={workingCase.defenderEmail}
            errorMessage={defenderEmailErrorMessage}
            hasError={defenderEmailErrorMessage !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'defenderEmail',
                event,
                ['email-format'],
                workingCase,
                setWorkingCase,
                defenderEmailErrorMessage,
                setDefenderEmailErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'defenderEmail',
                event.target.value,
                ['email-format'],
                workingCase,
                updateCase,
                setDefenderEmailErrorMessage,
              )
            }
          />
        </Box>
        <Box marginBottom={2}>
          <InputMask
            mask="999-9999"
            maskPlaceholder={null}
            value={workingCase.defenderPhoneNumber}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'defenderPhoneNumber',
                event,
                ['phonenumber'],
                workingCase,
                setWorkingCase,
                defenderPhoneNumberErrorMessage,
                setDefenderPhoneNumberErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'defenderPhoneNumber',
                event.target.value,
                ['phonenumber'],
                workingCase,
                updateCase,
                setDefenderPhoneNumberErrorMessage,
              )
            }
          >
            <Input
              data-testid="defenderPhoneNumber"
              name="defenderPhoneNumber"
              autoComplete="off"
              label={formatMessage(
                isRestrictionCase(workingCase.type)
                  ? accused.sections.defenderInfo.phoneNumber.label
                  : defendant.sections.defenderInfo.phoneNumber.label,
              )}
              placeholder={formatMessage(
                isRestrictionCase(workingCase.type)
                  ? accused.sections.defenderInfo.phoneNumber.placeholder
                  : defendant.sections.defenderInfo.phoneNumber.placeholder,
              )}
              errorMessage={defenderPhoneNumberErrorMessage}
              hasError={defenderPhoneNumberErrorMessage !== ''}
            />
          </InputMask>
        </Box>
        <Checkbox
          name="sendRequestToDefender"
          label={formatMessage(
            isRestrictionCase(workingCase.type)
              ? accused.sections.defenderInfo.sendRequest.label
              : defendant.sections.defenderInfo.sendRequest.label,
          )}
          tooltip={
            isRestrictionCase(workingCase.type)
              ? formatMessage(
                  accused.sections.defenderInfo.sendRequest.tooltip,
                  {
                    caseType:
                      workingCase.type === CaseType.CUSTODY
                        ? 'gæsluvarðhaldskröfuna'
                        : 'farbannskröfuna',
                  },
                )
              : formatMessage(
                  defendant.sections.defenderInfo.sendRequest.tooltip,
                )
          }
          checked={workingCase.sendRequestToDefender}
          onChange={(event) => setAndSendToServer(event.target)}
          large
          filled
        />
      </BlueBox>
    </>
  )
}

export default DefenderInfo
