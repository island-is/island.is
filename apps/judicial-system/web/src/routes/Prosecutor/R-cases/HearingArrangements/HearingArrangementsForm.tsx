import React from 'react'
import { Case, Institution, User } from '@island.is/judicial-system/types'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { Box, Text } from '@island.is/island-ui/core'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import RequestedCourtDate from '../../SharedComponents/RequestedCourtDate/RequestedCourtDate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  courts: Institution[]
}

const HearingArrangementsForms: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, prosecutors, courts } = props
  const validations: FormSettings = {
    requestedCourtDate: {
      validations: ['empty'],
    },
    prosecutorId: {
      validations: ['empty'],
    },
    courtId: {
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
            Óskir um fyrirtöku
          </Text>
        </Box>
        {prosecutors && (
          <Box component="section" marginBottom={5}>
            <SelectProsecutor
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              prosecutors={prosecutors}
            />
          </Box>
        )}
        {courts && (
          <Box component="section" marginBottom={5}>
            <SelectCourt
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              courts={courts}
            />
          </Box>
        )}
        <Box component="section" marginBottom={10}>
          <RequestedCourtDate
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={Constants.NEW_R_CASE_ROUTE}
          nextUrl={`${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
          nextIsLoading={false}
        />
      </FormContentContainer>
    </>
  )
}

export default HearingArrangementsForms
