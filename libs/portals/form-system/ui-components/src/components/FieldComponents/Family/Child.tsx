import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { FamilyTypes } from '@island.is/form-system/enums'
import { GET_CUSTODY_CHILDREN } from '@island.is/form-system/graphql'
import { Box, LoadingDots, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { Action } from '../../../lib'
import { FieldTypesEnum } from '../../../lib/enums'
import { m } from '../../../lib/messages'
import { previewMockData } from '../../../lib/previewMockData'
import { ChildrenTable } from './ChildrenTable'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  isPreview?: boolean
}

type FamilyMember = {
  name: string
  nationalId: string
}

type RegistryChild = {
  nationalId: string
  fullName?: string | null
}

type CustodyChildrenData = {
  formSystemCustodyChildren: RegistryChild[]
}

type ChildFormValues = Record<string, (string[] | null)[]>

const ChildTable = ({
  item,
  members,
  dispatch,
  isPreview,
  errorMessage,
}: Props & { members: FamilyMember[]; errorMessage?: string }) => {
  const { lang, formatMessage } = useLocale()
  const { control, trigger } = useFormContext<ChildFormValues>()
  const savedIds = (item.values ?? []).flatMap((value) =>
    value?.json?.nationalId ? [value.json.nationalId] : [],
  )
  const { field: selection, fieldState } = useController<
    ChildFormValues,
    `${string}.0`
  >({
    name: `${item.id}.0`,
    control,
    defaultValue: isPreview
      ? null
      : item.values?.length === 0 || savedIds.length > 0
      ? savedIds
      : null,
    rules: {
      validate: (ids) =>
        !item.isRequired ||
        members.some(
          (member) => ids === null || ids.includes(member.nationalId),
        ) ||
        formatMessage(m.atLeastOneChildRequired),
    },
  })
  const selectedIds = selection.value
  const selectedMembers = members.filter(
    (member) => selectedIds === null || selectedIds.includes(member.nationalId),
  )

  useEffect(() => {
    if (errorMessage) return

    if (
      item.values?.length === selectedMembers.length &&
      selectedMembers.every(
        (member, index) =>
          item.values?.[index]?.json?.nationalId === member.nationalId &&
          item.values?.[index]?.json?.name === member.name,
      )
    ) {
      return
    }

    dispatch?.({
      type: 'SET_FIELD_VALUES',
      payload: {
        id: item.id,
        values: selectedMembers.map((member, order) => ({
          id:
            item.values?.find(
              (value) => value?.json?.nationalId === member.nationalId,
            )?.id ?? uuid(),
          order,
          json: member,
        })),
      },
    })
  }, [dispatch, errorMessage, item.id, item.values, selectedMembers])

  return (
    <ChildrenTable
      label={item.name?.[lang] ?? ''}
      required={item.isRequired ?? false}
      members={members}
      errorMessage={errorMessage}
      validationMessage={fieldState.error?.message}
      selectedNationalIds={selectedMembers.map((member) => member.nationalId)}
      onSelectionChange={(nationalId, checked) => {
        selection.onChange(
          members
            .filter((member) =>
              member.nationalId === nationalId
                ? checked
                : selectedIds === null ||
                  selectedIds.includes(member.nationalId),
            )
            .map((member) => member.nationalId),
        )
        trigger(selection.name)
      }}
    />
  )
}

export const Child = ({ item, dispatch, isPreview = false }: Props) => {
  const { lang, formatMessage } = useLocale()
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

  useEffect(() => {
    if (isPreview || cached || !loading) return

    dispatch?.({
      type: 'SET_FIELD_LOADING',
      payload: { id: item.id, loading: true },
    })

    return () => {
      dispatch?.({
        type: 'SET_FIELD_LOADING',
        payload: { id: item.id, loading: false },
      })
    }
  }, [cached, dispatch, isPreview, item.id, loading])

  const children =
    (isPreview
      ? previewMockData[FieldTypesEnum.FAMILY][FamilyTypes.CHILD]
      : data
    )?.formSystemCustodyChildren ?? []
  const members: FamilyMember[] = cached
    ? (item.list ?? []).flatMap((listItem) =>
        listItem?.value
          ? [
              {
                name: listItem.label?.[lang] ?? listItem.value,
                nationalId: listItem.value,
              },
            ]
          : [],
      )
    : children.map((child) => ({
        name: child.fullName ?? child.nationalId,
        nationalId: child.nationalId,
      }))

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
    <ChildTable
      key={item.id}
      item={item}
      members={members}
      dispatch={dispatch}
      isPreview={isPreview}
      errorMessage={error ? formatMessage(m.basicErrorMessage) : undefined}
    />
  )
}
