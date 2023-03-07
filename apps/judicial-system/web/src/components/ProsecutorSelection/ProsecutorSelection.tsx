import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { OptionsType, ValueType } from 'react-select'

import { Select, Option } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  UserContext,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { ProsecutorSelectionUsersQuery } from './prosecutorSelectionUsersGql'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './ProsecutorSelection.strings'

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

  const { data, loading } = useQuery(ProsecutorSelectionUsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const availableProsecutors: OptionsType<Option> = useMemo(() => {
    return data?.users
      .filter(
        (aUser: User) =>
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
