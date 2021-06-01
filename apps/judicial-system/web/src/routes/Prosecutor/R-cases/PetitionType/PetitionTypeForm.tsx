import React, { useState } from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { Case } from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const PetitionTypeForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const [petitionDescriptionEM, setPetitionDescriptionEM] = useState<string>('')
  const { updateCase } = useCase()

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Rannsóknarheimild
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Efni kröfu
          </Text>
        </Box>
        <Input
          data-testid="petition-description"
          name="petition-description"
          label="Efni kröfu"
          placeholder="Skráðu efni kröfu"
          defaultValue={''}
          errorMessage={petitionDescriptionEM}
          hasError={petitionDescriptionEM !== ''}
          onChange={(event) =>
            removeTabsValidateAndSet(
              'petitionDescription',
              event,
              ['empty'],
              workingCase,
              setWorkingCase,
              petitionDescriptionEM,
              setPetitionDescriptionEM,
            )
          }
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
      </Box>
    </FormContentContainer>
  )
}

export default PetitionTypeForm
