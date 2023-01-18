import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { OptionsType, ValueType } from 'react-select'

import { Select, Option } from '@island.is/island-ui/core'
import { isIndictmentCase, UserRole } from '@island.is/judicial-system/types'
import {
  UserContext,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { strings } from './ProsecutorSelection.strings'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { ProsecutorSelectionUsersGql } from './prosecutorSelectionUsersGql'
import { ProsecutorSelectionUsersQuery } from '../../graphql/schema'
import type { User } from '../../graphql/schema'

interface Props {
  onChange: (prosecutorId: string) => boolean
}

const ProsecutorSelection: React.FC<Props> = (props) => {
  const { onChange } = props
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase } = useContext(FormContext)

  const selectedProsecutor = useMemo(() => {
    return workingCase.prosecutor
      ? {
          label: workingCase.prosecutor.name,
          value: workingCase.prosecutor.id,
        }
      : undefined
  }, [workingCase.prosecutor])

  const { data, loading } = useQuery<ProsecutorSelectionUsersQuery>(
    ProsecutorSelectionUsersGql,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const availableProsecutors: OptionsType<Option> | undefined = useMemo(() => {
    return (data?.users as User[])
      .filter(
        (aUser) =>
          aUser.role === UserRole.Prosecutor &&
          ((!workingCase.creatingProsecutor &&
            aUser.institution?.id === user?.institution?.id) ||
            (workingCase.creatingProsecutor &&
              aUser.institution?.id ===
                workingCase.creatingProsecutor?.institution?.id)),
      )
      .map((prosecutor: User) => ({
        label: prosecutor.name,
        value: prosecutor.id,
      }))
  }, [data?.users, user?.institution?.id, workingCase.creatingProsecutor])

  return (
    <Select
      name="prosecutor"
      label={formatMessage(strings.label, {
        isIndictmentCase: isIndictmentCase(workingCase.type),
      })}
      placeholder={formatMessage(strings.placeholder, {
        isIndictmentCase: isIndictmentCase(workingCase.type),
      })}
      value={selectedProsecutor}
      options={availableProsecutors}
      onChange={(value: ValueType<Option>) => {
        const id = (value as ReactSelectOption).value
        if (id && typeof id === 'string') {
          onChange(id)
        }
      }}
      disabled={loading}
      required
    />
  )
}

export default ProsecutorSelection
