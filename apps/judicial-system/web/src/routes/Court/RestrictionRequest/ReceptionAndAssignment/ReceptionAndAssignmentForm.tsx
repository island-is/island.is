import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system/types'
import { rcReceptionAndAssignment as m } from '@island.is/judicial-system-web/messages/RestrictionCases/Court/receptionAndAssignment'

import CourtCaseNumber from '../../SharedComponents/CourtCaseNumber/CourtCaseNumber'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  handleCreateCourtCase: (wc: Case) => void
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
  isCreatingCourtCase: boolean
  receiveCase: (wc: Case, courtCaseNumber: string) => void
}

const ReceptionAndAssignementForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    courtCaseNumberEM,
    setCourtCaseNumberEM,
    createCourtCaseSuccess,
    setCreateCourtCaseSuccess,
    handleCreateCourtCase,
    isCreatingCourtCase,
    receiveCase,
  } = props
  const { formatMessage } = useIntl()

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          {formatMessage(m.title)}
        </Text>
      </Box>
      <Box component="section" marginBottom={6}>
        <CourtCaseNumber
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          courtCaseNumberEM={courtCaseNumberEM}
          setCourtCaseNumberEM={setCourtCaseNumberEM}
          createCourtCaseSuccess={createCourtCaseSuccess}
          setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
          handleCreateCourtCase={handleCreateCourtCase}
          isCreatingCourtCase={isCreatingCourtCase}
          receiveCase={receiveCase}
        />
      </Box>
    </FormContentContainer>
  )
}

export default ReceptionAndAssignementForm
