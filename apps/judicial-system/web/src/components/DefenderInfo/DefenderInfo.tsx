import React, { useContext, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import lawyers from '@island.is/judicial-system-web/src/utils/lawyerScraper/db.json'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  Case,
  CaseType,
  isInvestigationCase,
  isRestrictionCase,
  UserRole,
} from '@island.is/judicial-system/types'
import { accused } from '@island.is/judicial-system-web/messages'
import { defendant } from '@island.is/judicial-system-web/messages'
import { rcHearingArrangements } from '@island.is/judicial-system-web/messages'
import { icHearingArrangements } from '@island.is/judicial-system-web/messages'

import { BlueBox } from '..'
import { useCase } from '../../utils/hooks'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
  setAndSendToServer as setAndSendDefenderTypeToServer,
} from '../../utils/formHelper'
import { UserContext } from '../UserProvider/UserProvider'

import * as styles from './DefenderInfo.css'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  setAndSendToServer?: (element: HTMLInputElement) => Promise<void>
}

const DefenderInfo: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, setAndSendToServer } = props
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()
  const { user } = useContext(UserContext)

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

  const getTranslations = () => {
    if (isRestrictionCase(workingCase.type)) {
      if (user?.role === UserRole.PROSECUTOR) {
        return {
          title: accused.sections.defenderInfo.heading,
          defenderName: {
            label: accused.sections.defenderInfo.name.label,
            placeholder: accused.sections.defenderInfo.name.placeholder,
          },
          defenderEmail: {
            label: accused.sections.defenderInfo.email.label,
            placeholder: accused.sections.defenderInfo.email.placeholder,
          },
          defenderPhoneNumber: {
            label: accused.sections.defenderInfo.phoneNumber.label,
            placeholder: accused.sections.defenderInfo.phoneNumber.placeholder,
          },
        }
      } else {
        return {
          title: rcHearingArrangements.sections.defender.title,
          defenderName: {
            label: rcHearingArrangements.sections.defender.nameLabel,
            placeholder:
              rcHearingArrangements.sections.defender.namePlaceholder,
          },
          defenderEmail: {
            label: rcHearingArrangements.sections.defender.emailLabel,
            placeholder:
              rcHearingArrangements.sections.defender.emailPlaceholder,
          },
          defenderPhoneNumber: {
            label: rcHearingArrangements.sections.defender.phoneNumberLabel,
            placeholder:
              rcHearingArrangements.sections.defender.phoneNumberPlaceholder,
          },
        }
      }
    } else {
      if (user?.role === UserRole.PROSECUTOR) {
        return {
          title: defendant.sections.defenderInfo.heading,
          defenderName: {
            label: defendant.sections.defenderInfo.name.label,
            placeholder: defendant.sections.defenderInfo.name.placeholder,
          },
          defenderEmail: {
            label: defendant.sections.defenderInfo.email.label,
            placeholder: defendant.sections.defenderInfo.email.placeholder,
          },
          defenderPhoneNumber: {
            label: defendant.sections.defenderInfo.phoneNumber.label,
            placeholder:
              defendant.sections.defenderInfo.phoneNumber.placeholder,
          },
        }
      } else {
        return {
          title: icHearingArrangements.sections.defender.title,
          defenderName: {
            label: icHearingArrangements.sections.defender.nameLabel,
            placeholder:
              icHearingArrangements.sections.defender.namePlaceholder,
          },
          defenderEmail: {
            label: icHearingArrangements.sections.defender.emailLabel,
            placeholder:
              icHearingArrangements.sections.defender.emailPlaceholder,
          },
          defenderPhoneNumber: {
            label: icHearingArrangements.sections.defender.phoneNumberLabel,
            placeholder:
              icHearingArrangements.sections.defender.phoneNumberPlaceholder,
          },
        }
      }
    }
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
          {formatMessage(getTranslations().title)}
        </Text>
      </Box>
      <BlueBox>
        {(user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR) &&
          isInvestigationCase(workingCase.type) && (
            <div className={styles.defenderOptions}>
              <RadioButton
                name="defender-type-defender"
                id="defender-type-defender"
                label="Verjandi"
                checked={workingCase.defenderIsSpokesperson === false}
                onChange={() => {
                  setAndSendDefenderTypeToServer(
                    'defenderIsSpokesperson',
                    false,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                large
                backgroundColor="white"
              />
              <RadioButton
                name="defender-type-spokesperson"
                id="defender-type-spokesperson"
                label="Talsmaður"
                checked={workingCase.defenderIsSpokesperson === true}
                onChange={() => {
                  setAndSendDefenderTypeToServer(
                    'defenderIsSpokesperson',
                    true,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </div>
          )}
        <Box marginBottom={2}>
          <Select
            name="defenderName"
            icon="search"
            options={lawyers.lawyers.map((l) => {
              return {
                label: `${l.name}${l.practice ? ` (${l.practice})` : ''}`,
                value: l.email,
              }
            })}
            label={formatMessage(getTranslations().defenderName.label, {
              defenderType: workingCase.defenderIsSpokesperson
                ? 'talsmanns'
                : 'verjanda',
            })}
            placeholder={formatMessage(
              getTranslations().defenderName.placeholder,
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
            filterConfig={{ matchFrom: 'start' }}
            isCreatable
          />
        </Box>
        <Box marginBottom={2}>
          <Input
            data-testid="defenderEmail"
            name="defenderEmail"
            autoComplete="off"
            label={formatMessage(getTranslations().defenderEmail.label, {
              defenderType: workingCase.defenderIsSpokesperson
                ? 'talsmanns'
                : 'verjanda',
            })}
            placeholder={formatMessage(
              getTranslations().defenderEmail.placeholder,
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
                getTranslations().defenderPhoneNumber.label,
                {
                  defenderType: workingCase.defenderIsSpokesperson
                    ? 'talsmanns'
                    : 'verjanda',
                },
              )}
              placeholder={formatMessage(
                getTranslations().defenderPhoneNumber.placeholder,
              )}
              errorMessage={defenderPhoneNumberErrorMessage}
              hasError={defenderPhoneNumberErrorMessage !== ''}
            />
          </InputMask>
        </Box>
        {user?.role === UserRole.PROSECUTOR && setAndSendToServer && (
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
        )}
      </BlueBox>
    </>
  )
}

export default DefenderInfo
