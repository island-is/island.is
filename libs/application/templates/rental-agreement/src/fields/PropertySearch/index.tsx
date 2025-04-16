import { FC, Fragment, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
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
import { PropertyTableHeader } from './components/PropertyTableHeader'
import { PropertyTableRow } from './components/PropertyTableRow'
import { PropertyTableUnits } from './components/PropertyTableUnits'
import { registerProperty } from '../../lib/messages'

export interface Unit extends OriginalUnit {
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
}

export interface AddressProps extends HmsSearchAddress {
  label: string
  value: string
}

interface Props extends FieldBaseProps {
  field: CustomField
  errors?: {
    registerProperty?: {
      [key: string]: string
    }
  }
}

export const PropertySearch: FC<React.PropsWithChildren<Props>> = ({
  field,
  errors,
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
    if (!storedValue) return
    setTableExpanded(restoreTableExpanded(storedValue))
    setCheckedUnits(restoreCheckedUnits(storedValue))
    setNumOfRoomsValue(restoreRoomsValue(storedValue))
    setUnitSizeChangedValue(restoreSizeValue(storedValue))
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

  interface StoredValueUnits {
    units?: Unit[]
  }

  const restoreTableExpanded = (storedValue: StoredValueUnits) => {
    if (!storedValue?.units) return {}
    return storedValue.units.reduce(
      (acc: Record<string, boolean>, unit: Unit) => {
        if (unit.checked && unit.propertyCode) {
          acc[unit.propertyCode] = true
        }
        return acc
      },
      {} as Record<string, boolean>,
    )
  }

  const restoreCheckedUnits = (storedValue: StoredValueUnits) => {
    if (!storedValue?.units) return {}
    return storedValue.units.reduce(
      (acc: Record<string, boolean>, unit: Unit) => {
        const unitKey = `${unit.propertyCode}_${unit.unitCode}`
        acc[unitKey] = unit.checked || false
        return acc
      },
      {} as Record<string, boolean>,
    )
  }
  const restoreRoomsValue = (storedValue: StoredValueUnits) => {
    if (!storedValue?.units) return {}
    return storedValue.units.reduce(
      (acc: Record<string, number>, unit: Unit) => {
        const unitKey = `${unit.propertyCode}_${unit.unitCode}`
        acc[unitKey] = unit.numOfRooms || 0
        return acc
      },
      {} as Record<string, number>,
    )
  }
  const restoreSizeValue = (storedValue: StoredValueUnits) => {
    if (!storedValue?.units) return {}
    return storedValue.units.reduce(
      (acc: Record<string, number>, unit: Unit) => {
        const unitKey = `${unit.propertyCode}_${unit.unitCode}`
        acc[unitKey] = unit.changedSize || 0
        return acc
      },
      {} as Record<string, number>,
    )
  }

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

  const hasValidationErrors = errors ? Object.keys(errors).length > 0 : false

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
                                            key={unitKey}
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
                                            unitInputErrorMessage={
                                              errors?.registerProperty?.[
                                                `searchResults.units`
                                              ]
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
          {hasValidationErrors && (
            <Box marginTop={8}>
              {errors?.registerProperty?.['searchResults'] && (
                <AlertMessage
                  type="error"
                  title={errors?.registerProperty?.['searchResults']}
                />
              )}
              {errors?.registerProperty?.['searchResults.units'] && (
                <AlertMessage
                  type="error"
                  message={errors?.registerProperty?.['searchResults.units']}
                  title={formatMessage(
                    registerProperty.search.searchResultsErrorBannerTitle,
                  )}
                />
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  )
}
