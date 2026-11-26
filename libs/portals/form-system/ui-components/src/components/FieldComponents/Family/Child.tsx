import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { FamilyTypes } from '@island.is/form-system/enums'
import { GET_CUSTODY_CHILDREN } from '@island.is/form-system/graphql'
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
import { FieldTypesEnum } from '../../../lib/enums'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { previewMockData } from '../../../lib/previewMockData'

interface Props {
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
  isPreview?: boolean
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
}

type CustodyChildrenData = {
  formSystemCustodyChildren: RegistryChild[]
}

export const Child = ({
  item,
  valueIndex = 0,
  dispatch,
  isPreview = false,
}: Props) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger } = useFormContext()
  const cached = !isPreview && (item.list?.length ?? 0) > 0
  const { data, loading, error } = useQuery<CustodyChildrenData>(
    GET_CUSTODY_CHILDREN,
    {
      skip: isPreview || cached,
      onCompleted: (data) => {
        const children = data.formSystemCustodyChildren
        dispatch?.({
          type: 'SET_FIELD_LIST',
          payload: {
            id: item.id,
            list: children.map((child) => {
              const name = child.fullName ?? child.nationalId
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
    },
  )
  const fieldName = `${item.id}.${valueIndex}`
  const selectedNationalId = getValue(item, 'nationalId', valueIndex) ?? ''

  const children =
    (isPreview
      ? previewMockData[FieldTypesEnum.FAMILY][FamilyTypes.CHILD]
      : data
    )?.formSystemCustodyChildren ?? []
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
        label: child.fullName ?? child.nationalId,
        value: {
          name: child.fullName ?? child.nationalId,
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
      rules={{
        required: {
          value: item.isRequired ?? false,
          message: formatMessage(m.required),
        },
      }}
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
          hasError={Boolean(error || fieldState.error)}
          errorMessage={
            error
              ? formatMessage(m.basicErrorMessage)
              : fieldState.error?.message
          }
        />
      )}
    />
  )
}
