import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { Accused, Case, CaseGender } from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/shared-components'
import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import * as styles from './DefendantInfo.treat'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  accused: Accused
  index: number
}

const DefendantInfo: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, accused, index } = props
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

  const updateAccused = () => {
    const accusedWithoutTypename = workingCase.accused.map(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ({ __typename, ...keepAttrs }) => keepAttrs,
    )

    updateCase(workingCase.id, parseString('accused', accusedWithoutTypename))
  }

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
              id={`genderMale${index}`}
              label={formatMessage(core.male)}
              value={CaseGender.MALE}
              checked={accused.gender === CaseGender.MALE}
              onChange={() => {
                const accusedCopy = workingCase.accused

                accusedCopy[accusedCopy.indexOf(accused)].gender =
                  CaseGender.MALE

                setWorkingCase({ ...workingCase, accused: accusedCopy })
                updateAccused()
              }}
              large
              backgroundColor="white"
            />
          </Box>
          <Box className={styles.genderColumn}>
            <RadioButton
              name="accusedGender"
              id={`genderFemale${index}`}
              label={formatMessage(core.female)}
              value={CaseGender.FEMALE}
              checked={accused.gender === CaseGender.FEMALE}
              onChange={() => {
                const accusedCopy = workingCase.accused

                accusedCopy[accusedCopy.indexOf(accused)].gender =
                  CaseGender.FEMALE

                setWorkingCase({ ...workingCase, accused: accusedCopy })
                updateAccused()
              }}
              large
              backgroundColor="white"
            />
          </Box>
          <Box className={styles.genderColumn}>
            <RadioButton
              name="accusedGender"
              id={`genderOther${index}`}
              label={formatMessage(core.otherGender)}
              value={CaseGender.OTHER}
              checked={accused.gender === CaseGender.OTHER}
              onChange={() => {
                const accusedCopy = workingCase.accused

                accusedCopy[accusedCopy.indexOf(accused)].gender =
                  CaseGender.OTHER

                setWorkingCase({ ...workingCase, accused: accusedCopy })
                updateAccused()
              }}
              large
              backgroundColor="white"
            />
          </Box>
        </Box>
        <Box marginBottom={2}>
          <InputMask
            mask="999999-9999"
            maskPlaceholder={null}
            onChange={(event) => {
              const accusedCopy = workingCase.accused

              accusedCopy[accusedCopy.indexOf(accused)].nationalId =
                event.target.value

              setWorkingCase({ ...workingCase, accused: accusedCopy })
            }}
            onBlur={(event) => {
              if (!validate(event.target.value, 'empty').isValid) {
                setNationalIdErrorMessage(
                  validate(event.target.value, 'empty').errorMessage,
                )
              } else if (!validate(event.target.value, 'national-id').isValid) {
                setNationalIdErrorMessage(
                  validate(event.target.value, 'national-id').errorMessage,
                )
              } else {
                setNationalIdErrorMessage('')
                updateAccused()
              }
            }}
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
            onChange={(event) => {
              const accusedCopy = workingCase.accused

              accusedCopy[accusedCopy.indexOf(accused)].name =
                event.target.value

              setWorkingCase({ ...workingCase, accused: accusedCopy })
            }}
            onBlur={(event) => {
              if (validate(event.target.value, 'empty').isValid) {
                setAccusedNameErrorMessage('')
                updateAccused()
              } else {
                setAccusedNameErrorMessage(
                  validate(event.target.value, 'empty').errorMessage,
                )
              }
            }}
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
          onChange={(event) => {
            const accusedCopy = workingCase.accused

            accusedCopy[accusedCopy.indexOf(accused)].address =
              event.target.value

            setWorkingCase({ ...workingCase, accused: accusedCopy })
          }}
          onBlur={(event) => {
            if (validate(event.target.value, 'empty').isValid) {
              setAccusedAddressErrorMessage('')
              updateAccused()
            } else {
              setAccusedAddressErrorMessage(
                validate(event.target.value, 'empty').errorMessage,
              )
            }
          }}
          required
        />
      </BlueBox>
    </motion.div>
  )
}

export default DefendantInfo
