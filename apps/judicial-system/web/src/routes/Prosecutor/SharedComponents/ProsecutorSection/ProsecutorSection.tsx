import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'
import { useQuery } from '@apollo/client'

import { Box, Select, Tooltip } from '@island.is/island-ui/core'
import { User, UserRole } from '@island.is/judicial-system/types'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { strings } from './ProsecutorSection.strings'
import { ProsecutorSectionUsersQuery } from './prosecutorSectionUsersGql'

type ProsecutorSelectOption = ReactSelectOption & { prosecutor: User }

interface Props {
  onChange: (prosecutor: User) => boolean
}

const ProsecutorSection: React.FC<Props> = (props) => {
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

  const [availableProsecutors, setAvailableProsecutors] = useState<
    ProsecutorSelectOption[]
  >([])

  const { data, loading } = useQuery(ProsecutorSectionUsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (data?.users) {
      setAvailableProsecutors(
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
        options={availableProsecutors}
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

export default ProsecutorSection
