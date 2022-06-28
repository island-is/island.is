import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import { Box, Select, Text, Tooltip, Option } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/components'
import { Case, User, UserRole } from '@island.is/judicial-system/types'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { rcReceptionAndAssignment as m } from '@island.is/judicial-system-web/messages'

import CourtCaseNumber from '../../SharedComponents/CourtCaseNumber/CourtCaseNumber'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type RegistrarSelectOption = ReactSelectOption & { registrar: User }

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
  users?: User[]
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
    users,
  } = props
  const { formatMessage } = useIntl()
  const { autofill } = useCase()

  const judges = (users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id, judge }
    })

  const registrars = (users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.REGISTRAR &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id, registrar }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )

  const setJudge = (judge: User) => {
    if (workingCase) {
      autofill([{ key: 'judgeId', value: judge, force: true }], workingCase)
    }
  }

  const setRegistrar = (registrar?: User) => {
    if (workingCase) {
      autofill(
        [{ key: 'registrarId', value: registrar ?? null, force: true }],
        workingCase,
      )
    }
  }

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
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            {`${formatMessage(m.sections.setJudge.title)} `}
            <Tooltip text={formatMessage(m.sections.setJudge.tooltip)} />
          </Text>
        </Box>
        <Select
          name="judge"
          label="Veldu dómara"
          placeholder="Velja héraðsdómara"
          value={defaultJudge}
          options={judges}
          onChange={(selectedOption: ValueType<ReactSelectOption>) =>
            setJudge((selectedOption as JudgeSelectOption).judge)
          }
          required
        />
      </Box>
      <Box component="section" marginBottom={10}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            {`${formatMessage(m.sections.setRegistrar.title)} `}
            <Tooltip text={formatMessage(m.sections.setRegistrar.tooltip)} />
          </Text>
        </Box>
        <Select
          name="registrar"
          label="Veldu dómritara"
          placeholder="Velja dómritara"
          value={defaultRegistrar}
          options={registrars}
          onChange={(selectedOption: ValueType<ReactSelectOption>) => {
            if (selectedOption) {
              setRegistrar((selectedOption as RegistrarSelectOption).registrar)
            } else {
              setRegistrar(undefined)
            }
          }}
          isClearable
        />
      </Box>
    </FormContentContainer>
  )
}

export default ReceptionAndAssignementForm
