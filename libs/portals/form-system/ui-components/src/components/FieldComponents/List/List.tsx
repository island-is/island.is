import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { Box, Text, Select, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useState } from 'react'
import { getValue } from '../../../lib/getValue'
import { Action } from '../../../lib/reducerTypes'
import { Controller, useFormContext } from 'react-hook-form'
import { m } from '../../../lib/messages'
import { countriesAsListItems } from '../../../lib/lists/countries.list'
import { ListTypesEnum } from '@island.is/form-system/enums'
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
}

type ListItem = {
  label: string
  value: object
}

const listTypePlaceholder = {
  lond: 'Veldu land',
  sveitarfelog: 'Veldu sveitarfélag',
  postnumer: 'Veldu póstnúmer',
}

export const List = ({
  item,
  dispatch,
  valueIndex = 0,
  slug,
  isTest,
  orgNationalId,
}: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger } = useFormContext()
  const [dataFromUrl] = useMutation(DATA_FROM_URL)
  const [urlList, setUrlList] = useState<(FormSystemListItem | null)[]>([])
  const [dataFromUrlHasError, setDataFromUrlHasError] = useState(false)

  const shouldFetch =
    item.fieldSettings?.listType === ListTypesEnum.LIST_FROM_URL ||
    item.fieldSettings?.listType === ListTypesEnum.ZENDESK_LIST

  const cached = (item.list?.length ?? 0) > 0

  const [isLoading, setIsLoading] = useState(shouldFetch && !cached)

  const handleFetchListFromUrl = async (): Promise<
    (FormSystemListItem | null)[]
  > => {
    if (!shouldFetch || !slug) return []

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

    setDataFromUrlHasError(Boolean(data?.formSystemDataFromUrl?.isError))

    return data?.formSystemDataFromUrl?.list ?? []
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
        const list = await handleFetchListFromUrl()

        dispatch?.({
          type: 'SET_FIELD_LIST',
          payload: {
            id: item.id,
            list: removeTypename(list),
          },
        })

        if (!cancelled) setUrlList(list)
      } catch (e) {
        if (!cancelled) setUrlList([])
        console.error('Error fetching data from url:', e)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
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
    switch (item.fieldSettings?.listType) {
      case ListTypesEnum.COUNTRIES:
        return countriesAsListItems()
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

  useEffect(() => {
    if (selected && dispatch) {
      if (!getValue(item, 'label', valueIndex)) {
        dispatch({
          type: 'SET_LIST_VALUE',
          payload: {
            id: item.id,
            value: {
              label: selected.label,
              value: selected.value,
            },
            valueIndex,
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    if (shouldFetch) trigger(item.id)
  }, [isLoading, shouldFetch, trigger, item.id])

  return (
    <Controller
      key={item.id}
      name={item.id}
      control={control}
      defaultValue={getValue(item, 'label', valueIndex)?.[lang] ?? ''}
      rules={{
        required:
          item.isRequired && !isLoading
            ? { value: true, message: formatMessage(m.required) }
            : false,
        validate: () => {
          if (shouldFetch && isLoading) return formatMessage(m.listIsLoading)
          if (shouldFetch && dataFromUrlHasError)
            return formatMessage(m.listFetchFailed) // add this message
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
            placeholder={
              listTypePlaceholder[
                item.fieldSettings?.listType as keyof typeof listTypePlaceholder
              ] ?? formatMessage(m.select)
            }
            backgroundColor="blue"
            onChange={(e) => {
              field.onChange(e)
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
