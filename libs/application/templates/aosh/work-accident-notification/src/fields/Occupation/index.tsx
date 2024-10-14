import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { Box, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { employee } from '../../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'
import { VictimsOccupationDto } from '@island.is/clients/work-accident-ver'
import { WorkAccidentNotification } from '../../lib/dataSchema'

export type Options = {
  label: string
  value: string
}

type EventOption = {
  value?: string | null | undefined
  label?: string
}

export const Occupation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage, lang } = useLocale()
  const { application } = props
  const answers = application.answers as WorkAccidentNotification
  const { setValue } = useFormContext()
  const [selectedMajorGroup, setSelectedMajorGroup] = useState<Options | null>(
    answers?.employee?.victimsOccupationMajor || null,
  )
  const [selectedSubMajorGroup, setSelectedSubMajorGroup] =
    useState<Options | null>(
      answers?.employee?.victimsOccupationSubMajor || null,
    )
  const [selectedMinorGroup, setSelectedMinorGroup] = useState<Options | null>(
    answers?.employee?.victimsOccupationMinor || null,
  )
  const [selectedUnitGroup, setSelectedUnitGroup] = useState<Options | null>(
    answers?.employee?.victimsOccupationUnit || null,
  )
  const [selectedSearchGroup, setSelectedSearchGroup] =
    useState<Options | null>(null)
  const [majorGroupOptions, setMajorGroupOptions] = useState<
    VictimsOccupationDto[]
  >([])
  const [subMajorGroupOptions, setSubMajorGroupOptions] = useState<
    VictimsOccupationDto[]
  >([])
  const [minorGroupOptions, setMinorGroupOptions] = useState<
    VictimsOccupationDto[]
  >([])
  const [unitGroupOptions, setUnitGroupOptions] = useState<
    VictimsOccupationDto[]
  >([])

  const allGroups = getValueViaPath(
    application.externalData,
    'aoshData.data.victimsOccupation',
    [],
  ) as VictimsOccupationDto[]
  const victimsOccupationMajorGroups = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.victimsOccupation',
      [],
    ) as VictimsOccupationDto[]
  ).filter((group) => group.code?.length === 1)
  const victimsOccupationSubMajorGroups = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.victimsOccupation',
      [],
    ) as VictimsOccupationDto[]
  ).filter((group) => group.code?.length === 2)
  const victimOccupationMinorGroups = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.victimsOccupation',
      [],
    ) as VictimsOccupationDto[]
  ).filter((group) => group.code?.length === 3)
  const victimsOccupationUnitGroups = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.victimsOccupation',
      [],
    ) as VictimsOccupationDto[]
  ).filter((group) => group.code?.length === 4)

  const getValidOptions = (groups: VictimsOccupationDto[]) => {
    // Helper function that filters and maps valid options
    return groups
      .filter((x) => x.validToSelect)
      .map((item) => ({
        value: item.code,
        label: item.name || '',
      }))
  }

  const getAllValidSelects = () => {
    const majorGroups = getValidOptions(victimsOccupationMajorGroups)
    const subMajorGroups = getValidOptions(victimsOccupationSubMajorGroups)
    const minorGroups = getValidOptions(victimOccupationMinorGroups)
    const unitGroups = getValidOptions(victimsOccupationUnitGroups)

    return [...majorGroups, ...subMajorGroups, ...minorGroups, ...unitGroups]
  }

  const findGroupByCode = (groups: VictimsOccupationDto[], code: string) => {
    return groups.find((group) => group.code === code)
  }

  useEffect(() => {
    setMajorGroupOptions(victimsOccupationMajorGroups)
    setSubMajorGroupOptions(
      victimsOccupationSubMajorGroups.filter(
        (group) => group.code?.substring(0, 1) === selectedMajorGroup?.value,
      ),
    )
    setMinorGroupOptions(
      victimOccupationMinorGroups.filter(
        (group) => group.code?.substring(0, 2) === selectedSubMajorGroup?.value,
      ),
    )
    setUnitGroupOptions(
      victimsOccupationUnitGroups.filter(
        (group) => group.code?.substring(0, 3) === selectedMinorGroup?.value,
      ),
    )
  }, [])

  const searchChanges = (value: string) => {
    if (!value) return
    const majorGroup = victimsOccupationMajorGroups.find(
      (group) => group.code === value[0],
    )
    const chosenGroup = allGroups.find((group) => group.code === value)
    if (chosenGroup)
      setValue('employee.victimsOccupation', {
        value: chosenGroup.code,
        label: chosenGroup.name,
      })
    if (!majorGroup || !majorGroup.code || !majorGroup.name) return
    setSelectedMajorGroup({ value: majorGroup.code, label: majorGroup.name })
  }

  const onChangeMajorGroup = (value?: EventOption) => {
    if (!value || !value.value || !value.label) return
    const selectedGroup: Options = {
      value: value.value,
      label: value.label,
    }
    setSelectedMajorGroup(selectedGroup)
    setSubMajorGroupOptions(
      victimsOccupationSubMajorGroups.filter(
        (group) => group.code?.substring(0, 1) === value.value?.substring(0, 1),
      ),
    )

    setValue('employee.victimsOccupationMajor', selectedGroup)
    const chosenMajorGroup = findGroupByCode(majorGroupOptions, value.value)
    if (chosenMajorGroup?.validToSelect) {
      setValue('employee.victimsOccupation', selectedGroup)
    }

    setSelectedSubMajorGroup(null)
    setSelectedMinorGroup(null)
    setSelectedUnitGroup(null)
    setMinorGroupOptions([])
    setUnitGroupOptions([])
  }

  const onChangeSubMajorGroup = (value?: EventOption) => {
    if (!value || !value.value || !value.label) return
    const selectedGroup: Options = {
      value: value.value,
      label: value.label,
    }
    setSelectedSubMajorGroup(selectedGroup)

    setMinorGroupOptions(
      victimOccupationMinorGroups.filter(
        (group) => group.code?.substring(0, 2) === value.value?.substring(0, 2),
      ),
    )

    const chosenSubMajorGroup = findGroupByCode(
      subMajorGroupOptions,
      value.value,
    )

    setValue('employee.victimsOccupationSubMajor', selectedGroup)
    if (chosenSubMajorGroup?.validToSelect) {
      setValue('employee.victimsOccupation', selectedGroup)
    }

    setSelectedMinorGroup(null)
    setSelectedUnitGroup(null)
    setUnitGroupOptions([])
  }

  const onChangeMinorGroup = (value?: EventOption) => {
    if (!value || !value.value || !value.label) return
    const selectedGroup: Options = {
      value: value.value,
      label: value.label,
    }
    setSelectedMinorGroup(selectedGroup)
    setUnitGroupOptions(
      victimsOccupationUnitGroups.filter(
        (group) => group.code?.substring(0, 3) === value.value?.substring(0, 3),
      ),
    )

    setValue('employee.victimsOccupationMinor', selectedGroup)
    const chosenMinorGroup = findGroupByCode(minorGroupOptions, value.value)
    if (chosenMinorGroup?.validToSelect) {
      setValue('employee.victimsOccupation', selectedGroup)
    }

    setSelectedUnitGroup(null)
  }

  useEffect(() => {
    if (!selectedMajorGroup) return

    if (selectedSearchGroup) {
      setValue('employee.victimsOccupationMajor', selectedMajorGroup)

      const codeString: string = selectedSearchGroup.value
      const subMajorGroup = victimsOccupationSubMajorGroups.find(
        (group) => group.code?.substring(0, 2) === codeString?.substring(0, 2),
      )
      if (!subMajorGroup || !subMajorGroup.code || !subMajorGroup.name) {
        setSelectedSubMajorGroup({ value: '', label: '' })
      } else {
        setSelectedSubMajorGroup({
          value: subMajorGroup.code,
          label: subMajorGroup.name,
        })
      }

      setSubMajorGroupOptions(
        victimsOccupationSubMajorGroups.filter(
          (group) =>
            group.code?.substring(0, 1) === codeString?.substring(0, 1),
        ),
      )
    }
    console.log('Running useEffec [selectedMajorGroup]')
  }, [selectedMajorGroup])

  useEffect(() => {
    if (!selectedSubMajorGroup) return

    if (selectedSearchGroup) {
      setValue('employee.victimsOccupationSubMajor', selectedSubMajorGroup)

      const codeString = selectedSearchGroup.value
      const minorGroup = victimOccupationMinorGroups.find(
        (group) => group.code?.substring(0, 3) === codeString?.substring(0, 3),
      )

      if (!minorGroup || !minorGroup.code || !minorGroup.name) {
        setSelectedMinorGroup({ value: '', label: '' })
      } else {
        setSelectedMinorGroup({
          value: minorGroup.code,
          label: minorGroup.name,
        })
      }
      setMinorGroupOptions(
        victimOccupationMinorGroups.filter(
          (group) =>
            group.code?.substring(0, 2) === codeString?.substring(0, 2),
        ),
      )
    }
    console.log('Running useEffec [selectedSubMajorGroup]')
  }, [selectedSubMajorGroup])

  useEffect(() => {
    if (!selectedMinorGroup) return

    if (selectedSearchGroup) {
      setValue('employee.victimsOccupationMinor', selectedMinorGroup)

      const codeString = selectedSearchGroup.value
      const unitGroup = victimsOccupationUnitGroups.find(
        (group) => group.code?.substring(0, 4) === codeString?.substring(0, 4),
      )
      if (!unitGroup || !unitGroup.code || !unitGroup.name) {
        setSelectedUnitGroup({ value: '', label: '' })
        setValue('employee.victimsOccupationUnit', { value: '', label: '' })
      } else {
        const selectedUnitGroup: Options = {
          value: unitGroup.code,
          label: unitGroup.name,
        }
        setSelectedUnitGroup(selectedUnitGroup)
        setValue('employee.victimsOccupationUnit', selectedUnitGroup)
      }
      setUnitGroupOptions(
        victimsOccupationUnitGroups.filter(
          (group) =>
            group.code?.substring(0, 3) === codeString?.substring(0, 3),
        ),
      )
    }
    console.log('Running useEffec [selectedMinorGroup]')
  }, [selectedMinorGroup])

  return (
    <Box>
      {/* Search bar */}
      <Box marginTop={2}>
        <Controller
          render={() => {
            return (
              <Select
                name=""
                options={getAllValidSelects()}
                backgroundColor="blue"
                value={selectedSearchGroup}
                placeholder={formatMessage(employee.employee.searchPlaceholder)}
                onChange={(value) => {
                  if (!value || !value.label || !value.value) {
                    setSelectedSearchGroup(null)
                    return
                  }
                  setSelectedSearchGroup({
                    value: value.value,
                    label: value.label,
                  })
                  searchChanges(value.value)
                }}
                icon="search"
              />
            )
          }}
          name={'searchBar'}
        />
      </Box>
      {/* Major group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.majorGroupLabel)}
                name="majorGroupSelect"
                options={majorGroupOptions.map((item) => ({
                  label: item.name || '',
                  value: item.code,
                }))}
                value={selectedMajorGroup}
                backgroundColor="blue"
                placeholder={formatMessage(
                  employee.employee.chooseFromListPlaceholder,
                )}
                onChange={(v) => {
                  setSelectedSearchGroup(null)
                  if (!v) {
                    setSelectedMajorGroup(null)
                    return
                  }
                  onChangeMajorGroup({ value: v.value, label: v.label })
                }}
              />
            )
          }}
          name={'majorGroup'}
        />
      </Box>
      {/* Sub Major group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.subMajorGroupLabel)}
                name="subMajorGroupSelect"
                isDisabled={
                  !selectedMajorGroup || subMajorGroupOptions.length === 0
                }
                options={subMajorGroupOptions.map((item) => ({
                  label: item.name || '',
                  value: item.code,
                }))}
                value={selectedSubMajorGroup}
                backgroundColor="blue"
                placeholder={formatMessage(
                  employee.employee.chooseFromListPlaceholder,
                )}
                onChange={(v) => {
                  setSelectedSearchGroup(null)
                  if (!v) {
                    setSelectedSubMajorGroup(null)
                    return
                  }
                  onChangeSubMajorGroup(v)
                }}
              />
            )
          }}
          name={'subMajorGroup'}
        />
      </Box>
      {/* Minor group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.minorGroupLabel)}
                name="minorGroupSelect"
                isDisabled={
                  !selectedSubMajorGroup || minorGroupOptions.length === 0
                }
                options={minorGroupOptions.map((item) => ({
                  label: item.name || '',
                  value: item.code,
                }))}
                value={selectedMinorGroup}
                backgroundColor="blue"
                placeholder={formatMessage(
                  employee.employee.chooseFromListPlaceholder,
                )}
                onChange={(v) => {
                  setSelectedSearchGroup(null)
                  if (!v) {
                    setSelectedMinorGroup(null)
                    return
                  }
                  onChangeMinorGroup(v)
                }}
              />
            )
          }}
          name={'minorGroup'}
        />
      </Box>
      {/* Unit group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.unitGroupLabel)}
                name="unitGroupSelect"
                isDisabled={
                  !selectedMinorGroup || unitGroupOptions.length === 0
                }
                options={unitGroupOptions.map((item) => ({
                  label: item.name || '',
                  value: item.code,
                }))}
                value={selectedUnitGroup}
                backgroundColor="blue"
                placeholder={formatMessage(
                  employee.employee.chooseFromListPlaceholder,
                )}
                onChange={(value) => {
                  if (!value) {
                    setSelectedUnitGroup(null)
                    return
                  }
                  const selectedGroup: Options = {
                    value: value.value || '',
                    label: value?.label,
                  }
                  setSelectedUnitGroup(selectedGroup)
                  setValue('employee.victimsOccupation', selectedGroup)
                  setValue('employee.victimsOccupationUnit', selectedGroup)
                }}
              />
            )
          }}
          name={'unitGroup'}
        />
      </Box>
    </Box>
  )
}
