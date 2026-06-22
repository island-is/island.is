import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Select, Tooltip } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useUsers,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { strings } from './SelectCourtOfficials.strings'

const SelectCourtOfficials = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase } = useCase()
  const {
    judges,
    registrars,
    loading: usersLoading,
  } = useUsers(workingCase.court?.id)

  const setJudge = async (judgeId?: string) => {
    if (!judgeId) {
      return
    }

    const previousJudge = workingCase.judge
    const selectedJudge = judges?.find((judge) => judge.value === judgeId)?.user

    // Optimistic update so the dropdown reflects the choice immediately
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      judge: selectedJudge,
    }))

    const updatedCase = await updateCase(workingCase.id, {
      judgeId,
    })

    if (!updatedCase) {
      // Revert on error (a toast is already shown inside updateCase)
      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        judge: previousJudge,
      }))
      return
    }

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      judge: updatedCase?.judge,
    }))
  }

  const setRegistrar = async (registrarId?: string) => {
    const previousRegistrar = workingCase.registrar
    const selectedRegistrar = registrars?.find(
      (registrar) => registrar.value === registrarId,
    )?.user

    // Optimistic update so the dropdown reflects the choice immediately
    // (registrarId may be undefined when cleared)
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      registrar: selectedRegistrar,
    }))

    const updatedCase = await updateCase(workingCase.id, {
      registrarId: registrarId ?? null,
    })

    if (!updatedCase) {
      // Revert on error (a toast is already shown inside updateCase)
      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        registrar: previousRegistrar,
      }))
      return
    }

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      registrar: updatedCase?.registrar,
    }))
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
      <BlueBox className={grid({ gap: 2 })}>
        <Select
          name="judge"
          label={formatMessage(strings.setJudgeLabel)}
          placeholder={formatMessage(strings.setJudgePlaceholder)}
          value={defaultJudge}
          options={judges}
          onChange={(selectedOption) => setJudge(selectedOption?.value)}
          required
          isDisabled={
            usersLoading || workingCase.state === CaseState.CORRECTING
          }
        />
        <Select
          name="registrar"
          label={formatMessage(strings.setRegistrarLabel)}
          placeholder={formatMessage(strings.setRegistrarPlaceholder)}
          value={defaultRegistrar}
          options={registrars}
          onChange={(selectedOption) => setRegistrar(selectedOption?.value)}
          isClearable
          isDisabled={
            usersLoading || workingCase.state === CaseState.CORRECTING
          }
        />
      </BlueBox>
    </>
  )
}

export default SelectCourtOfficials
