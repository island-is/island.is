import { FC, Fragment, useEffect, useState } from 'react'
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
  PROPERTY_CODE_INFO_QUERY,
  PROPERTY_INFO_QUERY,
} from '../../graphql/queries'
import {
  HmsSearchInput,
  Query,
  HmsPropertyInfo,
  HmsPropertyInfoInput,
  HmsPropertyCodeInfoInput,
} from '@island.is/api/schema'
import { AddressProps, PropertyUnit } from '../../shared'
import { PropertyTableHeader } from './components/PropertyTableHeader'
import { PropertyTableRow } from './components/PropertyTableRow'
import { PropertyTableUnits } from './components/PropertyTableUnits'
import * as m from '../../lib/messages'

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

  const cleanupSearch = (searchTerm: string): number | null => {
    if (!searchTerm) return 0
    const cleanedTerm = searchTerm.replace(/^f|^F/, '')
    const numberValue = parseInt(cleanedTerm, 10)
    return isNaN(numberValue) ? null : numberValue
  }

  useEffect(() => {
    const isInitialRender =
      selectedAddress && searchTerm === selectedAddress.value

    const isFasteignaNr = /^(?:[fF]\d*|\d+)$/.test(searchTerm || '')

    if (!!searchTerm?.length && !isInitialRender && isFasteignaNr) {
      const searchedPropertyCode = cleanupSearch(searchTerm)
      if (
        searchedPropertyCode &&
        searchedPropertyCode.toString().length === 7
      ) {
        setValue(id, {
          ...storedValue,
          selectedPropertyCode: searchedPropertyCode,
        })
        setPropertiesByAddressCode(undefined)
        hmsPropertyCodeInfo({
          variables: {
            input: {
              fasteignNr: searchedPropertyCode,
            },
          },
        })
      } else {
        setSearchOptions([])
      }
    } else if (searchTerm?.length && !isInitialRender) {
      setValue(id, {
        ...storedValue,
        selectedPropertyCode: undefined,
      })
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
              fasteignNr: storedValue?.selectedPropertyCode || undefined,
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
        formatMessage(m.registerProperty.search.addressSearchError) ||
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
        formatMessage(m.registerProperty.search.propertyInfoError) ||
          'Failed to fetch properties',
      )
      setPropertiesByAddressCode(undefined)
    },
    onCompleted: (data) => {
      setPropertyInfoError(null)
      if (data.hmsPropertyInfo) {
        setPropertiesByAddressCode(data.hmsPropertyInfo.propertyInfos)
      }

      const propertyValues = data.hmsPropertyInfo?.propertyInfos?.[0]

      const addressValues = {
        addressCode: propertyValues?.addressCode,
        address: propertyValues?.address,
        municipalityName: propertyValues?.municipalityName,
        municipalityCode: propertyValues?.municipalityCode,
        postalCode: propertyValues?.postalCode,
        landCode: propertyValues?.landCode,
        streetName: undefined,
        streetNumber: undefined,
        label: `${propertyValues?.address}, ${propertyValues?.postalCode} ${propertyValues?.municipalityName}`,
        value: `${propertyValues?.addressCode}`,
      }

      setSelectedAddress(addressValues)

      setValue(id, {
        ...storedValue,
        ...addressValues,
        units: [],
        checkedUnits: checkedUnits,
        numOfRooms: numOfRoomsValue,
        changedValueOfUnitSize: unitSizeChangedValue,
        selectedPropertyCode: storedValue?.selectedPropertyCode,
        propertiesByAddressCode: data?.hmsPropertyInfo?.propertyInfos || [],
      })
    },
  })

  const [hmsPropertyCodeInfo, { loading: propertycodeLoading }] = useLazyQuery<
    Query,
    { input: HmsPropertyCodeInfoInput }
  >(PROPERTY_CODE_INFO_QUERY, {
    onError: (error) => {
      console.error('Error fetching properties by fasteignNr', error)
      setPropertyInfoError(
        formatMessage(m.registerProperty.search.propertyInfoError) ||
          'Failed to fetch properties',
      )
      setPropertiesByAddressCode(undefined)
    },
    onCompleted: (data) => {
      if (data.hmsPropertyCodeInfo) {
        const propertyInfo = data.hmsPropertyCodeInfo.address
        const searchOptions = {
          ...propertyInfo,
          label: propertyInfo?.address || '',
          value: propertyInfo?.addressCode?.toString() || '',
        }
        setSearchOptions([searchOptions])
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

  const handleUnitChange = (
    unit: PropertyUnit,
    keyToUpdate: keyof PropertyUnit,
    value: string,
  ) => {
    const unitKey = `${unit.propertyCode}_${unit.unitCode}`
    const parsed = Number(value)
    const numberValue = Number.isFinite(parsed) ? parsed : 0

    const updateFunc = (prev: Record<string, number>) => {
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
            [keyToUpdate]: numberValue,
          }
        }
        return u
      })
      setValue(id, {
        ...getValues(id),
        units: updatedUnits,
      })
      return newValues
    }

    if (keyToUpdate === 'changedSize') {
      setUnitSizeChangedValue(updateFunc)
    } else if (keyToUpdate === 'numOfRooms') {
      setNumOfRoomsValue(updateFunc)
    }

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
            units: [],
            checkedUnits: checkedUnits,
            numOfRooms: numOfRoomsValue,
            changedValueOfUnitSize: unitSizeChangedValue,
            selectedPropertyCode: storedValue?.selectedPropertyCode,
          }
        : undefined,
    )
    clearErrors(ERROR_ID)
    if (selectedOption?.addressCode) {
      hmsPropertyInfo({
        variables: {
          input: {
            stadfangNr: selectedOption?.addressCode,
            fasteignNr: storedValue?.selectedPropertyCode || undefined,
          },
        },
      })
    }
  }

  const hasValidationErrors = errors ? Object.keys(errors).length > 0 : false
  const propertySectionHasContent =
    propertiesLoading ||
    propertycodeLoading ||
    (propertiesByAddressCode && propertiesByAddressCode.length > 0)

  const propertySearchLoading = propertiesLoading || propertycodeLoading

  return (
    <>
      <Box>
        <Controller
          name={`${id}`}
          defaultValue={EMPTY_OBJECT}
          render={() => {
            return (
              <AsyncSearch
                options={searchOptions}
                placeholder={formatMessage(
                  m.registerProperty.search.propertySearchPlaceholder,
                )}
                initialInputValue={selectedAddress ? selectedAddress.label : ''}
                inputValue={
                  searchTerm || (selectedAddress ? selectedAddress.label : '')
                }
                closeMenuOnSubmit
                size="large"
                colored
                onChange={(selection: { value: string } | null) => {
                  handleAddressSelectionChange(selection)
                }}
                onInputValueChange={(newValue: string) => {
                  setSearchTerm(newValue)
                }}
                loading={searchLoading || propertycodeLoading}
              />
            )
          }}
        />
        {!propertySearchLoading && addressSearchError && (
          <Box marginTop={4}>
            <AlertMessage type="error" title={addressSearchError} />
          </Box>
        )}
        {!propertySearchLoading && propertyInfoError && (
          <Box marginTop={4}>
            <AlertMessage type="error" title={propertyInfoError} />
          </Box>
        )}
      </Box>

      {selectedAddress && (
        <Box marginTop={propertySectionHasContent ? 6 : 0}>
          {propertySearchLoading ? (
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
                                            handleUnitChange(
                                              unit,
                                              'changedSize',
                                              e.target.value,
                                            )
                                          }
                                          onUnitRoomsChange={(e) =>
                                            handleUnitChange(
                                              unit,
                                              'numOfRooms',
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
                m.registerProperty.search.searchResultsErrorBannerTitle,
              )}
            />
          )}
        </Box>
      )}
    </>
  )
}
