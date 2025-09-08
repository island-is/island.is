import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn,
  GridRow,
  Input,
  Stack,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m, webMessages } from '../../lib/messages'
import { NationalIdField } from './components/nationalIdField'
import {
  GET_NAME_BY_NATIONALID,
  GET_ADDRESS_BY_NATIONALID,
} from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'
import { User } from './types'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'
import { Dispatch, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Action } from '../../lib'
import { getValue } from '../../lib/getValue'
import { removeTypename } from '@island.is/form-system/graphql'

interface Props {
  applicant: FormSystemField
  actor: string
  dispatch: Dispatch<Action>
  user?: User
}

export const IndividualApplicant = ({
  applicant,
  user,
  actor,
  dispatch,
}: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const nationalId = actor !== '' ? actor : user?.nationalId ?? ''
  const shouldQuery = !!nationalId
  const { data: nameData, loading: nameLoading } = useQuery(
    GET_NAME_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
      onCompleted: (data) => {
        dispatch({
          type: 'SET_NAME',
          payload: {
            id: applicant.id,
            value: removeTypename(data.formSystemNameByNationalId.fulltNafn),
          },
        })
      },
    },
  )

  const { data: addressData, loading: addressLoading } = useQuery(
    GET_ADDRESS_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
      onCompleted: (data) => {
        const home = removeTypename(
          data.formSystemHomeByNationalId.heimilisfang,
        )
        dispatch({
          type: 'SET_ADDRESS',
          payload: {
            id: applicant.id,
            address: home.husheiti,
            postalCode: home.postnumer,
          },
        })
      },
    },
  )

  const onChange = (field: string, value: string) => {
    if (field === 'email') {
      dispatch({ type: 'SET_EMAIL', payload: { id: applicant.id, value } })
      setEmail(value)
    } else if (field === 'phone') {
      dispatch({
        type: 'SET_PHONE_NUMBER',
        payload: { id: applicant.id, value },
      })
      setPhoneNumber(value)
    }
  }

  const address = addressData?.formSystemHomeByNationalId?.heimilisfang
  const isLoading = shouldQuery && (nameLoading || addressLoading)

  const [email, setEmail] = useState(
    user?.emails?.find((email) => email.primary)?.email ??
      user?.emails?.[0]?.email ??
      getValue(applicant, 'email'),
  )
  const [phoneNumber, setPhoneNumber] = useState(
    user?.mobilePhoneNumber ?? getValue(applicant, 'phoneNumber') ?? '',
  )

  useEffect(() => {
    dispatch({
      type: 'SET_NATIONAL_ID',
      payload: { id: applicant.id, value: nationalId },
    })
  }, [dispatch, applicant.id, nationalId])

  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicant?.name?.[lang]}
      </Text>
      <Stack space={2}>
        {isLoading ? (
          <ApplicationLoading />
        ) : (
          <>
            <NationalIdField
              disabled
              nationalId={nationalId}
              name={nameData?.formSystemNameByNationalId?.fulltNafn}
            />
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                <Input
                  label={formatMessage(m.address)}
                  name="address"
                  placeholder={formatMessage(m.address)}
                  disabled
                  value={address?.husHeiti ?? ''}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                <Box marginTop={[2, 2, 0, 0]}>
                  <Input
                    label={formatMessage(webMessages.postalCode)}
                    name="postalCode"
                    placeholder={formatMessage(webMessages.postalCode)}
                    disabled
                    value={address?.postnumer ?? ''}
                  />
                </Box>
              </GridColumn>
            </GridRow>
            <Input
              label={formatMessage(m.email)}
              name="email"
              placeholder={formatMessage(m.email)}
              backgroundColor="blue"
              required
              value={email}
              onChange={(e) => onChange('email', e.target.value)}
            />
            <Input
              label={formatMessage(m.phoneNumber)}
              name="phone"
              placeholder={formatMessage(m.phoneNumber)}
              backgroundColor="blue"
              required
              value={phoneNumber}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </>
        )}
      </Stack>
    </Box>
  )
}
