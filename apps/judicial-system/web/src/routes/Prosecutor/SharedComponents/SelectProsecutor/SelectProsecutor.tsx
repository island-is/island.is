import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'
import { useQuery } from '@apollo/client'

import { Box, Select, Tooltip } from '@island.is/island-ui/core'
import { User, UserRole } from '@island.is/judicial-system/types'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { strings } from './SelectProsecutor.strings'
import { SelectProsecutorUsersQuery } from './selectProsecutorUsersGql'

type ProsecutorSelectOption = ReactSelectOption & { prosecutor: User }

interface Props {
  onChange: (prosecutor: User) => boolean
}

const SelectProsecutor: React.FC<Props> = (props) => {
  const { onChange } = props

  const { formatMessage } = useIntl()

  const { workingCase } = useContext(FormContext)

  const [selectedProsecutor, setSelectedProsecutor] = useState<
    ValueType<ProsecutorSelectOption>
  >(
    workingCase.prosecutor
      ? {
          label: workingCase.prosecutor.name,
          value: workingCase.prosecutor.id,
          prosecutor: workingCase.prosecutor,
        }
      : null,
  )

  const [selectProsecutors, setSelectProsecutors] = useState<
    ProsecutorSelectOption[]
  >([])

  const { data, loading } = useQuery(SelectProsecutorUsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (data?.users) {
      setSelectProsecutors(
        data.users
          .filter(
            (aUser: User) =>
              aUser.role === UserRole.PROSECUTOR &&
              (!workingCase.creatingProsecutor ||
                aUser.institution?.id ===
                  workingCase.creatingProsecutor?.institution?.id),
          )
          .map((prosecutor: User) => ({
            label: prosecutor.name,
            value: prosecutor.id,
            prosecutor,
          })),
      )
    }
  }, [data?.users, workingCase.creatingProsecutor])

  return (
    <>
      <SectionHeading
        title={`${formatMessage(strings.heading)} `}
        tooltip={
          <Box component="span" data-testid="prosecutor-tooltip">
            <Tooltip text={formatMessage(strings.tooltip)} />
          </Box>
        }
      />
      <Select
        name="prosecutor"
        label={formatMessage(strings.label)}
        placeholder={formatMessage(strings.placeholder)}
        value={selectedProsecutor}
        options={selectProsecutors}
        onChange={(selectedOption: ValueType<ReactSelectOption>) => {
          onChange((selectedOption as ProsecutorSelectOption).prosecutor) &&
            setSelectedProsecutor(selectedOption as ProsecutorSelectOption)
        }}
        disabled={loading}
        required
      />
    </>
  )
}

export default SelectProsecutor
