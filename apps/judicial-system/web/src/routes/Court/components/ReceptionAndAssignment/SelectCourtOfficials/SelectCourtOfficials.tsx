import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useUsers,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './SelectCourtOfficials.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type RegistrarSelectOption = ReactSelectOption & { registrar: User }

const SelectCourtOfficials = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase } = useCase()
  const {
    judges,
    registrars,
    loading: usersLoading,
  } = useUsers(workingCase.court?.id)

  const setJudge = async (judgeId: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        judgeId,
      })

      if (!updatedCase) {
        return
      }

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        judge: updatedCase?.judge,
      }))
    }
  }

  const setRegistrar = async (registrarId?: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        registrarId: registrarId ?? null,
      })

      if (!updatedCase) {
        return
      }

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        registrar: updatedCase?.registrar,
      }))
    }
  }

  const { formatMessage } = useIntl()

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
              setJudge((selectedOption as JudgeSelectOption).judge.id)
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
            setRegistrar(
              (selectedOption as RegistrarSelectOption)?.registrar.id,
            )
          }
          isClearable
          isDisabled={usersLoading}
        />
      </BlueBox>
    </>
  )
}

export default SelectCourtOfficials
