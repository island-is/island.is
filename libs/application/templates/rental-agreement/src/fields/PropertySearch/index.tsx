import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  AsyncSearch,
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
  HmsPropertyInfo,
  HmsPropertyInfoInput,
} from '@island.is/api/schema'
import { AddressProps, PropertyUnit } from '../../shared'
import { PropertyTableHeader } from './components/PropertyTableHeader'
import { PropertyTableRow } from './components/PropertyTableRow'
import { PropertyTableUnits } from './components/PropertyTableUnits'
import { registerProperty } from '../../lib/messages'

const ERROR_ID = 'registerProperty'
const EMPTY_OBJECT = {}

interface Props extends FieldBaseProps {
  field: CustomField
  errors?: Record<string, Record<string, string>>
}

export const PropertySearch: FC<React.PropsWithChildren<Props>> = ({
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue, getValues } = useFormContext()
  const { id } = field
  const storedValue = getValues(id)

  const [addressSearchError, setAddressSearchError] = useState<string | null>(
    null,
  )
  const [propertyInfoError, setPropertyInfoError] = useState<string | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState(storedValue?.value)
  const [searchOptions, setSearchOptions] = useState<AddressProps[]>([])
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
    if (selectedAddress?.addressCode) {
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
    const isInitialRender =
      selectedAddress && searchTerm === selectedAddress.value

    if (searchTerm?.length && !isInitialRender) {
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

    // Handle when page loads with a stored value
    if (storedValue && storedValue.addressCode && !selectedAddress) {
      // Create address object from stored data
      const address: AddressProps = {
        addressCode: storedValue.addressCode,
        address: storedValue.address,
        municipalityName: storedValue.municipalityName,
        municipalityCode: storedValue.municipalityCode,
        postalCode: storedValue.postalCode,
        landCode: storedValue.landCode,
        streetName: storedValue.streetName,
        streetNumber: storedValue.streetNumber,
        label:
          storedValue.label ||
          `${storedValue.address}, ${storedValue.postalCode} ${storedValue.municipalityName}`,
        value: `${storedValue.addressCode}`,
      }

      setSelectedAddress(address)

      // No need to trigger search if we already have the address
      if (storedValue.propertiesByAddressCode?.length) {
        setPropertiesByAddressCode(storedValue.propertiesByAddressCode)
      } else if (address.addressCode) {
        // If we don't have property data, fetch it
        hmsPropertyInfo({
          variables: {
            input: {
              stadfangNr: address.addressCode,
            },
          },
        })
      }
    }

    setTableExpanded(restoreTableExpanded(storedValue))
    setCheckedUnits(restoreCheckedUnits(storedValue))
    setNumOfRoomsValue(restoreRoomsValue(storedValue))
    setUnitSizeChangedValue(restoreSizeValue(storedValue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setAddressSearchError(
        formatMessage(registerProperty.search.addressSearchError) ||
          'Failed to search addresses',
      )
      setPropertiesByAddressCode(undefined)
    },
    onCompleted: (data) => {
      setAddressSearchError(null)
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
      setPropertyInfoError(
        formatMessage(registerProperty.search.propertyInfoError) ||
          'Failed to fetch properties',
      )
      setPropertiesByAddressCode(undefined)
    },
    onCompleted: (data) => {
      setPropertyInfoError(null)
      if (data.hmsPropertyInfo) {
        setPropertiesByAddressCode(data.hmsPropertyInfo.propertyInfos)
      }
    },
  })

  interface StoredValueUnits {
    units?: PropertyUnit[]
  }

  const restoreTableExpanded = (storedValue: StoredValueUnits) => {
    if (!storedValue?.units) return {}
    return storedValue.units.reduce(
      (acc: Record<string, boolean>, unit: PropertyUnit) => {
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
      (acc: Record<string, boolean>, unit: PropertyUnit) => {
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
      (acc: Record<string, number>, unit: PropertyUnit) => {
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
      (acc: Record<string, number>, unit: PropertyUnit) => {
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

  const handleCheckboxChange = (unit: PropertyUnit, checked: boolean) => {
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
      : (storedValue?.units || []).filter((u: PropertyUnit) => {
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
    clearErrors(ERROR_ID)
  }

  const handleUnitSizeChange = (unit: PropertyUnit, value: number) => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`
    setUnitSizeChangedValue((prev) => {
      const newValues = {
        ...prev,
        [unitKey]: value,
      }
      const updatedUnits = (storedValue?.units || []).map((u: PropertyUnit) => {
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
    clearErrors(ERROR_ID)
  }

  const handleUnitRoomsChange = (unit: PropertyUnit, value: string) => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`
    const numberValue = value ? Number(value) : 0
    setNumOfRoomsValue((prev) => {
      const newValues = {
        ...prev,
        [unitKey]: numberValue,
      }
      const updatedUnits = (storedValue?.units || []).map((u: PropertyUnit) => {
        if (
          u.propertyCode === unit.propertyCode &&
          u.unitCode === unit.unitCode
        ) {
          return {
            ...u,
            numOfRooms: numberValue,
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
    clearErrors(ERROR_ID)
  }

  const handleAddressSelectionChange = (
    selection: { value: string } | null,
  ) => {
    clearErrors(id)
    const selectedValue = selection === null ? undefined : selection.value
    const selectedOption = searchOptions.find(
      (option) => option.value === selectedValue,
    )
    setSelectedAddress(selectedOption)
    setValue(
      id,
      selectedOption
        ? {
            ...selectedOption,
            propertiesByAddressCode: propertiesByAddressCode || [],
            units: storedValue?.units || [],
            checkedUnits: checkedUnits,
            numOfRooms: numOfRoomsValue,
            changedValueOfUnitSize: unitSizeChangedValue,
          }
        : undefined,
    )
    clearErrors(ERROR_ID)
  }

  const hasValidationErrors = errors ? Object.keys(errors).length > 0 : false
  const propertySectionHasContent = useMemo(() => {
    return (
      propertiesLoading ||
      (propertiesByAddressCode && propertiesByAddressCode.length > 0)
    )
  }, [propertiesLoading, propertiesByAddressCode])

  return (
    <>
      <Box>
        <Controller
          name={`${id}`}
          defaultValue={EMPTY_OBJECT}
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
        {!propertiesLoading && addressSearchError && (
          <Box marginTop={4}>
            <AlertMessage type="error" title={addressSearchError} />
          </Box>
        )}
        {!propertiesLoading && propertyInfoError && (
          <Box marginTop={4}>
            <AlertMessage type="error" title={propertyInfoError} />
          </Box>
        )}
      </Box>

      {selectedAddress && (
        <Box marginTop={propertySectionHasContent ? 6 : 0}>
          {propertiesLoading ? (
            <div style={{ textAlign: 'center' }}>
              <LoadingDots large />
            </div>
          ) : (
            propertiesByAddressCode &&
            propertiesByAddressCode.length > 0 && (
              <T.Table id="searchresults.table">
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
                                    {appraisalUnit.units?.map((unit) => {
                                      const unitKey = `${unit.propertyCode}_${unit.unitCode}`
                                      return (
                                        <PropertyTableUnits
                                          key={unitKey}
                                          unitCode={unit.unitCode ?? ''}
                                          propertyUsageDescription={
                                            unit.propertyUsageDescription ?? ''
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
                                              e.target.value,
                                            )
                                          }
                                          unitInputErrorMessage={
                                            errors?.registerProperty?.[
                                              `searchresults.units`
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
        </Box>
      )}
      {hasValidationErrors && (
        <Box marginTop={4}>
          {errors?.registerProperty?.['searchresults'] && (
            <AlertMessage
              type="error"
              title={errors?.registerProperty?.['searchresults']}
            />
          )}
          {errors?.registerProperty?.['searchresults.units'] && (
            <AlertMessage
              type="error"
              message={errors?.registerProperty?.['searchresults.units']}
              title={formatMessage(
                registerProperty.search.searchResultsErrorBannerTitle,
              )}
            />
          )}
        </Box>
      )}
    </>
  )
}
