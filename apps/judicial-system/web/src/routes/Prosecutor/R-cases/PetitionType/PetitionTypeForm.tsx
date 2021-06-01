import React, { useState } from 'react'
import { Box, Input, Select, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { Case } from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { petitionTypes } from './PetitionTypes'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const PetitionTypeForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const [petitionDescriptionEM, setPetitionDescriptionEM] = useState<string>('')
  const { updateCase } = useCase()

  return (
    <>
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
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.REQUEST_LIST_ROUTE}
          onNextButtonClick={() => console.log('hero')}
          nextIsLoading={false}
          nextIsDisabled={false}
          nextButtonText={
            workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
          }
        />
      </FormContentContainer>
    </>
  )
}

export default PetitionTypeForm
