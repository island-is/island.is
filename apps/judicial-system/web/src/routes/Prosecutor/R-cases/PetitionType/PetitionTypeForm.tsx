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
import { ValueType } from 'react-select'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const PetitionTypeForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const [petitionDescriptionEM, setPetitionDescriptionEM] = useState<string>('')
  const [petitionType, setPetitionType] = useState<string>()
  const [petitionDescription, setPetitionDescription] = useState<string>()
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
                onChange={(evt: ValueType<ReactSelectOption>) => {
                  setPetitionType((evt as ReactSelectOption).value as string)
                }}
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
                workingCase.id
                  ? validateAndSendToServer(
                      'petitionDescription',
                      event.target.value,
                      ['empty'],
                      workingCase,
                      updateCase,
                      setPetitionDescriptionEM,
                    )
                  : setPetitionDescription(event.target.value)
              }
              required
            />
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.REQUEST_LIST_ROUTE}
          nextUrl={`${constants.R_CASE_DEFENDANT_ROUTE}?tegund_krofu=${petitionType}?efni_krofu=${petitionDescription}`}
          nextIsLoading={false}
          nextIsDisabled={false}
        />
      </FormContentContainer>
    </>
  )
}

export default PetitionTypeForm
