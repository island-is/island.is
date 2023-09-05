import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Option, Select } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

import { useProsecutorSelectionUsersQuery } from './prosecutorSelectionUsers.generated'
import { strings } from './ProsecutorSelection.strings'

interface Props {
  onChange: (prosecutorId: string) => boolean
}

const ProsecutorSelection: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
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

  const { data, loading } = useProsecutorSelectionUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const eligibleProsecutors: Option<string>[] = useMemo(() => {
    if (!data?.users) {
      return []
    }

    const institutionId = workingCase.creatingProsecutor
      ? workingCase.creatingProsecutor.institution?.id
      : user?.institution?.id

    return data.users
      .filter(
        (user) =>
          user.role === UserRole.PROSECUTOR &&
          user.institution?.id === institutionId,
      )
      .map(({ id, name }) => ({
        label: name,
        value: id,
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
      options={eligibleProsecutors}
      onChange={(value) => {
        const id = value?.value
        if (id && typeof id === 'string') {
          onChange(id)
        }
      }}
      isDisabled={loading}
      required
    />
  )
}

export default ProsecutorSelection
