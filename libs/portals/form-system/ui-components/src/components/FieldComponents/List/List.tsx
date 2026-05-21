import {
  FormSystemField,
  FormSystemLanguageType,
  FormSystemListItem,
} from '@island.is/api/schema'
import { ListTypesEnum } from '@island.is/form-system/enums'
import { Box, Text, Select, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { getValue } from '../../../lib/getValue'
import { countriesAsListItems } from '../../../lib/lists/countries.list'
import { getCurrenciesList } from '../../../lib/lists/currencies.list'
import { getMunicipalitiesList } from '../../../lib/lists/municipalities.list'
import { getPostalCodesList } from '../../../lib/lists/postalCodes.list'
import { m } from '../../../lib/messages'
import { Action, ApplicationState } from '../../../lib'
import { DATA_FROM_URL, removeTypename } from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
  valueIndex?: number
  slug?: string
  isTest?: boolean
  orgNationalId?: string
  state?: ApplicationState
}

type ListItem = {
  label: string
  value: object
}

const listTypePlaceholder = {
  [ListTypesEnum.COUNTRIES]: {
    is: 'Veldu land',
    en: 'Select country',
  },
  [ListTypesEnum.MUNICIPALITIES]: {
    is: 'Veldu sveitarfélag',
    en: 'Select municipality',
  },
  [ListTypesEnum.POSTAL_CODES]: {
    is: 'Veldu póstnúmer',
    en: 'Select postal code',
  },
  [ListTypesEnum.CURRENCIES]: {
    is: 'Veldu gjaldmiðil',
    en: 'Select currency',
  },
} as const

export const List = ({
  item,
  dispatch,
  valueIndex = 0,
  slug,
  isTest,
  orgNationalId,
  state,
}: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger, setValue, getValues } = useFormContext()
  const [dataFromUrl] = useMutation(DATA_FROM_URL)
  const [urlList, setUrlList] = useState<(FormSystemListItem | null)[]>([])
  const [dataFromUrlHasError, setDataFromUrlHasError] = useState(false)

  const fieldName = `${item.id}.${valueIndex}`

  let listType = item.fieldSettings?.listType
  if (!listType) {
    listType = ListTypesEnum.CUSTOM
  }

  const shouldFetch =
    listType === ListTypesEnum.LIST_FROM_URL ||
    listType === ListTypesEnum.ZENDESK_FIELD_OPTIONS ||
    listType === ListTypesEnum.ZENDESK_CUSTOM_OBJECT

  const cached = (item.list?.length ?? 0) > 0

  const [isLoading, setIsLoading] = useState(shouldFetch && !cached)

  const handleFetchListFromUrl = async (): Promise<{
    list: (FormSystemListItem | null)[]
    placeholderFromUrl: FormSystemLanguageType | null
  }> => {
    if (!shouldFetch || !slug) return { list: [], placeholderFromUrl: null }

    try {
      const { data } = await dataFromUrl({
        variables: {
          input: {
            slug,
            isTest: Boolean(isTest),
            fieldId: item.id,
            orgNationalId,
          },
        },
      })

      const placeholderFromUrl =
        data?.formSystemDataFromUrl?.placeholder ?? null
      const list: (FormSystemListItem | null)[] =
        data?.formSystemDataFromUrl?.list ?? []
      setDataFromUrlHasError(Boolean(data?.formSystemDataFromUrl?.isError))

      return { list, placeholderFromUrl }
    } catch (e) {
      setDataFromUrlHasError(true)
      return { list: [], placeholderFromUrl: null }
    }
  }

  useEffect(() => {
    let cancelled = false
    if (!shouldFetch) {
      setIsLoading(false)
      return
    }

    if (cached) {
      setUrlList(item.list ?? [])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    ;(async () => {
      try {
        const { list, placeholderFromUrl } = await handleFetchListFromUrl()

        dispatch?.({
          type: 'SET_FIELD_LIST',
          payload: {
            id: item.id,
            list: removeTypename(list),
            placeholder: removeTypename(placeholderFromUrl),
          },
        })

        if (!cancelled) setUrlList(list)
      } catch (e) {
        if (!cancelled) setUrlList([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const listFromUrl = () => urlList

  const mapToListItems = (items: (FormSystemListItem | null)[]): ListItem[] =>
    items
      ?.filter((item): item is FormSystemListItem => item !== null)
      .map((item) => ({
        label: item.label?.[lang] ?? '',
        value: { label: item.label, value: item.value },
      })) ?? []

  const value = () => {
    const storedLabel = getValue(item, 'label', valueIndex)
    const storedValue = getValue(item, 'value', valueIndex)
    const hasValue =
      storedLabel !== undefined &&
      storedLabel !== null &&
      storedValue !== undefined &&
      storedValue !== null

    if (!hasValue) return undefined

    return {
      label: storedLabel?.[lang] ?? '',
      value: { label: storedLabel, value: storedValue },
    }
  }

  const listByType = () => {
    switch (listType) {
      case ListTypesEnum.COUNTRIES:
        return countriesAsListItems()
      case ListTypesEnum.MUNICIPALITIES:
        return getMunicipalitiesList()
      case ListTypesEnum.POSTAL_CODES:
        return getPostalCodesList()
      case ListTypesEnum.CURRENCIES:
        return getCurrenciesList()
      case ListTypesEnum.LIST_FROM_URL:
        return listFromUrl()
      default:
        return item.list ?? []
    }
  }

  const resolvedList = listByType()

  const selected = resolvedList?.find(
    (listItem) => listItem?.isSelected === true,
  )

  const selectedLabel = selected?.label?.[lang] ?? ''

  useEffect(() => {
    if (!selected) return

    if (dispatch) {
      if (!getValue(item, 'label', valueIndex)) {
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

  useEffect(() => {
    if (!shouldFetch) return
    if (isLoading) return
    if (dataFromUrlHasError) trigger(item.id) // only show fetch failure
  }, [shouldFetch, isLoading, dataFromUrlHasError, trigger, item.id])

  const externalPlaceholder = state?.externalListPlaceholders?.find(
    (p) => p.fieldId === item.id,
  )?.placeholder

  const placeholder =
    externalPlaceholder?.[lang] ||
    listTypePlaceholder[listType]?.[lang] ||
    formatMessage(m.select)

  return (
    <Controller
      key={`${item.id}-${valueIndex}`}
      name={fieldName}
      control={control}
      defaultValue={
        getValue(item, 'label', valueIndex)?.[lang] ?? selectedLabel
      }
      rules={{
        required:
          item.isRequired && !isLoading && !(shouldFetch && dataFromUrlHasError)
            ? { value: true, message: formatMessage(m.required) }
            : false,
        validate: () => {
          if (shouldFetch && isLoading) return formatMessage(m.listIsLoading)
          if (shouldFetch && dataFromUrlHasError)
            return formatMessage(m.listFetchFailed)
          return true
        },
      }}
      render={({ field, fieldState }) =>
        shouldFetch && isLoading ? (
          <Box>
            <SkeletonLoader height={48} display="block" borderRadius="large" />
            <Box marginTop={1}>
              <Text variant="small">{formatMessage(m.listIsLoading)}</Text>
            </Box>
          </Box>
        ) : (
          <Select
            name="list"
            label={item.name?.[lang] ?? ''}
            options={mapToListItems(resolvedList)}
            required={item.isRequired ?? false}
            defaultValue={
              selected
                ? {
                    label: selected.label?.[lang] ?? '',
                    value: { label: selected.label, value: selected.value },
                  }
                : undefined
            }
            placeholder={placeholder}
            backgroundColor="blue"
            onChange={(e) => {
              field.onChange(e?.label ?? '')
              trigger(field.name)
              if (!dispatch) return
              dispatch({
                type: 'SET_LIST_VALUE',
                payload: {
                  id: item.id,
                  value: e?.value,
                  valueIndex,
                },
              })
            }}
            value={value()}
            hasError={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )
      }
    />
  )
}
