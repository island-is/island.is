import React from 'react'
import { Case, Institution, User } from '@island.is/judicial-system/types'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import { Box, Text } from '@island.is/island-ui/core'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors?: ReactSelectOption[]
  courts?: Institution[]
}

const HearingArrangementsForms: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, prosecutors, courts } = props

  return (
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
    </FormContentContainer>
  )
}

export default HearingArrangementsForms
