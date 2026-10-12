import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { GET_FAMILY_MEMBERS } from '@island.is/form-system/graphql'
import {
  GridColumn as Column,
  GridRow as Row,
  Input,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
}

export const Spouse = ({ item, valueIndex = 0, dispatch }: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { control, setValue } = useFormContext()
  const { data, loading } = useQuery(GET_FAMILY_MEMBERS)
  const nationalIdField = `${item.id}.${valueIndex}`
  const nameField = `${item.id}.${valueIndex}_name`
  const maritalStatusField = `${item.id}.${valueIndex}_maritalStatus`
  const spouse = data?.nationalRegistryPerson?.spouse
  const nationalId = spouse?.nationalId ?? ''
  const name = spouse?.fullName ?? nationalId
  const maritalStatus = spouse?.maritalStatus ?? ''

  useEffect(() => {
    if (loading) {
      return
    }

    setValue(nationalIdField, nationalId)
    setValue(nameField, name)
    setValue(maritalStatusField, maritalStatus)
    dispatch?.({
      type: 'SET_NATIONAL_ID',
      payload: { id: item.id, value: nationalId, valueIndex },
    })
    dispatch?.({
      type: 'SET_NAME',
      payload: { id: item.id, value: name, valueIndex },
    })
    dispatch?.({
      type: 'SET_MARITAL_STATUS',
      payload: { id: item.id, value: maritalStatus, valueIndex },
    })
  }, [
    dispatch,
    item.id,
    loading,
    maritalStatus,
    maritalStatusField,
    name,
    nameField,
    nationalId,
    nationalIdField,
    setValue,
    valueIndex,
  ])

  return (
    <Stack space={2}>
      <Row>
        <Column span="10/10">
          <Controller
            name={nameField}
            control={control}
            defaultValue={getValue(item, 'name', valueIndex) ?? ''}
            render={({ field }) =>
              loading ? (
                <SkeletonLoader
                  height={72}
                  display="block"
                  borderRadius="large"
                />
              ) : (
                <Input
                  label={item.name?.[lang] ?? formatMessage(m.namePerson)}
                  name="spouseName"
                  backgroundColor="blue"
                  value={field.value}
                  readOnly
                />
              )
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span={['1/1', '1/1', '5/10']}>
          <Controller
            name={nationalIdField}
            control={control}
            defaultValue={getValue(item, 'nationalId', valueIndex) ?? ''}
            render={({ field }) =>
              loading ? (
                <SkeletonLoader
                  height={72}
                  display="block"
                  borderRadius="large"
                />
              ) : (
                <Input
                  label={formatMessage(m.nationalId)}
                  name="spouseNationalId"
                  backgroundColor="blue"
                  value={field.value}
                  readOnly
                />
              )
            }
          />
        </Column>
        <Column span={['1/1', '1/1', '5/10']}>
          <Controller
            name={maritalStatusField}
            control={control}
            defaultValue={getValue(item, 'maritalStatus', valueIndex) ?? ''}
            render={({ field }) =>
              loading ? (
                <SkeletonLoader
                  height={72}
                  display="block"
                  borderRadius="large"
                />
              ) : (
                <Input
                  label={formatMessage(m.maritalStatus)}
                  name="spouseMaritalStatus"
                  backgroundColor="blue"
                  value={field.value}
                  readOnly
                />
              )
            }
          />
        </Column>
      </Row>
    </Stack>
  )
}
