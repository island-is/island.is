import {
  FormSystemField,
  FormSystemLanguageType,
  FormSystemListItem,
} from '@island.is/api/schema'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  LoadingDots,
  Select,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useApolloClient } from '@apollo/client'

import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { Action, ApplicationState } from '../../../lib'
import {
  removeTypename,
  GET_REAL_ESTATE_PROPERTIES,
  GET_REAL_ESTATE_PROPERTY,
} from '@island.is/form-system/graphql'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
  state?: ApplicationState
}

type SelectItem = {
  label: string
  value: {
    label: { is?: string | null; en?: string | null } | null
    value: string | null
  }
}

type PropertyLocation = {
  locationNumber?: number | null
  postNumber?: number | null
  municipality?: string | null
  propertyNumber?: number | null
  display?: string | null
  displayShort?: string | null
}

type SimpleProperty = {
  propertyNumber?: string | null
  defaultAddress?: PropertyLocation | null
}

type RealEstatePropertiesQuery = {
  assetsOverview?: {
    properties?: SimpleProperty[] | null
    paging?: {
      hasNextPage?: boolean | null
    } | null
  } | null
}

type RealEstatePropertiesVars = {
  input: {
    cursor?: string | null
  }
}

type RealEstatePropertyQuery = {
  assetsDetail?: {
    propertyNumber?: string | null
    defaultAddress?: PropertyLocation | null
  } | null
}

type RealEstatePropertyVars = {
  input: {
    assetId: string
  }
}

const PROPERTY_NUMBER_REGEX = /^\d{7}$/

export const RealEstate = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger, setValue, setError, clearErrors } = useFormContext()
  const client = useApolloClient()

  const propertyNumberField = `${item.id}.${valueIndex}_propertyNumber`
  const addressField = `${item.id}.${valueIndex}_address`
  const postalCodeField = `${item.id}.${valueIndex}_postalCode`
  const municipalityField = `${item.id}.${valueIndex}_municipality`

  const shouldFetch = item.fieldSettings?.isDropdown ?? false
  const cached = (item.list?.length ?? 0) > 0

  const toLanguage = (value: string): FormSystemLanguageType => ({
    is: value,
    en: value,
  })

  const dispatchAssetValue = (
    propertyNumber: string,
    address: string,
    postalCode: string,
    municipality: string,
  ) => {
    dispatch?.({
      type: 'SET_ASSET_VALUE',
      payload: {
        id: item.id,
        valueIndex,
        propertyNumber,
        address,
        postalCode,
        municipality,
      },
    })
  }

  const getAddressParts = (address?: PropertyLocation | null) => ({
    address: address?.display ?? address?.displayShort ?? '',
    postalCode: address?.postNumber?.toString() ?? '',
    municipality: address?.municipality ?? '',
  })

  const parsePropertyFromLabel = (label: string) => {
    const separator = ' - '
    const separatorIndex = label.indexOf(separator)

    if (separatorIndex < 0) {
      return {
        propertyNumber: label.trim(),
        address: '',
      }
    }

    return {
      propertyNumber: label.slice(0, separatorIndex).trim(),
      address: label.slice(separatorIndex + separator.length).trim(),
    }
  }

  const [propertyList, setPropertyList] = useState<
    (FormSystemListItem | null)[]
  >(item.list ?? [])
  const [selectedOption, setSelectedOption] = useState<SelectItem | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(shouldFetch && !cached)
  const [propertiesFetchHasError, setPropertiesFetchHasError] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const buildListItem = (property: SimpleProperty): FormSystemListItem => {
    const propertyNumber = property.propertyNumber ?? ''
    const { address } = getAddressParts(property.defaultAddress)

    const labelText = address
      ? `${propertyNumber} - ${address}`
      : propertyNumber

    return {
      id: propertyNumber,
      label: {
        is: labelText,
        en: labelText,
      },
      value: propertyNumber,
      isSelected: false,
    }
  }

  const fetchAllProperties = async (): Promise<
    (FormSystemListItem | null)[]
  > => {
    let cursor = 1
    let hasNextPage = true
    const allItems: FormSystemListItem[] = []
    const seen = new Set<string>()

    while (hasNextPage) {
      const result = await client.query<
        RealEstatePropertiesQuery,
        RealEstatePropertiesVars
      >({
        query: GET_REAL_ESTATE_PROPERTIES,
        variables: {
          input: {
            cursor: cursor.toString(),
          },
        },
        fetchPolicy: 'network-only',
      })

      const pageData = result.data?.assetsOverview
      if (!pageData) {
        break
      }

      const pageItems = pageData.properties ?? []
      for (const property of pageItems) {
        if (!property?.propertyNumber || seen.has(property.propertyNumber)) {
          continue
        }

        seen.add(property.propertyNumber)
        allItems.push(buildListItem(property))
      }

      hasNextPage = pageData.paging?.hasNextPage ?? false
      cursor += 1
    }

    return allItems
  }

  const fetchProperty = async (propertyNumber: string) => {
    const normalized = propertyNumber.trim()

    if (!normalized) {
      setValue(propertyNumberField, '')
      setValue(addressField, '')
      setValue(postalCodeField, '')
      setValue(municipalityField, '')
      clearErrors(propertyNumberField)
      clearErrors(addressField)
      clearErrors(postalCodeField)
      clearErrors(municipalityField)
      return
    }

    if (!PROPERTY_NUMBER_REGEX.test(normalized)) {
      return
    }

    setSearchLoading(true)

    try {
      const result = await client.query<
        RealEstatePropertyQuery,
        RealEstatePropertyVars
      >({
        query: GET_REAL_ESTATE_PROPERTY,
        variables: {
          input: {
            assetId: normalized,
          },
        },
        fetchPolicy: 'network-only',
      })

      const propertyData = result.data?.assetsDetail

      if (propertyData?.propertyNumber) {
        const propertyNumber = propertyData.propertyNumber
        const { address, postalCode, municipality } = getAddressParts(
          propertyData.defaultAddress,
        )

        setValue(propertyNumberField, propertyNumber)
        setValue(addressField, address)
        setValue(postalCodeField, postalCode)
        setValue(municipalityField, municipality)

        dispatchAssetValue(propertyNumber, address, postalCode, municipality)

        clearErrors(propertyNumberField)
        clearErrors(addressField)
        clearErrors(postalCodeField)
        clearErrors(municipalityField)
      } else {
        setValue(addressField, '')
        setValue(postalCodeField, '')
        setValue(municipalityField, '')
        setError(propertyNumberField, {
          type: 'validate',
          message: formatMessage(m.invalidPropertyNumber),
        })
        setError(addressField, {
          type: 'validate',
          message: '',
        })
        setError(postalCodeField, {
          type: 'validate',
          message: '',
        })
        setError(municipalityField, {
          type: 'validate',
          message: '',
        })
      }
    } catch (_error) {
      setValue(addressField, '')
      setValue(postalCodeField, '')
      setValue(municipalityField, '')
      setError(propertyNumberField, {
        type: 'validate',
        message: formatMessage(m.invalidPropertyNumber),
      })
      setError(addressField, {
        type: 'validate',
        message: '',
      })
      setError(postalCodeField, {
        type: 'validate',
        message: '',
      })
      setError(municipalityField, {
        type: 'validate',
        message: '',
      })
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    if (!shouldFetch) {
      setIsLoading(false)
      return
    }

    if (cached) {
      const list = item.list ?? []
      setPropertyList(list)
      setIsLoading(false)
      setPropertiesFetchHasError(false)
      return
    }

    setIsLoading(true)
    setPropertiesFetchHasError(false)
    ;(async () => {
      try {
        const list = await fetchAllProperties()

        if (cancelled) {
          return
        }

        setPropertyList(list)

        dispatch?.({
          type: 'SET_FIELD_LIST',
          payload: {
            id: item.id,
            list: removeTypename(list),
            placeholder: null,
          },
        })
      } catch (_error) {
        if (!cancelled) {
          setPropertyList([])
          setPropertiesFetchHasError(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mapToSelectItems = useCallback(
    (items: (FormSystemListItem | null)[]): SelectItem[] =>
      items
        .filter((listItem): listItem is FormSystemListItem => listItem !== null)
        .map((listItem) => ({
          label: listItem.label?.[lang] ?? '',
          value: {
            label: listItem.label ?? null,
            value: listItem.value ?? null,
          },
        })),
    [lang],
  )

  useEffect(() => {
    if (!shouldFetch || isLoading || propertiesFetchHasError) {
      return
    }

    const storedPropertyNumber = getValue(item, 'propertyNumber', valueIndex)
    if (!storedPropertyNumber) {
      return
    }

    const options = mapToSelectItems(propertyList)
    const initial = options.find(
      (opt) => opt.value.value === storedPropertyNumber,
    )

    if (initial) {
      setSelectedOption(initial)
      setValue(propertyNumberField, initial.label)
    }
  }, [
    shouldFetch,
    isLoading,
    propertiesFetchHasError,
    item,
    valueIndex,
    propertyList,
    propertyNumberField,
    setValue,
    mapToSelectItems,
  ])

  useEffect(() => {
    if (!shouldFetch) return
    if (isLoading) return
    if (propertiesFetchHasError) {
      trigger(propertyNumberField)
      trigger(addressField)
      trigger(postalCodeField)
      trigger(municipalityField)
    }
  }, [
    shouldFetch,
    isLoading,
    propertiesFetchHasError,
    trigger,
    propertyNumberField,
    addressField,
    postalCodeField,
    municipalityField,
  ])

  const selectOptions = useMemo(
    () => mapToSelectItems(propertyList),
    [propertyList, mapToSelectItems],
  )

  if (shouldFetch) {
    return (
      <Controller
        key={item.id + '-' + valueIndex}
        name={propertyNumberField}
        control={control}
        defaultValue={selectedOption?.label ?? ''}
        rules={{
          required: {
            value: item?.isRequired ?? false,
            message: formatMessage(m.required),
          },
          validate: () => {
            if (shouldFetch && propertiesFetchHasError) {
              return formatMessage(m.listFetchFailed)
            }
            return true
          },
        }}
        render={({ field, fieldState }) =>
          isLoading ? (
            <Box>
              <SkeletonLoader
                height={48}
                display="block"
                borderRadius="large"
              />
              <Box marginLeft={1}>
                <LoadingDots />
              </Box>
            </Box>
          ) : (
            <Select
              name="list"
              label={item.name?.[lang] ?? ''}
              options={selectOptions}
              required={item.isRequired ?? false}
              placeholder={formatMessage(m.select)}
              backgroundColor="blue"
              isClearable={item.isRequired ? false : true}
              onChange={(option) => {
                const selectedLabel = option?.label ?? ''
                const propertyNumber = option?.value?.value ?? ''
                const { address } = parsePropertyFromLabel(selectedLabel)

                field.onChange(selectedLabel)
                trigger(field.name)
                setSelectedOption(option ?? undefined)

                dispatchAssetValue(propertyNumber, address, '', '')
              }}
              value={selectedOption}
              hasError={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
            />
          )
        }
      />
    )
  }

  return (
    <Stack space={2}>
      <Controller
        key={`${item.id}-${valueIndex}_propertyNumber`}
        name={propertyNumberField}
        control={control}
        defaultValue={getValue(item, 'propertyNumber', valueIndex) ?? ''}
        rules={{
          required: {
            value: item?.isRequired ?? false,
            message: formatMessage(m.required),
          },
          pattern: {
            value: PROPERTY_NUMBER_REGEX,
            message: formatMessage(m.invalidPropertyNumber),
          },
        }}
        render={({ field, fieldState }) => (
          <GridRow>
            <GridColumn span="6/10">
              <Input
                label={item.name?.[lang] ?? ''}
                name="propertySearch"
                value={field.value}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 7)
                  field.onChange(value)

                  setValue(addressField, '')
                  setValue(postalCodeField, '')
                  setValue(municipalityField, '')
                  clearErrors(propertyNumberField)
                  clearErrors(addressField)
                  clearErrors(postalCodeField)
                  clearErrors(municipalityField)

                  dispatchAssetValue('', '', '', '')
                }}
                onBlur={() => {
                  fetchProperty(field.value)
                }}
                placeholder={formatMessage(m.enterPropertyNumber)}
                required={item.isRequired ?? false}
                hasError={Boolean(fieldState.error)}
                errorMessage={fieldState.error?.message}
              />
            </GridColumn>
          </GridRow>
        )}
      />

      {searchLoading && <LoadingDots />}

      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/1', '7/10']}>
          <Controller
            key={`${item.id}-${valueIndex}_address`}
            name={addressField}
            control={control}
            defaultValue={getValue(item, 'address', valueIndex) ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.address)}
                name="propertyAddress"
                value={field.value}
                required={item?.isRequired ?? false}
                readOnly
                backgroundColor="blue"
                loading={searchLoading}
                hasError={Boolean(fieldState.error)}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </GridColumn>

        <GridColumn span={['1/1', '1/1', '1/1', '3/10']}>
          <Controller
            key={`${item.id}-${valueIndex}_postalCode`}
            name={postalCodeField}
            control={control}
            defaultValue={getValue(item, 'postalCode', valueIndex) ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.postalCode)}
                name="propertyPostalCode"
                value={field.value}
                required={item?.isRequired ?? false}
                readOnly
                backgroundColor="blue"
                loading={searchLoading}
                hasError={Boolean(fieldState.error)}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </GridColumn>
      </GridRow>

      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/1', '7/10']}>
          <Controller
            key={`${item.id}-${valueIndex}_municipality`}
            name={municipalityField}
            control={control}
            defaultValue={getValue(item, 'municipality', valueIndex) ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.city)}
                name="propertyMunicipality"
                value={field.value}
                required={item?.isRequired ?? false}
                readOnly
                backgroundColor="blue"
                loading={searchLoading}
                hasError={Boolean(fieldState.error)}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </GridColumn>
      </GridRow>
    </Stack>
  )
}
