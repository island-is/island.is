import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  LoadingDots,
  Table,
} from '@island.is/island-ui/core'
import { AddressProps, PropertyUnit } from '../../shared'
import { PropertyTableHeader } from './components/PropertyTableHeader'
import {
  cleanupSearch,
  isFasteignaNr,
  restoreValueBoolean,
  restoreValueNumber,
} from '../../utils/utils'
import { usePropertyCodeInfo } from './hooks/usePropertyCodeInfo'
import { useAddressSearch } from './hooks/useAddressSearch'
import { usePropertyInfo } from './hooks/usePropertyInfo'
import { PropertySearchInput } from './components/PropertySearchInput'
import { PropertyTableBody } from './components/PropertyTableBody'
import * as m from '../../lib/messages'
import { HmsPropertyInfo } from '@island.is/api/schema'
import { clearInputsOnChange } from '@island.is/shared/utils'

const ERROR_ID = 'registerProperty'

interface Props extends FieldBaseProps {
  field: CustomField
  errors?: Record<string, Record<string, string>>
}

export const PropertySearch = ({ field, errors }: Props) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue, getValues } = useFormContext()
  const { id } = field
  const storedValue: AddressProps = getValues(id)
  const onlyAddressSearch: boolean =
    field?.props && typeof field.props['onlyAddressSearch'] === 'boolean'
      ? (field.props['onlyAddressSearch'] as boolean)
      : false
  const [addressSearchError, setAddressSearchError] = useState<string | null>(
    null,
  )
  const [propertyInfoError, setPropertyInfoError] = useState<string | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState(storedValue?.label ?? '')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    storedValue?.label ?? '',
  )
  const [searchOptions, setSearchOptions] = useState<Array<AddressProps>>([])
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
    Array<HmsPropertyInfo> | undefined
  >(storedValue?.propertiesByAddressCode || [])

  // Handle debounced search term changes
  const handleDebouncedSearchTermChange = (newSearchTerm: string) => {
    setDebouncedSearchTerm(newSearchTerm)
  }

  useEffect(() => {
    const isInitialRender =
      !!selectedAddress &&
      (debouncedSearchTerm === selectedAddress?.value ||
        debouncedSearchTerm === selectedAddress?.label)

    if (!debouncedSearchTerm?.length || debouncedSearchTerm.length < 3) {
      if (!isInitialRender) {
        setSearchOptions([])
      }
      return
    }

    const cleanedPropertyCode = cleanupSearch(debouncedSearchTerm)

    if (
      !isInitialRender &&
      isFasteignaNr(debouncedSearchTerm) &&
      cleanedPropertyCode?.toString().length === 7
    ) {
      setValue(id, {
        ...storedValue,
        selectedPropertyCode: cleanedPropertyCode,
      })
      setPropertiesByAddressCode(undefined)
      hmsPropertyCodeInfo({
        variables: {
          input: {
            fasteignNr: cleanedPropertyCode,
          },
        },
      })
      setSearchOptions([])
      return
    }

    if (!isInitialRender) {
      setValue(id, {
        ...storedValue,
        selectedPropertyCode: undefined,
      })
      hmsSearch({
        variables: {
          input: {
            partialStadfang: debouncedSearchTerm,
          },
        },
      })
      setSearchOptions([])
      return
    }

    setSearchOptions([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

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

    setTableExpanded(restoreValueBoolean(storedValue, 'expanded'))
    setCheckedUnits(restoreValueBoolean(storedValue, 'checked'))
    setNumOfRoomsValue(restoreValueNumber(storedValue, 'numOfRooms'))
    setUnitSizeChangedValue(restoreValueNumber(storedValue, 'changedSize'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedValue])

  useEffect(() => {
    clearErrors(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { hmsPropertyCodeInfo, propertycodeLoading } = usePropertyCodeInfo(
    setSearchOptions,
    setPropertiesByAddressCode,
    setPropertyInfoError,
  )
  const { hmsSearch, searchLoading } = useAddressSearch(
    setSearchOptions,
    setAddressSearchError,
    setPropertiesByAddressCode,
  )
  const { hmsPropertyInfo, propertiesLoading } = usePropertyInfo(
    id,
    storedValue,
    setValue,
    setPropertiesByAddressCode,
    setSelectedAddress,
    setPropertyInfoError,
    checkedUnits,
    numOfRoomsValue,
    unitSizeChangedValue,
  )

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
    // Apply clearOnChange for this custom field (if configured in field config)
    if (Array.isArray(field.clearOnChange) && field.clearOnChange.length > 0) {
      clearInputsOnChange(field.clearOnChange, setValue)
    }
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
        <PropertySearchInput
          searchOptions={searchOptions}
          id={id}
          selectedAddress={selectedAddress}
          searchTerm={searchTerm}
          handleAddressSelectionChange={handleAddressSelectionChange}
          setSearchTerm={setSearchTerm}
          onSearchTermChange={handleDebouncedSearchTermChange}
          searchLoading={searchLoading}
          propertycodeLoading={propertycodeLoading}
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
        <Box
          marginTop={propertySectionHasContent && !onlyAddressSearch ? 6 : 0}
        >
          {propertySearchLoading ? (
            <div style={{ textAlign: 'center' }}>
              <LoadingDots size="large" />
            </div>
          ) : (
            propertiesByAddressCode &&
            propertiesByAddressCode.length > 0 &&
            !onlyAddressSearch && (
              <Table.Table id="searchresults.table">
                <PropertyTableHeader />
                <PropertyTableBody
                  propertiesByAddressCode={propertiesByAddressCode || []}
                  tableExpanded={tableExpanded}
                  toggleExpand={toggleExpand}
                  checkedUnits={checkedUnits}
                  numOfRoomsValue={numOfRoomsValue}
                  unitSizeChangedValue={unitSizeChangedValue}
                  handleCheckboxChange={handleCheckboxChange}
                  handleUnitChange={handleUnitChange}
                  errors={errors || {}}
                />
              </Table.Table>
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
                m.propertySearch.search.searchResultsErrorBannerTitle,
              )}
            />
          )}
        </Box>
      )}
    </>
  )
}
