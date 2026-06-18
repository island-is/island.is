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
  GET_VEHICLES_LIST_V3,
  GET_PUBLIC_VEHICLE_SEARCH,
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

type Color = {
  code: string
  name: string
}

type VehiclesListV3Query = {
  vehiclesListV3?: {
    totalPages: number
    vehicleList?: Array<{
      vehicleId: string
      make?: string | null
      color?: Color | null
      registration?: { number: string } | null
    }> | null
  } | null
}

type VehiclesListV3Vars = {
  input: {
    page: number
    pageSize: number
    includeNextMainInspectionDate: boolean
  }
}

type PublicVehicleSearchQuery = {
  publicVehicleSearch?: {
    permno?: string | null
    regno?: string | null
    vin?: string | null
    make?: string | null
    vehicleCommercialName?: string | null
    color?: string | null
    vehicleStatus?: string | null
  } | null
}

type PublicVehicleSearchVars = {
  input: {
    search: string
  }
}

const VEHICLES_PAGE_SIZE = 100

export const Vehicle = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger, setValue, setError, clearErrors } = useFormContext()
  const client = useApolloClient()

  const registrationNumberField = `${item.id}.${valueIndex}_registrationNumber`
  const modelField = `${item.id}.${valueIndex}_model`
  const colorField = `${item.id}.${valueIndex}_color`

  const shouldFetch = item.fieldSettings?.isDropdown ?? false
  const cached = (item.list?.length ?? 0) > 0

  const toLanguage = (value: string): FormSystemLanguageType => ({
    is: value,
    en: value,
  })

  const dispatchAssetValue = (
    registrationNumber: string,
    model: string,
    color: FormSystemLanguageType,
  ) => {
    dispatch?.({
      type: 'SET_ASSET_VALUE',
      payload: {
        id: item.id,
        valueIndex,
        registrationNumber,
        model,
        color,
      },
    })
  }

  const parseModelAndColorFromLabel = (label: string) => {
    const separator = ' - '
    const separatorIndex = label.indexOf(separator)

    if (separatorIndex < 0) {
      return { model: '', color: '' }
    }

    let modelPart = label.slice(separatorIndex + separator.length).trim()
    let color = ''

    const colorMatch = modelPart.match(/\(([^()]*)\)\s*$/)
    if (colorMatch) {
      color = colorMatch[1].trim()
      modelPart = modelPart.slice(0, colorMatch.index).trim()
    }

    return {
      model: modelPart,
      color,
    }
  }

  const [vehicleList, setVehicleList] = useState<(FormSystemListItem | null)[]>(
    item.list ?? [],
  )
  const [selectedOption, setSelectedOption] = useState<SelectItem | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(shouldFetch && !cached)
  const [vehiclesFetchHasError, setVehiclesFetchHasError] = useState(false)

  const [searchLoading, setSearchLoading] = useState(false)
  // const [searchResult, setSearchResult] = useState<
  //   PublicVehicleSearchQuery['publicVehicleSearch'] | null
  // >(null)

  const buildListItem = (vehicle: {
    vehicleId: string
    make?: string | null
    registration?: { number: string } | null
    color?: Color | null
  }): FormSystemListItem => {
    const registrationNumber = vehicle.registration?.number ?? vehicle.vehicleId
    const labelText = vehicle.make
      ? registrationNumber +
        ' - ' +
        vehicle.make +
        (vehicle.color ? ' (' + vehicle.color.name + ')' : '')
      : registrationNumber

    return {
      id: vehicle.vehicleId,
      label: {
        is: labelText,
        en: labelText,
      },
      value: registrationNumber,
      isSelected: false,
    }
  }

  const fetchAllVehicles = async (): Promise<(FormSystemListItem | null)[]> => {
    let page = 1
    let totalPages = 1
    const allItems: FormSystemListItem[] = []
    const seen = new Set<string>()

    while (page <= totalPages) {
      const result = await client.query<
        VehiclesListV3Query,
        VehiclesListV3Vars
      >({
        query: GET_VEHICLES_LIST_V3,
        variables: {
          input: {
            page,
            pageSize: VEHICLES_PAGE_SIZE,
            includeNextMainInspectionDate: false,
          },
        },
        fetchPolicy: 'network-only',
      })

      const pageData = result.data?.vehiclesListV3
      if (!pageData) {
        break
      }

      totalPages = pageData.totalPages ?? totalPages

      const pageItems = pageData.vehicleList ?? []
      for (const vehicle of pageItems) {
        if (!vehicle || seen.has(vehicle.vehicleId)) {
          continue
        }

        seen.add(vehicle.vehicleId)
        allItems.push(buildListItem(vehicle))
      }

      page += 1
    }

    return allItems
  }

  const searchPublicVehicle = async (search: string) => {
    const normalized = search.trim().toUpperCase()

    if (!normalized) {
      // setSearchResult(null)
      setValue(registrationNumberField, '')
      setValue(modelField, '')
      setValue(colorField, '')
      clearErrors(registrationNumberField)
      clearErrors(modelField)
      clearErrors(colorField)
      return
    }

    setSearchLoading(true)
    // setSearchResult(null)

    try {
      const result = await client.query<
        PublicVehicleSearchQuery,
        PublicVehicleSearchVars
      >({
        query: GET_PUBLIC_VEHICLE_SEARCH,
        variables: {
          input: { search: normalized },
        },
        fetchPolicy: 'network-only',
      })

      const vehicleData = result.data?.publicVehicleSearch

      if (vehicleData) {
        const registrationNumber = vehicleData.permno ?? vehicleData.regno ?? ''
        const model = `${vehicleData.make ?? ''} ${
          vehicleData.vehicleCommercialName ?? ''
        }`.trim()
        const color = vehicleData.color ?? ''

        // setSearchResult(vehicleData)
        setValue(registrationNumberField, registrationNumber)
        setValue(modelField, model)
        setValue(colorField, color)

        dispatchAssetValue(registrationNumber, model, toLanguage(color))

        clearErrors(registrationNumberField)
        clearErrors(modelField)
        clearErrors(colorField)
      } else {
        // setSearchResult(null)
        setValue(modelField, '')
        setValue(colorField, '')
        setError(registrationNumberField, {
          type: 'validate',
          message: 'Vehicle not found',
        })
        setError(modelField, {
          type: 'validate',
          message: 'Vehicle not found',
        })
        setError(colorField, {
          type: 'validate',
          message: 'Vehicle not found',
        })
      }
    } catch (_error) {
      // setSearchResult(null)
      setValue(modelField, '')
      setValue(colorField, '')
      setError(registrationNumberField, {
        type: 'validate',
        message: 'Vehicle not found',
      })
      setError(modelField, {
        type: 'validate',
        message: 'Vehicle not found',
      })
      setError(colorField, {
        type: 'validate',
        message: 'Vehicle not found',
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
      setVehicleList(list)
      setIsLoading(false)
      setVehiclesFetchHasError(false)
      return
    }

    setIsLoading(true)
    setVehiclesFetchHasError(false)
    ;(async () => {
      try {
        const list = await fetchAllVehicles()

        if (cancelled) {
          return
        }

        setVehicleList(list)

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
          setVehicleList([])
          setVehiclesFetchHasError(true)
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
    if (!shouldFetch || isLoading || vehiclesFetchHasError) {
      return
    }

    const storedRegistration = getValue(item, 'registrationNumber', valueIndex)
    if (!storedRegistration) {
      return
    }

    const options = mapToSelectItems(vehicleList)
    const initial = options.find(
      (opt) => opt.value.value === storedRegistration,
    )

    if (initial) {
      setSelectedOption(initial)
      setValue(registrationNumberField, initial.label)
    }
  }, [
    shouldFetch,
    isLoading,
    vehiclesFetchHasError,
    item,
    valueIndex,
    vehicleList,
    registrationNumberField,
    setValue,
    mapToSelectItems,
  ])

  useEffect(() => {
    if (!shouldFetch) return
    if (isLoading) return
    if (vehiclesFetchHasError) {
      trigger(registrationNumberField)
      trigger(modelField)
      trigger(colorField)
    }
  }, [
    shouldFetch,
    isLoading,
    vehiclesFetchHasError,
    trigger,
    registrationNumberField,
    modelField,
    colorField,
  ])

  const selectOptions = useMemo(
    () => mapToSelectItems(vehicleList),
    [vehicleList, mapToSelectItems],
  )

  if (shouldFetch) {
    return (
      <Controller
        key={item.id + '-' + valueIndex}
        name={registrationNumberField}
        control={control}
        defaultValue={selectedOption?.label ?? ''}
        rules={{
          required: {
            value: item?.isRequired ?? false,
            message: formatMessage(m.required),
          },
          validate: () => {
            if (shouldFetch && vehiclesFetchHasError) {
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
                const registrationNumber = option?.value?.value ?? ''
                const { model, color } =
                  parseModelAndColorFromLabel(selectedLabel)

                field.onChange(selectedLabel)
                trigger(field.name)
                setSelectedOption(option ?? undefined)

                dispatchAssetValue(registrationNumber, model, {
                  is: color,
                  en: color,
                })
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
        key={`${item.id}-${valueIndex}_registrationNumber`}
        name={registrationNumberField}
        control={control}
        defaultValue={getValue(item, 'registrationNumber', valueIndex) ?? ''}
        rules={{
          required: {
            value: item?.isRequired ?? false,
            message: formatMessage(m.required),
          },
        }}
        render={({ field, fieldState }) => (
          <GridRow>
            <GridColumn span="6/10">
              <Input
                label={item.name?.[lang] ?? ''}
                name="vehicleSearch"
                value={field.value}
                onChange={(e) => {
                  const upper = e.target.value.toUpperCase()
                  field.onChange(upper)

                  // Clear derived fields immediately when registration changes
                  setValue(modelField, '')
                  setValue(colorField, '')
                  clearErrors(registrationNumberField)
                  clearErrors(modelField)
                  clearErrors(colorField)

                  // Keep application state from showing stale model/color
                  dispatchAssetValue('', '', toLanguage(''))
                }}
                onBlur={() => {
                  searchPublicVehicle(field.value)
                }}
                placeholder="Enter registration number or VIN"
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
            key={`${item.id}-${valueIndex}_model`}
            name={modelField}
            control={control}
            defaultValue={getValue(item, 'model', valueIndex) ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.model)}
                name="vehicleModel"
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
            key={`${item.id}-${valueIndex}_color`}
            name={colorField}
            control={control}
            defaultValue={getValue(item, 'color', valueIndex)?.[lang] ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.color)}
                name="vehicleColor"
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
