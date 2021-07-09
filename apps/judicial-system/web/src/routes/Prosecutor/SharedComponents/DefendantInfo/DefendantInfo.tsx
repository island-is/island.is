import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Accused, Case, CaseGender } from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/shared-components'
import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import * as styles from './DefendantInfo.treat'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  accused: Accused
}

const DefendantInfo: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, accused } = props
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>(
    '',
  )

  const [
    accusedNameErrorMessage,
    setAccusedNameErrorMessage,
  ] = useState<string>('')

  const [
    accusedAddressErrorMessage,
    setAccusedAddressErrorMessage,
  ] = useState<string>('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <BlueBox>
        <Box marginBottom={2}>
          <Text as="h4" variant="h4">
            {formatMessage(core.gender)}{' '}
            <Text as="span" color="red600" fontWeight="semiBold">
              *
            </Text>
          </Text>
        </Box>
        <Box marginBottom={2} className={styles.genderContainer}>
          <Box className={styles.genderColumn}>
            <RadioButton
              name="accusedGender"
              id="genderMale"
              label={formatMessage(core.male)}
              value={CaseGender.MALE}
              checked={accused.gender === CaseGender.MALE}
              onChange={() =>
                setAndSendToServer(
                  'accusedGender',
                  CaseGender.MALE,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
              large
              backgroundColor="white"
            />
          </Box>
          <Box className={styles.genderColumn}>
            <RadioButton
              name="accusedGender"
              id="genderFemale"
              label={formatMessage(core.female)}
              value={CaseGender.FEMALE}
              checked={accused.gender === CaseGender.FEMALE}
              onChange={() =>
                setAndSendToServer(
                  'accusedGender',
                  CaseGender.FEMALE,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
              large
              backgroundColor="white"
            />
          </Box>
          <Box className={styles.genderColumn}>
            <RadioButton
              name="accusedGender"
              id="genderOther"
              label={formatMessage(core.otherGender)}
              value={CaseGender.OTHER}
              checked={accused.gender === CaseGender.OTHER}
              onChange={() =>
                setAndSendToServer(
                  'accusedGender',
                  CaseGender.OTHER,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
              large
              backgroundColor="white"
            />
          </Box>
        </Box>
        <Box marginBottom={2}>
          <InputMask
            mask="999999-9999"
            maskPlaceholder={null}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'accusedNationalId',
                event,
                ['empty', 'national-id'],
                workingCase,
                setWorkingCase,
                nationalIdErrorMessage,
                setNationalIdErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'accusedNationalId',
                event.target.value,
                ['empty', 'national-id'],
                workingCase,
                updateCase,
                setNationalIdErrorMessage,
              )
            }
          >
            <Input
              data-testid="nationalId"
              name="accusedNationalId"
              label={formatMessage(core.nationalId)}
              placeholder={formatMessage(core.nationalId)}
              defaultValue={accused.nationalId}
              errorMessage={nationalIdErrorMessage}
              hasError={nationalIdErrorMessage !== ''}
              required
            />
          </InputMask>
        </Box>
        <Box marginBottom={2}>
          <Input
            data-testid="accusedName"
            name="accusedName"
            label={formatMessage(core.fullName)}
            placeholder={formatMessage(core.fullName)}
            defaultValue={accused.name}
            errorMessage={accusedNameErrorMessage}
            hasError={accusedNameErrorMessage !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'accusedName',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
                accusedNameErrorMessage,
                setAccusedNameErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'accusedName',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setAccusedNameErrorMessage,
              )
            }
            required
          />
        </Box>
        <Input
          data-testid="accusedAddress"
          name="accusedAddress"
          label={formatMessage(core.addressOrResidence)}
          placeholder={formatMessage(core.addressOrResidence)}
          defaultValue={accused.address}
          errorMessage={accusedAddressErrorMessage}
          hasError={
            Boolean(accusedAddressErrorMessage) &&
            accusedAddressErrorMessage !== ''
          }
          onChange={(event) =>
            removeTabsValidateAndSet(
              'accusedAddress',
              event,
              ['empty'],
              workingCase,
              setWorkingCase,
              accusedAddressErrorMessage,
              setAccusedAddressErrorMessage,
            )
          }
          onBlur={(event) =>
            validateAndSendToServer(
              'accusedAddress',
              event.target.value,
              ['empty'],
              workingCase,
              updateCase,
              setAccusedAddressErrorMessage,
            )
          }
          required
        />
      </BlueBox>
    </motion.div>
  )
}

export default DefendantInfo
