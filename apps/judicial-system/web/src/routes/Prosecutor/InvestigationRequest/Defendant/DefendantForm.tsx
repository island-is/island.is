import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'
import { Box, Input, Select, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { ICaseTypes } from '@island.is/judicial-system/consts'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
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
import { defendant } from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'
interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
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
  const { isValid, setField, validateAndSendToServer } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(defendant.heading)}
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
              {formatMessage(defendant.sections.investigationType.heading)}
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={3}>
              <Select
                name="type"
                options={ICaseTypes as ReactSelectOption[]}
                label={formatMessage(
                  defendant.sections.investigationType.type.label,
                )}
                placeholder={formatMessage(
                  defendant.sections.investigationType.type.placeholder,
                )}
                onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                  setAndSendToServer(
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
                defendant.sections.investigationType.description.label,
              )}
              placeholder={formatMessage(
                defendant.sections.investigationType.description.placeholder,
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
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(defendant.sections.defendantInfo.heading)}
            </Text>
          </Box>
          <DefendantInfo
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
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
