import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Select, Option, Tooltip } from '@island.is/island-ui/core'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  User,
  UserRole,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { selectCourtOfficials as strings } from './SelectCourtOfficials.strings'
import { ReactSelectOption } from '../../types'
import BlueBox from '../BlueBox/BlueBox'
import SectionHeading from '../SectionHeading/SectionHeading'

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
        (user.role === UserRole.Judge ||
          (workingCase.type === CaseType.Indictment &&
            user.role === UserRole.Assistant)) &&
        user.institution?.id === workingCase.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id, judge }
    })

  const registrars = (users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.Registrar &&
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
      <SectionHeading
        title={formatMessage(strings.title)}
        tooltip={
          <Tooltip text={formatMessage(strings.tooltip)} placement="right" />
        }
      />
      <BlueBox>
        <Box marginBottom={2}>
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
      </BlueBox>
    </>
  )
}

export default SelectCourtOfficials
