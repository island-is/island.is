import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { GET_FAMILY_MEMBERS } from '@island.is/form-system/graphql'
import {
  Box,
  LoadingDots,
  Select,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
}

type FamilyMember = {
  name: string
  nationalId: string
}

type FamilyOption = {
  label: string
  value: FamilyMember
}

type RegistryChild = {
  nationalId: string
  fullName?: string | null
  details?: { name?: { fullName?: string | null } | null } | null
}

export const Child = ({ item, valueIndex = 0, dispatch }: Props) => {
  const { lang } = useLocale()
  const { control, trigger } = useFormContext()
  const cached = (item.list?.length ?? 0) > 0
  const { data, loading } = useQuery(GET_FAMILY_MEMBERS, {
    skip: cached,
    onCompleted: (data) => {
      const children = (data?.nationalRegistryPerson?.biologicalChildren ??
        []) as RegistryChild[]
      dispatch?.({
        type: 'SET_FIELD_LIST',
        payload: {
          id: item.id,
          list: children.map((child) => {
            const name =
              child.details?.name?.fullName ??
              child.fullName ??
              child.nationalId
            return {
              id: child.nationalId,
              label: { is: name, en: name },
              value: child.nationalId,
              isSelected: false,
            }
          }),
          placeholder: null,
        },
      })
    },
  })
  const fieldName = `${item.id}.${valueIndex}`
  const selectedNationalId = getValue(item, 'nationalId', valueIndex) ?? ''

  const children = (data?.nationalRegistryPerson?.biologicalChildren ??
    []) as RegistryChild[]
  const options: FamilyOption[] = cached
    ? (item.list ?? []).flatMap((listItem) =>
        listItem?.value
          ? [
              {
                label: listItem.label?.[lang] ?? listItem.value,
                value: {
                  name: listItem.label?.[lang] ?? listItem.value,
                  nationalId: listItem.value,
                },
              },
            ]
          : [],
      )
    : children.map((child) => ({
        label:
          child.details?.name?.fullName ?? child.fullName ?? child.nationalId,
        value: {
          name:
            child.details?.name?.fullName ?? child.fullName ?? child.nationalId,
          nationalId: child.nationalId,
        },
      }))

  const selected = options.find(
    (option: FamilyOption) => option.value.nationalId === selectedNationalId,
  )

  if (loading && !cached) {
    return (
      <Box>
        <SkeletonLoader height={56} display="block" borderRadius="large" />
        <Box marginLeft={1}>
          <LoadingDots />
        </Box>
      </Box>
    )
  }

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={selectedNationalId}
      rules={{ required: item.isRequired ?? false }}
      render={({ field, fieldState }) => (
        <Select
          name="child"
          label={item.name?.[lang] ?? ''}
          placeholder="Veldu barn"
          options={options}
          value={selected}
          required={item.isRequired ?? false}
          backgroundColor="blue"
          isClearable={!item.isRequired}
          onChange={(option) => {
            const member = option?.value as FamilyMember | undefined
            const nationalId = member?.nationalId ?? ''
            const name = member?.name ?? ''

            field.onChange(nationalId)
            trigger(fieldName)
            dispatch?.({
              type: 'SET_NATIONAL_ID',
              payload: { id: item.id, value: nationalId, valueIndex },
            })
            dispatch?.({
              type: 'SET_NAME',
              payload: { id: item.id, value: name, valueIndex },
            })
          }}
          hasError={Boolean(fieldState.error)}
        />
      )}
    />
  )
}
