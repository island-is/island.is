import React from 'react'
import { useIntl } from 'react-intl'
import { SingleValue } from 'react-select'

import { Box, Select, Tooltip } from '@island.is/island-ui/core'
import {
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { ReactSelectOption, TempCase as Case } from '../../types'
import BlueBox from '../BlueBox/BlueBox'
import SectionHeading from '../SectionHeading/SectionHeading'
import { selectCourtOfficials as strings } from './SelectCourtOfficials.strings'

interface Props {
  workingCase: Case
  handleJudgeChange(value: SingleValue<ReactSelectOption>): void
  handleRegistrarChange(value?: ReactSelectOption): void
  users?: User[]
}

const SelectCourtOfficials: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { workingCase, handleJudgeChange, handleRegistrarChange, users } = props
  const { formatMessage } = useIntl()

  const judges = (users ?? [])
    .filter(
      (user: User) =>
        (user.role === UserRole.DISTRICT_COURT_JUDGE ||
          (workingCase.type === CaseType.INDICTMENT &&
            user.role === UserRole.DISTRICT_COURT_ASSISTANT)) &&
        user.institution?.id === workingCase.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id, judge }
    })

  const registrars = (users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.DISTRICT_COURT_REGISTRAR &&
        user.institution?.id === workingCase.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id, registrar }
    })

  const defaultJudge = judges?.find(
    (judge) => judge.value === workingCase.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar) => registrar.value === workingCase.registrar?.id,
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
            onChange={handleJudgeChange}
            required
          />
        </Box>
        <Select
          name="registrar"
          label={formatMessage(strings.setRegistrarLabel)}
          placeholder={formatMessage(strings.setRegistrarPlaceholder)}
          value={defaultRegistrar}
          options={registrars}
          onChange={(selectedOption) => {
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
