import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { Box, Select } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { employee } from '../../lib/messages'
import { Controller } from 'react-hook-form'

// TODO Add support for LabelEn and LabelIs!

// TODO Remove these types when we get types from Generated files from api
export type VictimsOccupationMajorGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type VictimsOccupationSubMajorGroup = {
  Code: number
  FK_MajorGroupCode: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: boolean
}

export type VictimOccupationMinorGroup = {
  Code: number
  FK_SubMajorGroupCode: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type VictimsOccupationUnitGroup = {
  Code: number
  FK_MinorGroupCode: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type Options = {
  label: string
  value: string
}

export const Occupation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage, lang } = useLocale()
  const { application } = props
  const [SelectedMajorGroup, setSelectedMajorGroup] = useState<Options | null>(
    null,
  )
  const [SelectedSubMajorGroup, setSelectedSubMajorGroup] =
    useState<Options | null>(null)
  const [SelectedMinorGroup, setSelectedMinorGroup] = useState<Options | null>(
    null,
  )
  const [SelectedUnitGroup, setSelectedUnitGroup] = useState<Options | null>(
    null,
  )
  const [SelectedSearchGroup, setSelectedSearchGroup] =
    useState<Options | null>(null)
  const [MajorGroupOptions, setMajorGroupOptions] = useState<
    VictimsOccupationMajorGroup[]
  >([])
  const [SubMajorGroupOptions, setSubMajorGroupOptions] = useState<
    VictimsOccupationSubMajorGroup[]
  >([])
  const [MinorGroupOptions, setMinorGroupOptions] = useState<
    VictimOccupationMinorGroup[]
  >([])
  const [UnitGroupOptions, setUnitGroupOptions] = useState<
    VictimsOccupationUnitGroup[]
  >([])

  const victimsOccupationMajorGroups = getValueViaPath(
    application.externalData,
    'aoshData.data.victimsOccupationMajorGroup',
    [],
  ) as VictimsOccupationMajorGroup[]
  const victimsOccupationSubMajorGroups = getValueViaPath(
    application.externalData,
    'aoshData.data.victimsOccupationSubMajorGroup',
    [],
  ) as VictimsOccupationSubMajorGroup[]
  const victimOccupationMinorGroups = getValueViaPath(
    application.externalData,
    'aoshData.data.victimOccupationMinorGroups',
    [],
  ) as VictimOccupationMinorGroup[]
  const victimsOccupationUnitGroups = getValueViaPath(
    application.externalData,
    'aoshData.data.victimsOccupationUnitGroups',
    [],
  ) as VictimsOccupationUnitGroup[]

  const getAllValidSelects = () => {
    const majorGroups = victimsOccupationMajorGroups
      .filter((x) => x.ValidToSelect === 1)
      .map((item) => ({
        value: item.Code.toString(),
        label: lang === 'en' ? item.LabelEn : item.LabelIs,
      }))
    const subMajorGroups = victimsOccupationSubMajorGroups
      .filter((x) => x.ValidToSelect)
      .map((item) => ({
        value: item.Code.toString(),
        label: lang === 'en' ? item.LabelEn : item.LabelIs,
      }))
    const minorGroups = victimOccupationMinorGroups
      .filter((x) => x.ValidToSelect)
      .map((item) => ({
        value: item.Code.toString(),
        label: lang === 'en' ? item.LabelEn : item.LabelIs,
      }))
    const unitGroups = victimsOccupationUnitGroups
      .filter((x) => x.ValidToSelect)
      .map((item) => ({
        value: item.Code.toString(),
        label: lang === 'en' ? item.LabelEn : item.LabelIs,
      }))

    return [...majorGroups, ...subMajorGroups, ...minorGroups, ...unitGroups]
  }

  useEffect(() => {
    setMajorGroupOptions(victimsOccupationMajorGroups)
    setSubMajorGroupOptions(victimsOccupationSubMajorGroups)
    setMinorGroupOptions(victimOccupationMinorGroups)
    setUnitGroupOptions(victimsOccupationUnitGroups)
  }, [
    victimOccupationMinorGroups,
    victimsOccupationMajorGroups,
    victimsOccupationSubMajorGroups,
    victimsOccupationUnitGroups,
  ])

  const searchChanges = (value: string) => {
    if (!value) return
    const majorGroup = victimsOccupationMajorGroups.find(
      (group) => group.Code === parseInt(value[0]),
    )
    if (
      !majorGroup ||
      !majorGroup.Code ||
      !majorGroup.LabelIs ||
      !majorGroup.LabelEn
    )
      return
    setSelectedMajorGroup(
      { value: majorGroup?.Code.toString(), label: majorGroup?.LabelIs } ||
        null,
    )
  }

  const onChangeMajorGroup = (
    value: { value: string; label: string } | null,
  ) => {
    if (!value || !value.value || !value.label) return
    setSelectedMajorGroup({
      value: value.value,
      label: value.label,
    })
    setSubMajorGroupOptions(
      victimsOccupationSubMajorGroups.filter(
        (x) => x.FK_MajorGroupCode === parseInt(value.value.substring(0, 1)),
      ),
    )
    setSelectedSubMajorGroup(null)
    setSelectedMinorGroup(null)
    setSelectedUnitGroup(null)
    setMinorGroupOptions([])
    setUnitGroupOptions([])
  }

  const onChangeSubMajorGroup = (
    value: { value: string; label: string } | null,
  ) => {
    console.log(value)
    console.log(JSON.stringify(value))

    if (!value || !value.value || !value.label) return
    setSelectedSubMajorGroup({
      value: value.value,
      label: value.label,
    })

    setMinorGroupOptions(
      victimOccupationMinorGroups.filter(
        (x) => x.FK_SubMajorGroupCode === parseInt(value.value.substring(0, 2)),
      ),
    )
    setSelectedMinorGroup(null)
    setSelectedUnitGroup(null)
    setUnitGroupOptions([])
  }

  const onChangeMinorGroup = (
    value: { value: string; label: string } | null,
  ) => {
    if (!value || !value.value || !value.label) return
    setSelectedMinorGroup({
      value: value.value,
      label: value.label,
    })
    setUnitGroupOptions(
      victimsOccupationUnitGroups.filter(
        (x) => x.FK_MinorGroupCode === parseInt(value.value.substring(0, 3)),
      ),
    )
    setSelectedUnitGroup(null)
  }

  useEffect(() => {
    if (!SelectedMajorGroup) return

    if (SelectedSearchGroup) {
      const codeString: string = SelectedSearchGroup.value
      const subMajorGroup = victimsOccupationSubMajorGroups.find(
        (group) => group.Code === parseInt(codeString?.substring(0, 2)),
      )
      if (
        !subMajorGroup ||
        !subMajorGroup.Code ||
        !subMajorGroup.LabelIs ||
        !subMajorGroup.LabelEn
      ) {
        setSelectedSubMajorGroup({ value: '', label: '' })
      } else {
        setSelectedSubMajorGroup({
          value: subMajorGroup?.Code.toString(),
          label: subMajorGroup?.LabelIs,
        })
      }

      setSubMajorGroupOptions(
        victimsOccupationSubMajorGroups.filter(
          (x) => x.FK_MajorGroupCode === parseInt(codeString.substring(0, 1)),
        ),
      )
    } else {
      // Set the SelectedSubMajorGroup based on SelectedMajorGroup
    }
    console.log('Running useEffec [SelectedMajorGroup]')
  }, [SelectedMajorGroup])

  useEffect(() => {
    if (!SelectedSubMajorGroup) return

    if (SelectedSearchGroup) {
      const codeString = SelectedSearchGroup.value

      const minorGroup = victimOccupationMinorGroups.find(
        (group) => group.Code === parseInt(codeString?.substring(0, 3)),
      )

      if (
        !minorGroup ||
        !minorGroup.Code ||
        !minorGroup.LabelIs ||
        !minorGroup.LabelEn
      ) {
        setSelectedMinorGroup({ value: '', label: '' })
      } else {
        setSelectedMinorGroup({
          value: minorGroup?.Code.toString(),
          label: minorGroup?.LabelIs,
        })
      }
      setMinorGroupOptions(
        victimOccupationMinorGroups.filter(
          (x) =>
            x.FK_SubMajorGroupCode === parseInt(codeString.substring(0, 2)),
        ),
      )
    }
    console.log('Running useEffec [SelectedSubMajorGroup]')
  }, [SelectedSubMajorGroup])

  useEffect(() => {
    if (!SelectedMinorGroup) return

    if (SelectedSearchGroup) {
      const codeString = SelectedSearchGroup.value
      const unitGroup = victimsOccupationUnitGroups.find(
        (group) => group.Code === parseInt(codeString?.substring(0, 4)),
      )
      if (
        !unitGroup ||
        !unitGroup.Code ||
        !unitGroup.LabelIs ||
        !unitGroup.LabelEn
      ) {
        setSelectedUnitGroup({ value: '', label: '' })
      } else {
        setSelectedUnitGroup({
          value: unitGroup?.Code.toString(),
          label: unitGroup?.LabelIs,
        })
      }
      setUnitGroupOptions(
        victimsOccupationUnitGroups.filter(
          (x) => x.FK_MinorGroupCode === parseInt(codeString.substring(0, 3)),
        ),
      )
    }
    console.log('Running useEffec [SelectedMinorGroup]')
  }, [SelectedMinorGroup])

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
                value={SelectedSearchGroup}
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
                options={MajorGroupOptions.map((item) => ({
                  label: item.LabelIs,
                  value: item.Code.toString(),
                }))}
                value={SelectedMajorGroup}
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
                  onChangeMajorGroup(v)
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
                  !SelectedMajorGroup || SubMajorGroupOptions.length === 0
                }
                options={SubMajorGroupOptions.map((item) => ({
                  label: item.LabelIs,
                  value: item.Code.toString(),
                }))}
                value={SelectedSubMajorGroup}
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
                  !SelectedSubMajorGroup || MinorGroupOptions.length === 0
                }
                options={MinorGroupOptions.map((item) => ({
                  label: item.LabelIs,
                  value: item.Code.toString(),
                }))}
                value={SelectedMinorGroup}
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
                  !SelectedMinorGroup || UnitGroupOptions.length === 0
                }
                options={UnitGroupOptions.map((item) => ({
                  label: item.LabelIs,
                  value: item.Code.toString(),
                }))}
                value={SelectedUnitGroup}
                backgroundColor="blue"
                placeholder={formatMessage(
                  employee.employee.chooseFromListPlaceholder,
                )}
                onChange={(value) => {
                  if (!value) {
                    setSelectedUnitGroup(null)
                    return
                  }
                  setSelectedUnitGroup({
                    value: value?.value,
                    label: value?.label,
                  })
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
