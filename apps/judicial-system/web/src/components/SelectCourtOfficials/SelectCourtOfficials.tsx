import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Text, Tooltip, Select, Option } from '@island.is/island-ui/core'
import { Case, User, UserRole } from '@island.is/judicial-system/types'

import { selectCourtOfficials as strings } from './SelectCourtOfficials.strings'
import { ReactSelectOption } from '../../types'

interface Props {
  workingCase: Case
  handleJudgeChange: (value: ValueType<ReactSelectOption>) => void
  handleRegistrarChange: (value: ValueType<ReactSelectOption>) => void
  users?: User[]
}

const SelectCourtOfficials: React.FC<Props> = (props) => {
  const { workingCase, handleJudgeChange, handleRegistrarChange, users } = props
  const { formatMessage } = useIntl()

  const judges = (users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.id === workingCase.court?.id,
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

  return (
    <>
      <Box marginBottom={2}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            {`${formatMessage(strings.setJudgeTitle)} `}
            <Tooltip text={formatMessage(strings.setJudgeTooltip)} />
          </Text>
        </Box>
        <Select
          name="judge"
          label={formatMessage(strings.setJudgeLabel)}
          placeholder={formatMessage(strings.setJudgePlaceholder)}
          value={defaultJudge}
          options={judges}
          onChange={(selectedOption: ValueType<ReactSelectOption>) =>
            handleJudgeChange(selectedOption)
          }
          required
        />
      </Box>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {`${formatMessage(strings.setRegistrarTitle)} `}
          <Tooltip text={formatMessage(strings.setRegistrarTooltip)} />
        </Text>
      </Box>
      <Select
        name="registrar"
        label={formatMessage(strings.setRegistrarLabel)}
        placeholder={formatMessage(strings.setRegistrarPlaceholder)}
        value={defaultRegistrar}
        options={registrars}
        onChange={(selectedOption: ValueType<ReactSelectOption>) => {
          if (selectedOption) {
            handleRegistrarChange(selectedOption)
          } else {
            handleRegistrarChange(undefined)
          }
        }}
        isClearable
      />
    </>
  )
}

export default SelectCourtOfficials
