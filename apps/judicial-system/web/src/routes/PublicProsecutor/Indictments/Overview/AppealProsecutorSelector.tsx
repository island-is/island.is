import type { Dispatch, SetStateAction } from 'react'
import { useContext, useMemo } from 'react'

import type { Option } from '@island.is/island-ui/core'
import { Select } from '@island.is/island-ui/core'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  BlueBox,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useProsecutorSelectionUsersQuery } from '@island.is/judicial-system-web/src/components/ProsecutorSelection/prosecutorSelectionUsers.generated'

export const AppealProsecutorSelector = ({
  workingCase,
  selectedAppealProsecutor,
  setSelectedAppealProsecutor,
}: {
  workingCase: WorkingCase
  selectedAppealProsecutor: Option<string> | null | undefined
  setSelectedAppealProsecutor: Dispatch<
    SetStateAction<Option<string> | null | undefined>
  >
}) => {
  const { user } = useContext(UserContext)

  const { data, loading } = useProsecutorSelectionUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const publicProsecutors = useMemo(() => {
    if (!data?.users || !user) {
      return []
    }
    return data.users.reduce(
      (acc: { label: string; value: string }[], prosecutor) => {
        if (prosecutor.institution?.id === user?.institution?.id) {
          acc.push({
            label: prosecutor.name ?? '',
            value: prosecutor.id,
          })
        }
        return acc
      },
      [],
    )
  }, [data?.users, user])

  return (
    <>
      <SectionHeading title="Úthlutun áfrýjunarmáls" />
      <BlueBox>
        <Select
          name="appealProsecutor"
          dataTestId="select-appeal-prosecutor"
          label="Veldu saksóknara"
          placeholder="Velja saksóknara"
          value={
            selectedAppealProsecutor
              ? selectedAppealProsecutor
              : workingCase.appealProsecutor
              ? {
                  label: workingCase.appealProsecutor.name || '',
                  value: workingCase.appealProsecutor.id,
                }
              : undefined
          }
          options={publicProsecutors}
          onChange={(value) => {
            setSelectedAppealProsecutor(value as Option<string>)
          }}
          isDisabled={loading}
          required
        />
      </BlueBox>
    </>
  )
}
