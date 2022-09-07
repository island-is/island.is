import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import { Case, isIndictmentCase, User } from '@island.is/judicial-system/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'

import { receptionAndAssignmentForm as strings } from './ReceptionAndAssignmentForm.strings'
import FormContentContainer from '../FormContentContainer/FormContentContainer'
import CourtCaseNumber from '../../routes/Court/components/CourtCaseNumber/CourtCaseNumber'
import SelectCourtOfficials from '../SelectCourtOfficials/SelectCourtOfficials'
import { ReactSelectOption } from '../../types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  onCreateCourtCase: (workingCase: Case) => void
  isCreatingCourtCase: boolean
  onReceiveCase: (workingCase: Case, courtCaseNumber: string) => Promise<void>
  onJudgeChange: (judge: User) => void
  onRegistrarChange: (registrar: User) => void
  users?: User[]
}

type JudgeSelectOption = ReactSelectOption & { judge: User }
type RegistrarSelectOption = ReactSelectOption & { registrar: User }

const ReceptionAndAssignmentForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    courtCaseNumberEM,
    setCourtCaseNumberEM,
    createCourtCaseSuccess,
    setCreateCourtCaseSuccess,
    onCreateCourtCase,
    isCreatingCourtCase,
    onReceiveCase,
    onJudgeChange,
    onRegistrarChange,
    users,
  } = props
  const { formatMessage } = useIntl()

  return (
    <FormContentContainer>
      {isIndictmentCase(workingCase.type) && workingCase.comments && (
        <Box marginBottom={5}>
          <AlertMessage message={workingCase.comments} type="warning" />
        </Box>
      )}
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          {formatMessage(strings.title)}
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
          handleCreateCourtCase={onCreateCourtCase}
          isCreatingCourtCase={isCreatingCourtCase}
          receiveCase={onReceiveCase}
        />
      </Box>
      <Box component="section" marginBottom={10}>
        <SelectCourtOfficials
          workingCase={workingCase}
          handleJudgeChange={(selectedOption: ValueType<ReactSelectOption>) =>
            onJudgeChange((selectedOption as JudgeSelectOption).judge)
          }
          handleRegistrarChange={(
            selectedOption: ValueType<ReactSelectOption>,
          ) =>
            onRegistrarChange(
              (selectedOption as RegistrarSelectOption)?.registrar,
            )
          }
          users={users}
        />
      </Box>
    </FormContentContainer>
  )
}

export default ReceptionAndAssignmentForm
