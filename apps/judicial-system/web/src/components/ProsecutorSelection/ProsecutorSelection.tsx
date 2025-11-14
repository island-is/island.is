import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { SingleValue } from 'react-select'

import { Option, Select } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { useOnceOn } from '@island.is/judicial-system-web/src/utils/hooks'

import { useProsecutorSelectionUsersQuery } from './prosecutorSelectionUsers.generated'
import { strings } from './ProsecutorSelection.strings'

interface Props {
  onChange: (prosecutorId: string) => void
}

const ProsecutorSelection: FC<Props> = ({ onChange }) => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase, isCaseUpToDate } =
    useContext(FormContext)
  const { user: currentUser } = useContext(UserContext)
  const [caseLoaded, setCaseLoaded] = useState(false)

  const selectedProsecutor = useMemo(() => {
    if (!workingCase.prosecutor && currentUser?.role !== UserRole.PROSECUTOR) {
      return undefined
    }

    const label = workingCase.prosecutor
      ? workingCase.prosecutor.name ?? ''
      : currentUser?.name ?? ''

    const value = workingCase.prosecutor
      ? workingCase.prosecutor.id
      : currentUser?.id

    return { label, value }
  }, [currentUser, workingCase.prosecutor])

  const { data, loading } = useProsecutorSelectionUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const eligibleProsecutors: Option<string>[] = useMemo(() => {
    if (!data?.users) {
      return []
    }

    return data.users
      .filter(
        (user) =>
          user.role === UserRole.PROSECUTOR &&
          user.institution?.id ===
            (workingCase.id
              ? workingCase.prosecutorsOffice?.id
              : currentUser?.institution?.id),
      )
      .map(({ id, name }) => ({
        label: name ?? '',
        value: id,
      }))
  }, [
    currentUser?.institution?.id,
    data?.users,
    workingCase.id,
    workingCase.prosecutorsOffice?.id,
  ])

  const handleUpdate = useCallback(
    (prosecutorId: string) => {
      if (!workingCase.id) {
        const prosecutor = data?.users?.find((p) => p.id === prosecutorId)

        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          prosecutor,
        }))
      } else {
        onChange(prosecutorId)
      }
    },
    [data?.users, onChange, setWorkingCase, workingCase.id],
  )

  // Before we can set the default prosecutor we need to make sure
  // that the case has been loaded and that we have the list of users
  useOnceOn(isCaseUpToDate, () => setCaseLoaded(true))
  useOnceOn(caseLoaded && Boolean(data?.users), () => {
    if (!workingCase.prosecutor && selectedProsecutor?.value) {
      handleUpdate(selectedProsecutor.value)
    }
  })

  const handleChange = (value: SingleValue<Option<string | undefined>>) => {
    const id = value?.value

    if (id && typeof id === 'string') {
      handleUpdate(id)
    }
  }

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
      onChange={handleChange}
      isDisabled={loading}
      required
    />
  )
}

export default ProsecutorSelection
