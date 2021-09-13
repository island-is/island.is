import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  Decision,
  RulingInput,
} from '@island.is/judicial-system-web/src/shared-components'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const ConclusionDraft: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  return (
    <>
      <Box marginBottom={2}>
        <Text>
          Hér er hægt að skrifa drög að niðurstöðu í málinu. Endanlegur
          frágangur niðurstöðu og úrskurðar fer fram í þinghaldi. Athugið að
          drögin vistast sjálfkrafa.
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h3">Úrskurður</Text>
      </Box>
      <Box marginBottom={3}>
        <Decision
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          acceptedLabelText={`Krafa ${
            workingCase.type === CaseType.CUSTODY
              ? 'um gæsluvarðhald '
              : workingCase.type === CaseType.TRAVEL_BAN
              ? 'um farbann '
              : ''
          }samþykkt`}
          rejectedLabelText={`Kröfu ${
            workingCase.type === CaseType.CUSTODY
              ? 'um gæsluvarðhald '
              : workingCase.type === CaseType.TRAVEL_BAN
              ? 'um farbann '
              : ''
          }hafnað`}
          partiallyAcceptedLabelText={`${
            workingCase.type === CaseType.CUSTODY ||
            workingCase.type === CaseType.TRAVEL_BAN
              ? 'Kröfu um gæsluvarðhald hafnað en úrskurðað í farbann'
              : 'Krafa tekin til greina að hluta'
          }`}
        />
      </Box>
      <Box marginBottom={3}>
        <Text variant="h3">Drög að niðurstöðu</Text>
      </Box>
      <RulingInput
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isRequired={false}
        rows={12}
      />
    </>
  )
}

export default ConclusionDraft
