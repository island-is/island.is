import { FC, Fragment, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Checkbox,
  LoadingDots,
  Table as T,
} from '@island.is/island-ui/core'
import IconCircleClose from '../../assets/IconCircleClose'
import IconCircleOpen from '../../assets/IconCircleOpen'
import {
  ADDRESS_SEARCH_QUERY,
  PROPERTY_INFO_QUERY,
} from '../../graphql/queries'
import { registerProperty } from '../../lib/messages'
import {
  input,
  roomsInput,
  sizeInput,
  tableHeadingCell,
  tableCell,
  dropdownTableCell,
  tableCellExpand,
  tableCellSize,
  tableCellNumOfRooms,
  hiddenTableRow,
  hiddenTableRowExpanded,
  tableCellMerking,
  tableCellFastNum,
} from './propertySearch.css'

import { useLazyQuery } from '@apollo/client'
import {
  HmsSearchInput,
  Query,
  HmsSearchAddress,
  HmsPropertyInfo,
  HmsPropertyInfoInput,
  Unit as OriginalUnit,
} from '@island.is/api/schema'

interface Unit extends OriginalUnit {
  checked?: boolean
  changedSize?: number
  changedRooms?: number
}

interface Props extends FieldBaseProps {
  field: CustomField
}

interface AddressProps extends HmsSearchAddress {
  label: string
  value: string
}

export const PropertySearch: FC<React.PropsWithChildren<Props>> = ({
  field,
}) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue, getValues } = useFormContext()
  const { id } = field
  const storedValue = getValues(id)

  const [searchTerm, setSearchTerm] = useState(storedValue?.value)
  const [searchOptions, setSearchOptions] = useState<AsyncSearchOption[]>([])
  const [tableExpanded, setTableExpanded] = useState<Record<string, boolean>>(
    {},
  )

  const [checkedUnits, setCheckedUnits] = useState<Record<string, boolean>>(
    storedValue?.checkedUnits || {},
  )
  const [unitSizeChangeValue, setUnitSizeChangeValue] = useState<
    Record<string, number>
  >(storedValue?.changedValueOfUnitSize || {})
  const [changedRoomsValue, setChangedRoomsValue] = useState<
    Record<string, number>
  >(storedValue?.changedValueOfUnitRooms || {})

  const [selectedAddress, setSelectedAddress] = useState<
    AddressProps | undefined
  >(storedValue)
  const [propertiesByAddressCode, setPropertiesByAddressCode] = useState<
    HmsPropertyInfo[] | undefined
  >(storedValue?.propertiesByAddressCode || [])

  useEffect(() => {
    if (selectedAddress && selectedAddress.addressCode) {
      hmsPropertyInfo({
        variables: {
          input: {
            stadfangNr: selectedAddress.addressCode,
          },
        },
      })
    }
  }, [selectedAddress])

  useEffect(() => {
    if (searchTerm?.length) {
      hmsSearch({
        variables: {
          input: {
            partialStadfang: searchTerm,
          },
        },
      })
    } else {
      setSearchOptions([])
    }
  }, [searchTerm])

  useEffect(() => {
    // Restore tableExpanded based on checked units in storedValue.units
    if (storedValue?.units) {
      const expandedTables = storedValue.units.reduce(
        (acc: Record<string, boolean>, unit: Unit) => {
          if (unit.checked) {
            if (unit.propertyCode) {
              acc[unit.propertyCode] = true
            }
          }
          return acc
        },
        {} as Record<string, boolean>,
      )
      setTableExpanded(expandedTables)
    }
  }, [storedValue])

  // Clear inital errors on mount
  useEffect(() => {
    clearErrors()
  }, [])

  const [hmsSearch, { loading: searchLoading }] = useLazyQuery<
    Query,
    { input: HmsSearchInput }
  >(ADDRESS_SEARCH_QUERY, {
    onError: (error) => {
      console.error('Error fetching address', error)
    },
    onCompleted: (data) => {
      if (data.hmsSearch) {
        const searchOptions = data.hmsSearch.addresses.map((address) => ({
          ...address,
          label: `${address.address}, ${address.postalCode} ${address.municipalityName}`,
          value: `${address.addressCode}`,
        }))
        setSearchOptions(searchOptions)
      }
    },
  })

  const [hmsPropertyInfo, { loading: propertiesLoading }] = useLazyQuery<
    Query,
    { input: HmsPropertyInfoInput }
  >(PROPERTY_INFO_QUERY, {
    onError: (error) => {
      console.error('Error fetching properties', error)
    },
    onCompleted: (data) => {
      if (data.hmsPropertyInfo) {
        setPropertiesByAddressCode(data.hmsPropertyInfo.propertyInfos)
      }
    },
  })

  const toggleExpand = (propertyId: number) => {
    setTableExpanded((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }))
  }

  const handleCheckboxChange = (unit: Unit, checked: boolean) => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`

    const chosenUnits = checked
      ? [...(storedValue?.units || []), { ...unit, checked: true }]
      : (storedValue?.units || []).filter((u: Unit) => {
          const storedUnitKey = `${u.propertyCode}_${u.unitCode}`
          return storedUnitKey !== unitKey
        })

    const updateCheckedUnits = {
      ...checkedUnits,
      [unitKey]: checked,
    }

    setValue(id, {
      ...storedValue,
      units: chosenUnits,
    })

    setCheckedUnits(updateCheckedUnits)
  }

  const isUnitChecked = (unit: Unit): boolean => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`
    return (
      storedValue?.units?.some(
        (u: Unit) =>
          `${u.propertyCode}_${u.unitCode}` === unitKey && u.checked === true,
      ) || false
    )
  }

  const handleUnitSizeChange = (unit: Unit, value: number) => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`
    setUnitSizeChangeValue((prev) => {
      const newValues = {
        ...prev,
        [unitKey]: value,
      }
      setValue(id, {
        ...getValues(id),
        changedUnitSize: newValues,
      })
      return newValues
    })
  }

  const handleUnitRoomsChange = (unit: Unit, value: number) => {
    setChangedRoomsValue((prev) => {
      const unitKey = `${unit.propertyCode}_${unit.unitCode}`
      const newValues = {
        ...prev,
        [unitKey]: value,
      }
      setValue(id, {
        ...getValues(id),
        changedUnitRooms: newValues,
      })
      return newValues
    })
  }

  const handleAddressSelectionChange = (
    selection: { value: string } | null,
  ) => {
    clearErrors(id)
    const selectedValue = selection === null ? undefined : selection.value
    const selectedOption = searchOptions.find(
      (option) => option.value === selectedValue,
    )
    setSelectedAddress(selectedOption as AddressProps)
    setValue(id, selection ? selection : undefined)
  }

  return (
    <>
      <Box>
        <Controller
          name={`${id}`}
          defaultValue=""
          render={({ field: { onChange } }) => {
            return (
              <AsyncSearch
                options={searchOptions}
                placeholder={formatMessage(
                  registerProperty.info.propertySearchPlaceholder,
                )}
                initialInputValue={selectedAddress ? selectedAddress.label : ''}
                inputValue={
                  searchTerm || (selectedAddress ? selectedAddress.label : '')
                }
                closeMenuOnSubmit
                size="large"
                colored
                onChange={(selection) => {
                  handleAddressSelectionChange(selection)
                  onChange(selection ? selection : undefined)
                }}
                onInputValueChange={(newValue) => {
                  setSearchTerm(newValue)
                }}
                loading={searchLoading}
              />
            )
          }}
        />
      </Box>

      {selectedAddress && (
        <Box marginTop={6}>
          {propertiesLoading ? (
            <div style={{ textAlign: 'center' }}>
              <LoadingDots large />
            </div>
          ) : (
            propertiesByAddressCode &&
            propertiesByAddressCode.length > 0 && (
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData
                      box={{
                        className: `${tableHeadingCell} ${tableCellExpand}`,
                      }}
                    ></T.HeadData>
                    <T.HeadData
                      box={{
                        className: `${tableHeadingCell} ${tableCellFastNum}`,
                      }}
                    >
                      {formatMessage(
                        registerProperty.info.searchResultHeaderPropertyId,
                      )}
                    </T.HeadData>
                    <T.HeadData
                      box={{
                        className: `${tableHeadingCell} ${tableCellMerking}`,
                      }}
                    >
                      {formatMessage(
                        registerProperty.info.searchResultHeaderMarking,
                      )}
                    </T.HeadData>
                    <T.HeadData
                      box={{
                        className: `${tableHeadingCell} ${tableCellSize}`,
                      }}
                    >
                      {formatMessage(
                        registerProperty.info.searchResultHeaderPropertySize,
                      )}
                    </T.HeadData>
                    <T.HeadData
                      box={{
                        className: `${tableHeadingCell} ${tableCellNumOfRooms}`,
                      }}
                    >
                      {formatMessage(
                        registerProperty.info.searchResultsHeaderNumOfRooms,
                      )}
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {propertiesByAddressCode.map((property) => {
                    return (
                      <Fragment key={property.propertyCode}>
                        <T.Row>
                          <T.Data
                            box={{
                              className: `${tableCell} ${tableCellExpand}`,
                            }}
                          >
                            {property.appraisalUnits &&
                              property.appraisalUnits.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    toggleExpand(property.propertyCode || 0)
                                  }}
                                >
                                  {property.propertyCode &&
                                  tableExpanded[property.propertyCode] ? (
                                    <IconCircleClose />
                                  ) : (
                                    <IconCircleOpen />
                                  )}
                                </button>
                              )}
                          </T.Data>
                          <T.Data
                            box={{
                              className: `${tableCell} ${tableCellFastNum}`,
                            }}
                          >
                            {property.propertyCode}
                          </T.Data>
                          <T.Data
                            box={{
                              className: `${tableCell} ${tableCellMerking}`,
                            }}
                          >
                            {property.unitCode}
                          </T.Data>
                          <T.Data
                            box={{
                              className: `${tableCell} ${tableCellSize}`,
                            }}
                          >
                            {`${property.size} ${property.sizeUnit}`}
                          </T.Data>
                          <T.Data
                            box={{
                              className: `${tableCell} ${tableCellNumOfRooms}`,
                            }}
                          >
                            {'-'}
                          </T.Data>
                        </T.Row>
                        {property.appraisalUnits &&
                          property.appraisalUnits.length > 0 && (
                            <>
                              {property.appraisalUnits.map((appraisalUnit) => {
                                return (
                                  <Fragment key={appraisalUnit.unitCode}>
                                    {appraisalUnit.units &&
                                      appraisalUnit.units.map((unit) => {
                                        const unitKey = `${unit.propertyCode}_${unit.unitCode}`
                                        return (
                                          <tr key={unit.unitCode}>
                                            <T.Data
                                              colSpan={5}
                                              box={{
                                                paddingLeft: 0,
                                                paddingRight: 0,
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                                borderColor: 'transparent',
                                              }}
                                            >
                                              <div
                                                className={`${hiddenTableRow} ${
                                                  tableExpanded[
                                                    unit.propertyCode ?? 0
                                                  ] && hiddenTableRowExpanded
                                                }`}
                                              >
                                                <T.Data
                                                  box={{
                                                    className: `${dropdownTableCell} ${tableCellExpand}`,
                                                  }}
                                                ></T.Data>
                                                <T.Data
                                                  box={{
                                                    className: `${dropdownTableCell} ${tableCellFastNum}`,
                                                  }}
                                                >
                                                  <Checkbox
                                                    id={unit.unitCode ?? ''}
                                                    name={
                                                      unit.propertyUsageDescription ??
                                                      ''
                                                    }
                                                    label={
                                                      unit.propertyUsageDescription ??
                                                      ''
                                                    }
                                                    checked={isUnitChecked(
                                                      unit,
                                                    )}
                                                    onChange={(event) =>
                                                      handleCheckboxChange(
                                                        unit,
                                                        event.currentTarget
                                                          .checked,
                                                      )
                                                    }
                                                  />
                                                </T.Data>
                                                <T.Data
                                                  box={{
                                                    className: `${dropdownTableCell} ${tableCellMerking}`,
                                                  }}
                                                >
                                                  {unit.unitCode ?? ''}
                                                </T.Data>
                                                <T.Data
                                                  box={{
                                                    className: `${dropdownTableCell} ${tableCellSize}`,
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                    }}
                                                  >
                                                    <input
                                                      className={`${input} ${sizeInput}`}
                                                      type="number"
                                                      name="propertySize"
                                                      value={
                                                        unitSizeChangeValue[
                                                          unitKey
                                                        ] || `${unit.size}`
                                                      }
                                                      onChange={(e) =>
                                                        handleUnitSizeChange(
                                                          unit,
                                                          Number(
                                                            e.target.value,
                                                          ),
                                                        )
                                                      }
                                                      disabled={
                                                        !checkedUnits[unitKey]
                                                      }
                                                    />
                                                    <span>{unit.sizeUnit}</span>
                                                  </div>
                                                </T.Data>
                                                <T.Data
                                                  box={{
                                                    className: `${dropdownTableCell} ${tableCellNumOfRooms}`,
                                                  }}
                                                >
                                                  <input
                                                    className={`${input} ${roomsInput}`}
                                                    type="number"
                                                    name="numOfRooms"
                                                    value={
                                                      changedRoomsValue[
                                                        unitKey
                                                      ] || ''
                                                    }
                                                    onChange={(e) =>
                                                      handleUnitRoomsChange(
                                                        unit,
                                                        Number(e.target.value),
                                                      )
                                                    }
                                                    disabled={
                                                      !checkedUnits[unitKey]
                                                    }
                                                  />
                                                </T.Data>
                                              </div>
                                            </T.Data>
                                          </tr>
                                        )
                                      })}
                                  </Fragment>
                                )
                              })}
                            </>
                          )}
                      </Fragment>
                    )
                  })}
                </T.Body>
              </T.Table>
            )
          )}
        </Box>
      )}
    </>
  )
}
