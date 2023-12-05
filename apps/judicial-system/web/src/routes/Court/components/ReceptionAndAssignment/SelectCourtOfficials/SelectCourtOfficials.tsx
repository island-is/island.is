import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { useSelectCourtOfficialsUsersQuery } from './selectCourtOfficialsUsers.generated'
import { strings } from './SelectCourtOfficials.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type RegistrarSelectOption = ReactSelectOption & { registrar: User }

const SelectCourtOfficials = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendCaseToServer } = useCase()
  const { data: usersData, loading: usersLoading } =
    useSelectCourtOfficialsUsersQuery({
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

  const setJudge = (judge: User) => {
    if (workingCase) {
      setAndSendCaseToServer(
        [{ judgeId: judge.id, force: true }],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const setRegistrar = (registrar?: User) => {
    if (workingCase) {
      setAndSendCaseToServer(
        [{ registrarId: registrar?.id ?? null, force: true }],
        workingCase,
        setWorkingCase,
      )
    }
  }
  const { formatMessage } = useIntl()

  const judges = (usersData?.users ?? [])
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

  const registrars = (usersData?.users ?? [])
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
            onChange={(selectedOption) =>
              setJudge((selectedOption as JudgeSelectOption).judge)
            }
            required
            isDisabled={usersLoading}
          />
        </Box>
        <Select
          name="registrar"
          label={formatMessage(strings.setRegistrarLabel)}
          placeholder={formatMessage(strings.setRegistrarPlaceholder)}
          value={defaultRegistrar}
          options={registrars}
          onChange={(selectedOption) =>
            setRegistrar((selectedOption as RegistrarSelectOption)?.registrar)
          }
          isClearable
          isDisabled={usersLoading}
        />
      </BlueBox>
    </>
  )
}

export default SelectCourtOfficials
