import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import {
  Box,
  LoadingDots,
  Select,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useApolloClient } from '@apollo/client'

import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { Action, ApplicationState } from '../../../lib'
import {
  removeTypename,
  GET_VEHICLES_LIST_V3,
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

type VehiclesListV3Query = {
  vehiclesListV3?: {
    totalPages: number
    vehicleList?: Array<{
      vehicleId: string
      make?: string | null
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

const VEHICLES_PAGE_SIZE = 100

export const Vehicle = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger, setValue, getValues } = useFormContext()
  const client = useApolloClient()

  const fieldName = item.id + '.' + valueIndex
  const shouldFetch = item.fieldSettings?.isDropdown ?? false

  const [vehicleList, setVehicleList] = useState<(FormSystemListItem | null)[]>(
    item.list ?? [],
  )
  const [isLoading, setIsLoading] = useState(
    shouldFetch && (item.list?.length ?? 0) === 0,
  )
  const [vehiclesFetchHasError, setVehiclesFetchHasError] = useState(false)

  const buildListItem = (vehicle: {
    vehicleId: string
    make?: string | null
    registration?: { number: string } | null
  }): FormSystemListItem => {
    const registrationNumber = vehicle.registration?.number ?? vehicle.vehicleId
    const labelText = vehicle.make
      ? registrationNumber + ' - ' + vehicle.make
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

  useEffect(() => {
    let cancelled = false

    if (!shouldFetch) {
      setIsLoading(false)
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
  }, [client, dispatch, item.id, shouldFetch])

  useEffect(() => {
    if (!shouldFetch) return
    if (isLoading) return
    if (vehiclesFetchHasError) trigger(fieldName)
  }, [shouldFetch, isLoading, vehiclesFetchHasError, trigger, fieldName])

  const mapToSelectItems = (
    items: (FormSystemListItem | null)[],
  ): SelectItem[] =>
    items
      .filter((listItem): listItem is FormSystemListItem => listItem !== null)
      .map((listItem) => ({
        label: listItem.label?.[lang] ?? '',
        value: {
          label: listItem.label ?? null,
          value: listItem.value ?? null,
        },
      }))

  const selected = useMemo(
    () => vehicleList.find((listItem) => listItem?.isSelected === true),
    [vehicleList],
  )

  const selectedLabel = selected?.label?.[lang] ?? ''

  useEffect(() => {
    if (!selected) return

    if (dispatch && !getValue(item, 'label', valueIndex)) {
      dispatch({
        type: 'SET_LIST_VALUE',
        payload: {
          id: item.id,
          value: {
            label: removeTypename(selected.label),
            value: removeTypename(selected.value),
          },
          valueIndex,
        },
      })
    }

    const current = getValues(fieldName)
    if (!current) {
      setValue(fieldName, selectedLabel, { shouldValidate: true })
    }
  }, [
    selected,
    dispatch,
    item,
    valueIndex,
    getValues,
    fieldName,
    setValue,
    selectedLabel,
  ])

  const currentValue = () => {
    const storedLabel = getValue(item, 'label', valueIndex)
    const storedValue = getValue(item, 'value', valueIndex)

    const hasValue =
      storedLabel !== undefined &&
      storedLabel !== null &&
      storedValue !== undefined &&
      storedValue !== null

    if (!hasValue) {
      return undefined
    }

    return {
      label: storedLabel?.[lang] ?? '',
      value: {
        label: storedLabel,
        value: storedValue,
      },
    }
  }

  return (
    <Controller
      key={item.id + '-' + valueIndex}
      name={fieldName}
      control={control}
      defaultValue={
        getValue(item, 'label', valueIndex)?.[lang] ?? selectedLabel
      }
      rules={{
        required:
          item.isRequired &&
          !isLoading &&
          !(shouldFetch && vehiclesFetchHasError)
            ? { value: true, message: formatMessage(m.required) }
            : false,
        validate: () => {
          if (shouldFetch && vehiclesFetchHasError) {
            return formatMessage(m.listFetchFailed)
          }
          return true
        },
      }}
      render={({ field, fieldState }) =>
        shouldFetch && isLoading ? (
          <Box>
            <SkeletonLoader height={48} display="block" borderRadius="large" />
            <Box marginLeft={1}>
              <LoadingDots />
            </Box>
          </Box>
        ) : (
          <Select
            name="list"
            label={item.name?.[lang] ?? ''}
            options={mapToSelectItems(vehicleList)}
            required={item.isRequired ?? false}
            defaultValue={
              selected
                ? {
                    label: selected.label?.[lang] ?? '',
                    value: { label: selected.label, value: selected.value },
                  }
                : undefined
            }
            placeholder={formatMessage(m.select)}
            backgroundColor="blue"
            onChange={(option) => {
              field.onChange(option?.label ?? '')
              trigger(field.name)

              if (!dispatch) return

              dispatch({
                type: 'SET_LIST_VALUE',
                payload: {
                  id: item.id,
                  value: option?.value,
                  valueIndex,
                },
              })
            }}
            value={currentValue()}
            hasError={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
          />
        )
      }
    />
  )
}
