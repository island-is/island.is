import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Select,
} from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { accident } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { WorkingEnvironmentDto } from '@island.is/clients/work-accident-ver'
import { WorkAccidentNotification } from '../../lib/dataSchema'

type Option = {
  value: string
  label: string
}

export const AccidentLocation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const workingEnvironment =
    getValueViaPath<WorkingEnvironmentDto[]>(
      application.externalData,
      'aoshData.data.workingEnvironment',
    ) ?? []
  const majorGroups = workingEnvironment.filter((group) => !group.validToSelect)

  const minorGroups = workingEnvironment.filter((group) => group.validToSelect)
  const [selectedMajorGroup, setSelectedMajorGroup] = useState<Option | null>(
    answers?.accident?.accidentLocationParentGroup || null,
  )
  const [selectedMinorGroup, setSelectedMinorGroup] = useState<Option | null>(
    answers?.accident?.accidentLocation || null,
  )
  const [minorGroupOptions, setMinorGroupOptions] = useState<
    WorkingEnvironmentDto[]
  >(
    selectedMajorGroup
      ? minorGroups.filter(
          (group) =>
            group.code?.substring(0, 2) ===
            selectedMajorGroup?.value?.substring(0, 2),
        )
      : [],
  )

  return (
    <Box paddingTop={2}>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <Controller
            render={() => {
              return (
                <Select
                  required
                  label={formatMessage(
                    accident.about.locationOfAccidentMajorGroup,
                  )}
                  name="accident.accidentLocationParentGroup"
                  options={majorGroups.map((option) => ({
                    label: option.name || '',
                    value: option.code,
                  }))}
                  value={selectedMajorGroup}
                  backgroundColor="blue"
                  onChange={(v) => {
                    setMinorGroupOptions(
                      minorGroups.filter(
                        (group) =>
                          group.code?.substring(0, 2) ===
                          v?.value?.substring(0, 2),
                      ),
                    )
                    setSelectedMajorGroup({
                      label: v?.label || '',
                      value: v?.value || '',
                    })
                    setSelectedMinorGroup(null)
                  }}
                />
              )
            }}
            name={'accident.accidentLocationParentGroup'}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <Controller
            render={() => {
              return (
                <Select
                  required
                  label={formatMessage(
                    accident.about.locationOfAccidentMinorGroup,
                  )}
                  name="accident.accidentLocation"
                  options={minorGroupOptions.map((group) => ({
                    label: group.name || '',
                    value: group.code,
                  }))}
                  isDisabled={!selectedMajorGroup}
                  value={selectedMinorGroup}
                  backgroundColor="blue"
                  onChange={(v) => {
                    setSelectedMinorGroup({
                      label: v?.label || '',
                      value: v?.value || '',
                    })
                    setValue('accident.accidentLocation', v)
                    setValue(
                      'accident.accidentLocationParentGroup',
                      selectedMajorGroup,
                    )
                  }}
                />
              )
            }}
            name={'accident.accidentLocation'}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
