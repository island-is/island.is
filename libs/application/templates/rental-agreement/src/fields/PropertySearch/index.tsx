import { FC, Fragment, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  LoadingDots,
  Table as T,
} from '@island.is/island-ui/core'
import {
  ADDRESS_SEARCH_QUERY,
  PROPERTY_INFO_QUERY,
} from '../../graphql/queries'
import {
  HmsSearchInput,
  Query,
  HmsSearchAddress,
  HmsPropertyInfo,
  HmsPropertyInfoInput,
  Unit as OriginalUnit,
} from '@island.is/api/schema'
import { PropertyTableUnits } from './components/PropertyTableUnits'
import { PropertyTableHeader } from './components/PropertyTableHeader'
import { PropertyTableRow } from './components/PropertyTableRow'
import { registerProperty } from '../../lib/messages'
export interface Unit extends OriginalUnit {
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
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
  const [unitSizeChangedValue, setUnitSizeChangedValue] = useState<
    Record<string, number>
  >(storedValue?.changedValueOfUnitSize || {})

  const [numOfRoomsValue, setNumOfRoomsValue] = useState<
    Record<string, number>
  >(storedValue?.numOfRooms || {})

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Restore checked units based on storedValue.units
      const initialCheckedUnits = storedValue.units.reduce(
        (acc: Record<string, boolean>, unit: Unit) => {
          const unitKey = `${unit.propertyCode}_${unit.unitCode}`
          acc[unitKey] = unit.checked || false
          return acc
        },
        {} as Record<string, boolean>,
      )
      setCheckedUnits(initialCheckedUnits)
    }

    // Restore numOfRooms per unit based on storedValue.units --> numOfRooms
    if (storedValue?.units) {
      const initialRoomsValue = storedValue.units.reduce(
        (acc: Record<string, number>, unit: Unit) => {
          const unitKey = `${unit.propertyCode}_${unit.unitCode}`
          acc[unitKey] = unit.numOfRooms || 0
          return acc
        },
        {} as Record<string, number>,
      )
      setNumOfRoomsValue(initialRoomsValue)
    }
    // Restore size value per unit based on storedValue.units --> changedSize | size
    if (storedValue?.units) {
      const initialSizeValue = storedValue.units.reduce(
        (acc: Record<string, number>, unit: Unit) => {
          const unitKey = `${unit.propertyCode}_${unit.unitCode}`
          acc[unitKey] = unit.changedSize || 0
          return acc
        },
        {} as Record<string, number>,
      )
      setUnitSizeChangedValue(initialSizeValue)
    }
  }, [storedValue])

  useEffect(() => {
    clearErrors(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * GraphQL query to fetch and format address search results.
   */
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

  /**
   * GraphQL query to fetch and format property info results based on addressCode.
   */
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
      ? [
          ...(storedValue?.units || []),
          {
            ...unit,
            checked: true,
            numOfRooms: numOfRoomsValue[unitKey] || 0,
            changedSize: unitSizeChangedValue[unitKey] ?? unit.size,
          },
        ]
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

  const handleUnitSizeChange = (unit: Unit, value: number) => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`
    setUnitSizeChangedValue((prev) => {
      const newValues = {
        ...prev,
        [unitKey]: value,
      }

      const updatedUnits = (storedValue?.units || []).map((u: Unit) => {
        if (
          u.propertyCode === unit.propertyCode &&
          u.unitCode === unit.unitCode
        ) {
          return {
            ...u,
            changedSize: value || 0,
          }
        }
        return u
      })

      setValue(id, {
        ...getValues(id),
        units: updatedUnits,
      })

      return newValues
    })
  }

  const handleUnitRoomsChange = (unit: Unit, value: number) => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`
    setNumOfRoomsValue((prev) => {
      const newValues = {
        ...prev,
        [unitKey]: value,
      }

      const updatedUnits = (storedValue?.units || []).map((u: Unit) => {
        if (
          u.propertyCode === unit.propertyCode &&
          u.unitCode === unit.unitCode
        ) {
          return {
            ...u,
            numOfRooms: value || 0,
          }
        }
        return u
      })

      setValue(id, {
        ...getValues(id),
        units: updatedUnits,
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
                  registerProperty.search.propertySearchPlaceholder,
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
              <T.Table id="searchResults.table">
                <PropertyTableHeader />
                <T.Body>
                  {propertiesByAddressCode.map((property) => {
                    return (
                      <Fragment key={property.propertyCode}>
                        <PropertyTableRow
                          appraisalUnits={property.appraisalUnits || []}
                          propertyCode={property.propertyCode || 0}
                          unitCode={property.unitCode || ''}
                          size={property.size || 0}
                          sizeUnit={property.sizeUnit || ''}
                          isTableExpanded={
                            property.propertyCode != null
                              ? tableExpanded[property.propertyCode] || false
                              : false
                          }
                          toggleExpand={(e) => {
                            e.preventDefault()
                            toggleExpand(property.propertyCode || 0)
                          }}
                        />
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
                                          <PropertyTableUnits
                                            unitCode={unit.unitCode ?? ''}
                                            propertyUsageDescription={
                                              unit.propertyUsageDescription ??
                                              ''
                                            }
                                            sizeUnit={unit.sizeUnit ?? ''}
                                            checkedUnits={
                                              checkedUnits[unitKey] || false
                                            }
                                            isTableExpanded={
                                              tableExpanded[
                                                unit.propertyCode ?? 0
                                              ] || false
                                            }
                                            unitSizeValue={
                                              unitSizeChangedValue[unitKey] ??
                                              unit.size
                                            }
                                            numOfRoomsValue={
                                              numOfRoomsValue[unitKey]
                                            }
                                            isUnitSizeDisabled={
                                              !checkedUnits[unitKey]
                                            }
                                            isNumOfRoomsDisabled={
                                              !checkedUnits[unitKey]
                                            }
                                            onCheckboxChange={(e) =>
                                              handleCheckboxChange(
                                                unit,
                                                e.currentTarget.checked,
                                              )
                                            }
                                            onUnitSizeChange={(e) =>
                                              handleUnitSizeChange(
                                                unit,
                                                Number(e.target.value),
                                              )
                                            }
                                            onUnitRoomsChange={(e) =>
                                              handleUnitRoomsChange(
                                                unit,
                                                Number(e.target.value),
                                              )
                                            }
                                          />
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
