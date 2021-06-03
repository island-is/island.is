import React, { useState } from 'react'
import { Box, Input, Select, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'
import DefendantInfo from '../../SharedComponents/DefendantInfo/DefendantInfo'
import { petitionTypes } from './PetitionTypes'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const DefendantForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const [petitionDescriptionEM, setPetitionDescriptionEM] = useState<string>('')
  const { updateCase } = useCase()

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Varnaraðili
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Málsnúmer lögreglu
          </Text>
        </Box>
        <LokeCaseNumber
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          policeCaseNumberErrorMessage={'' /**TODO */}
        />
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Efni kröfu
          </Text>
        </Box>
        <BlueBox>
          <Box marginBottom={2}>
            <Select
              name="petition-type"
              options={petitionTypes}
              label="Tegund kröfu"
              placeholder="Veldu tegund kröfu"
              required
            />
          </Box>
          <Input
            data-testid="petition-description"
            name="petition-description"
            label="Efni kröfu"
            placeholder="Skráðu efni kröfu"
            defaultValue={''}
            errorMessage={petitionDescriptionEM}
            hasError={petitionDescriptionEM !== ''}
            onChange={(event) => {
              workingCase.id &&
                removeTabsValidateAndSet(
                  'petitionDescription',
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
                'petitionDescription',
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
      <Box component="section" marginBottom={5}>
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
  )
}

export default DefendantForm
