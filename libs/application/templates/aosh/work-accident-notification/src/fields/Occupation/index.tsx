import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { Box, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { employee } from '../../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'
import { VictimsOccupationDto } from '@island.is/clients/work-accident-ver'
import { WorkAccidentNotification } from '../..'

export type Options = {
  label: string
  value: string
}

interface OccupationProps {
  field: {
    props: {
      index: number
    }
  }
}

type EventOption = {
  value?: string | null | undefined
  label?: string
}

export const Occupation: FC<
  React.PropsWithChildren<OccupationProps & FieldBaseProps>
> = (props) => {
  const idx = props.field?.props?.index
  const { formatMessage } = useLocale()
  const { application, setBeforeSubmitCallback } = props
  const answers = application.answers as WorkAccidentNotification
  const { setValue } = useFormContext()

  const [selectedMajorGroup, setSelectedMajorGroup] = useState<Options | null>(
    answers?.employee?.[idx]?.victimsOccupationMajor || null,
  )

  const [selectedSubMajorGroup, setSelectedSubMajorGroup] =
    useState<Options | null>(
      answers?.employee?.[idx]?.victimsOccupationSubMajor || null,
    )
  const [selectedMinorGroup, setSelectedMinorGroup] = useState<Options | null>(
    answers?.employee?.[idx]?.victimsOccupationMinor || null,
  )
  const [selectedUnitGroup, setSelectedUnitGroup] = useState<Options | null>(
    answers?.employee?.[idx]?.victimsOccupationUnit || null,
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

  const allGroups =
    getValueViaPath<VictimsOccupationDto[]>(
      application.externalData,
      'aoshData.data.victimsOccupation',
    ) ?? []
  const victimsOccupationMajorGroups = (
    allGroups as VictimsOccupationDto[]
  ).filter((group) => group.code?.length === 1)
  const victimsOccupationSubMajorGroups = (
    allGroups as VictimsOccupationDto[]
  ).filter((group) => group.code?.length === 2)
  const victimOccupationMinorGroups = (
    allGroups as VictimsOccupationDto[]
  ).filter((group) => group.code?.length === 3)
  const victimsOccupationUnitGroups = (
    allGroups as VictimsOccupationDto[]
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
    if (chosenGroup) {
      setValue(`employee[${idx}].victimsOccupation`, {
        value: chosenGroup.code,
        label: chosenGroup.name,
      })
    }
    if (!majorGroup || !majorGroup.code || !majorGroup.name) return
    setSelectedMajorGroup({ value: majorGroup.code, label: majorGroup.name })
  }

  const onChangeMajorGroup = (value?: EventOption) => {
    setValue(`employee[${idx}].victimsOccupation`, undefined)

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

    const chosenMajorGroup = findGroupByCode(majorGroupOptions, value.value)
    if (chosenMajorGroup?.validToSelect) {
      setValue(`employee[${idx}].victimsOccupation`, selectedGroup)
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

    if (selectedGroup?.value) {
      const isValidToSelect = findGroupByCode(
        subMajorGroupOptions,
        selectedGroup.value,
      )?.validToSelect
      if (isValidToSelect) {
        setValue(`employee[${idx}].victimsOccupation`, selectedGroup)
      }
    }

    setMinorGroupOptions(
      victimOccupationMinorGroups.filter(
        (group) => group.code?.substring(0, 2) === value.value?.substring(0, 2),
      ),
    )

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

    if (selectedGroup?.value) {
      const isValidToSelect = findGroupByCode(
        minorGroupOptions,
        selectedGroup.value,
      )?.validToSelect
      if (isValidToSelect) {
        setValue(`employee[${idx}].victimsOccupation`, selectedGroup)
      }
    }

    setUnitGroupOptions(
      victimsOccupationUnitGroups.filter(
        (group) => group.code?.substring(0, 3) === value.value?.substring(0, 3),
      ),
    )

    setSelectedUnitGroup(null)
  }

  useEffect(() => {
    if (!selectedMajorGroup) return

    if (selectedSearchGroup) {
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
  }, [selectedMajorGroup])

  useEffect(() => {
    if (!selectedSubMajorGroup) return

    if (selectedSearchGroup) {
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
  }, [selectedSubMajorGroup])

  useEffect(() => {
    if (!selectedMinorGroup) return

    if (selectedSearchGroup) {
      const codeString = selectedSearchGroup.value
      const unitGroup = victimsOccupationUnitGroups.find(
        (group) => group.code?.substring(0, 4) === codeString?.substring(0, 4),
      )
      if (!unitGroup || !unitGroup.code || !unitGroup.name) {
        setSelectedUnitGroup({ value: '', label: '' })
      } else {
        const selectedUnitGroup: Options = {
          value: unitGroup.code,
          label: unitGroup.name,
        }
        setSelectedUnitGroup(selectedUnitGroup)
      }
      setUnitGroupOptions(
        victimsOccupationUnitGroups.filter(
          (group) =>
            group.code?.substring(0, 3) === codeString?.substring(0, 3),
        ),
      )
    }
  }, [selectedMinorGroup])

  setBeforeSubmitCallback?.(async () => {
    setValue(`employee[${idx}].victimsOccupationMajor`, selectedMajorGroup)
    setValue(
      `employee[${idx}].victimsOccupationSubMajor`,
      selectedSubMajorGroup,
    )
    setValue(`employee[${idx}].victimsOccupationMinor`, selectedMinorGroup)
    setValue(`employee[${idx}].victimsOccupationUnit`, selectedUnitGroup)

    return [true, null]
  })

  return (
    <Box>
      {/* Search bar */}
      <Box marginTop={2}>
        <Controller
          render={() => {
            return (
              <Select
                name={`searchBar[${idx}]`}
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
          name={`searchBar[${idx}]`}
        />
      </Box>
      {/* Major group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.majorGroupLabel)}
                name={`employee[${idx}].victimsOccupationMajor`}
                required={true}
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
          name={`employee[${idx}].victimsOccupationMajor`}
        />
      </Box>
      {/* Sub Major group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.subMajorGroupLabel)}
                name={`employee[${idx}].victimsOccupationSubMajor`}
                required={true}
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
          name={`employee[${idx}].victimsOccupationSubMajor`}
        />
      </Box>
      {/* Minor group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.minorGroupLabel)}
                name={`employee[${idx}].victimsOccupationMinor`}
                required={true}
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
          name={`employee[${idx}].victimsOccupationMinor`}
        />
      </Box>
      {/* Unit group */}
      <Box marginTop={3}>
        <Controller
          render={() => {
            return (
              <Select
                label={formatMessage(employee.employee.unitGroupLabel)}
                name={`employee[${idx}].victimsOccupationUnit`}
                required={true}
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
                  setValue(`employee[${idx}].victimsOccupation`, selectedGroup)
                  setValue(
                    `employee[${idx}].victimsOccupationUnit`,
                    selectedGroup,
                  )
                }}
              />
            )
          }}
          name={`employee[${idx}].victimsOccupationUnit`}
        />
      </Box>
    </Box>
  )
}
