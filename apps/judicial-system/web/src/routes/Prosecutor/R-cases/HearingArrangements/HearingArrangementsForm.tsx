import React from 'react'
import { Case, User } from '@island.is/judicial-system/types'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import { Box, Text } from '@island.is/island-ui/core'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors?: ReactSelectOption[]
}

const HearingArrangementsForms: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, prosecutors } = props

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Óskir um fyrirtöku
        </Text>
      </Box>
      {prosecutors && (
        <SelectProsecutor
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          prosecutors={prosecutors}
        />
      )}
    </FormContentContainer>
  )
}

export default HearingArrangementsForms
