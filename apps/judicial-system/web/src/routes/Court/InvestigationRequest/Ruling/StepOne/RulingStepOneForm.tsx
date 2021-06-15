import React, { useContext } from 'react'
import { Case } from '@island.is/judicial-system/types'
import {
  CaseFileList,
  CaseNumbers,
  Decision,
  FormContentContainer,
  FormFooter,
  PoliceRequestAccordionItem,
  RulingInput,
} from '@island.is/judicial-system-web/src/shared-components'
import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const RulingStepOneForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const { user } = useContext(UserContext)

  const validations: FormSettings = {
    ruling: {
      validations: ['empty'],
    },
  }

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
            Úrskurður
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Accordion>
            <PoliceRequestAccordionItem workingCase={workingCase} />
            <AccordionItem
              id="caseFileList"
              label={`Rannsóknargögn (${workingCase.files?.length || 0})`}
              labelVariant="h3"
            >
              <CaseFileList
                caseId={workingCase.id}
                files={workingCase.files || []}
                canOpenFiles={
                  workingCase.judge !== null &&
                  workingCase.judge?.id === user?.id
                }
              />
            </AccordionItem>
          </Accordion>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Úrskurður{' '}
              <Text as="span" fontWeight="semiBold" color="red600">
                *
              </Text>
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Decision
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              acceptedLabelText="Krafa samþykkt"
              rejectedLabelText="Kröfu hafnað"
              partiallyAcceptedLabelText="Krafa tekin til greina að hluta"
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Niðurstaða
            </Text>
          </Box>
          <RulingInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isRequired
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_COURT_RECORD_ROUTE}/${workingCase.id}}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.R_CASE_RULING_STEP_TWO_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid || !workingCase.decision}
        />
      </FormContentContainer>
    </>
  )
}

export default RulingStepOneForm
