import React, { useState } from 'react'
import { ValueType } from 'react-select/src/types'
import { Box, Input, Select, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseType,
  RCaseTypes,
  ReadableCaseType,
} from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'
import DefendantInfo from '../../SharedComponents/DefendantInfo/DefendantInfo'
import { theme } from '@island.is/island-ui/theme'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'
import { capitalize } from '@island.is/judicial-system/formatters'
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
    description: {
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
  const [petitionDescriptionEM, setPetitionDescriptionEM] = useState<string>('')
  const { updateCase } = useCase()
  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Rannsóknarheimild
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
              Efni kröfu
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={3}>
              <Select
                name="petition-type"
                options={RCaseTypes as ReactSelectOption[]}
                label="Tegund kröfu"
                placeholder="Veldu tegund kröfu"
                onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                  setAndSendToServer(
                    'type',
                    (selectedOption as ReactSelectOption).value as string,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
                defaultValue={{
                  value: CaseType[workingCase.type],
                  label: capitalize(ReadableCaseType[workingCase.type]),
                }}
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
              data-testid="petition-description"
              name="petition-description"
              label="Efni kröfu"
              placeholder="Skráðu efni kröfu"
              defaultValue={workingCase.description}
              errorMessage={petitionDescriptionEM}
              hasError={petitionDescriptionEM !== ''}
              onChange={(event) => {
                removeTabsValidateAndSet(
                  'description',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  petitionDescriptionEM,
                  setPetitionDescriptionEM,
                )
              }}
              onBlur={(event) =>
                validateAndSendToServer(
                  'description',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setPetitionDescriptionEM,
                )
              }
              required
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Varnaraðili
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
