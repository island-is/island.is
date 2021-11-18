import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'
import { Box, Checkbox, Input, Select, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { ICaseTypes } from '@island.is/judicial-system/consts'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'
import DefendantInfo from '../../SharedComponents/DefendantInfo/DefendantInfo'
import { theme } from '@island.is/island-ui/theme'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import { defendant as m } from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'
import { setAndSendToServer as setSelectAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  handleNextButtonClick: (theCase: Case) => void
  isLoading: boolean
}

const DefendantForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    handleNextButtonClick,
    isLoading,
  } = props

  const [
    defenderEmailErrorMessage,
    setDefenderEmailErrorMessage,
  ] = useState<string>('')

  const [
    defenderPhoneNumberErrorMessage,
    setDefenderPhoneNumberErrorMessage,
  ] = useState<string>('')

  const validations: FormSettings = {
    policeCaseNumber: {
      validations: ['empty', 'police-casenumber-format'],
    },
    type: {
      validations: ['empty'],
    },
    accusedGender: {
      validations: ['empty'],
    },
    accusedNationalId: {
      validations: ['empty', 'national-id'],
    },
    accusedName: {
      validations: ['empty'],
    },
    accusedAddress: {
      validations: ['empty'],
    },
  }

  const { updateCase } = useCase()
  const { formatMessage } = useIntl()
  const {
    isValid,
    setField,
    validateAndSendToServer,
    setAndSendToServer,
  } = useCaseFormHelper(workingCase, setWorkingCase, validations)

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={10}>
          <Box marginBottom={7}>
            <Text as="h1" variant="h1">
              {formatMessage(m.heading)}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <LokeCaseNumber
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.investigationType.heading)}
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                <Select
                  name="type"
                  options={ICaseTypes as ReactSelectOption[]}
                  label={formatMessage(m.sections.investigationType.type.label)}
                  placeholder={formatMessage(
                    m.sections.investigationType.type.placeholder,
                  )}
                  onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                    setSelectAndSendToServer(
                      'type',
                      (selectedOption as ReactSelectOption).value as string,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }
                  defaultValue={
                    workingCase?.id
                      ? {
                          value: CaseType[workingCase.type],
                          label: capitalize(caseTypes[workingCase.type]),
                        }
                      : undefined
                  }
                  formatGroupLabel={() => (
                    <div
                      style={{
                        width: 'calc(100% + 24px)',
                        height: '3px',
                        marginLeft: '-12px',
                        backgroundColor: theme.color.dark300,
                      }}
                    />
                  )}
                  required
                />
              </Box>
              <Input
                data-testid="description"
                name="description"
                label={formatMessage(
                  m.sections.investigationType.description.label,
                )}
                placeholder={formatMessage(
                  m.sections.investigationType.description.placeholder,
                )}
                defaultValue={workingCase.description}
                autoComplete="off"
                onChange={(event) => {
                  setField(event.target)
                }}
                onBlur={(event) => validateAndSendToServer(event.target)}
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.defendantInfo.heading)}
              </Text>
            </Box>
            <DefendantInfo
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          </Box>
          <AnimatePresence>
            {[
              CaseType.RESTRAINING_ORDER,
              CaseType.PSYCHIATRIC_EXAMINATION,
              CaseType.OTHER,
            ].includes(workingCase.type) && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="baseline"
                  marginBottom={2}
                >
                  <Text as="h3" variant="h3">
                    {formatMessage(m.sections.defenderInfo.heading)}
                  </Text>
                </Box>
                <BlueBox>
                  <Box marginBottom={2}>
                    <Input
                      data-testid="defenderName"
                      name="defenderName"
                      autoComplete="off"
                      label={formatMessage(m.sections.defenderInfo.name.label)}
                      placeholder={formatMessage(
                        m.sections.defenderInfo.name.placeholder,
                      )}
                      defaultValue={workingCase.defenderName}
                      onChange={(event) => setField(event.target)}
                      onBlur={(event) => validateAndSendToServer(event.target)}
                    />
                  </Box>
                  <Box marginBottom={2}>
                    <Input
                      data-testid="defenderEmail"
                      name="defenderEmail"
                      autoComplete="off"
                      label={formatMessage(m.sections.defenderInfo.email.label)}
                      placeholder={formatMessage(
                        m.sections.defenderInfo.email.placeholder,
                      )}
                      defaultValue={workingCase.defenderEmail}
                      errorMessage={defenderEmailErrorMessage}
                      hasError={defenderEmailErrorMessage !== ''}
                      onChange={(event) => setField(event.target)}
                      onBlur={(event) => validateAndSendToServer(event.target)}
                    />
                  </Box>
                  <Box marginBottom={2}>
                    <InputMask
                      mask="999-9999"
                      maskPlaceholder={null}
                      onChange={(event) => setField(event.target)}
                      onBlur={(event) => validateAndSendToServer(event.target)}
                    >
                      <Input
                        data-testid="defenderPhoneNumber"
                        name="defenderPhoneNumber"
                        autoComplete="off"
                        label={formatMessage(
                          m.sections.defenderInfo.phoneNumber.label,
                        )}
                        placeholder={formatMessage(
                          m.sections.defenderInfo.phoneNumber.placeholder,
                        )}
                        defaultValue={workingCase.defenderPhoneNumber}
                        errorMessage={defenderPhoneNumberErrorMessage}
                        hasError={defenderPhoneNumberErrorMessage !== ''}
                      />
                    </InputMask>
                  </Box>
                  <Checkbox
                    name="sendRequestToDefender"
                    label={formatMessage(
                      m.sections.defenderInfo.sendRequest.label,
                    )}
                    tooltip={formatMessage(
                      m.sections.defenderInfo.sendRequest.tooltip,
                    )}
                    checked={workingCase.sendRequestToDefender}
                    onChange={(event) => setAndSendToServer(event.target)}
                    large
                    filled
                  />
                </BlueBox>
              </motion.section>
            )}
          </AnimatePresence>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.REQUEST_LIST_ROUTE}`}
          onNextButtonClick={() => handleNextButtonClick(workingCase)}
          nextIsDisabled={!isValid}
          nextIsLoading={isLoading}
          nextButtonText={
            workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
          }
        />
      </FormContentContainer>
    </>
  )
}

export default DefendantForm
