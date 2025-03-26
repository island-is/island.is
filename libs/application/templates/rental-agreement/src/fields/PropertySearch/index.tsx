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
  Unit,
} from '@island.is/api/schema'

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
    Record<string, string>
  >(storedValue?.changedValueOfUnitSize || {})
  const [unitRoomsChangeValue, setUnitRoomsChangeValue] = useState<
    Record<string, string>
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

  const [hmsSearch, { loading: searchLoading }] = useLazyQuery<
    Query,
    { input: HmsSearchInput }
  >(ADDRESS_SEARCH_QUERY, {
    onError: (error) => {
      console.error('Error fetching search results', error)
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
    const units = checked
      ? storedValue.units?.concat({ ...unit, checked: true }) ?? [
          { ...unit, checked: true },
        ]
      : storedValue.units?.filter((u: Unit) => {
          const storedUnit = `${unit.propertyCode}_${unit.unitCode}`
          const checkedUnit = `${u.propertyCode}_${u.unitCode}`
          return storedUnit !== checkedUnit
        })

    setValue(id, {
      ...storedValue,
      units,
      checkedUnits: {
        [unit.unitCode ?? '']: checked,
      },
      checkedUnitsWithpropertyCode: {
        [`${unit.propertyCode}_${unit.unitCode}`]: checked,
      },
    })

    setCheckedUnits((prev) => ({
      ...prev,
      [`${unit.propertyCode}_${unit.unitCode}`]: checked,
    }))
  }

  const handleUnitSizeChange = (unitId: string, value: string) => {
    setUnitSizeChangeValue((prev) => {
      const newValues = {
        ...prev,
        [unitId]: value,
      }
      setValue(id, {
        ...getValues(id),
        unitSizeChangedValue: newValues,
      })
      return newValues
    })
  }

  const handleUnitRoomsChange = (unitId: string, value: string) => {
    setUnitRoomsChangeValue((prev) => {
      const newValues = {
        ...prev,
        [unitId]: value,
      }
      setValue(id, {
        ...getValues(id),
        unitRoomsChangedValue: newValues,
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

  // Clear inital errors on mount
  useEffect(() => {
    clearErrors()
  }, [])

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
                            {`${property.size} m²`}
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
                                      appraisalUnit.units.map((unit) => (
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
                                                  checked={
                                                    checkedUnits[
                                                      unit.unitCode ?? ''
                                                    ]
                                                  }
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
                                                <input
                                                  className={input}
                                                  type="text"
                                                  name="propertySize"
                                                  value={
                                                    unitSizeChangeValue[
                                                      unit.unitCode ?? ''
                                                    ] ||
                                                    `${unit.size} ${unit.sizeUnit}`
                                                  }
                                                  onChange={(e) =>
                                                    handleUnitSizeChange(
                                                      unit.unitCode ?? '',
                                                      e.target.value,
                                                    )
                                                  }
                                                  disabled={
                                                    !checkedUnits[
                                                      unit.unitCode ?? ''
                                                    ]
                                                  }
                                                />
                                              </T.Data>
                                              <T.Data
                                                box={{
                                                  className: `${dropdownTableCell} ${tableCellNumOfRooms}`,
                                                }}
                                              >
                                                <input
                                                  className={input}
                                                  type="text"
                                                  name="numOfRooms"
                                                  value={
                                                    unitRoomsChangeValue[
                                                      unit.unitCode ?? ''
                                                    ] || ''
                                                  }
                                                  onChange={(e) =>
                                                    handleUnitRoomsChange(
                                                      unit.unitCode ?? '',
                                                      e.target.value,
                                                    )
                                                  }
                                                  disabled={
                                                    !checkedUnits[
                                                      unit.unitCode ?? ''
                                                    ]
                                                  }
                                                />
                                              </T.Data>
                                            </div>
                                          </T.Data>
                                        </tr>
                                      ))}
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
