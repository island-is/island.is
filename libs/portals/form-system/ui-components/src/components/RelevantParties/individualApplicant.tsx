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
  dispatch
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
            value: data.formSystemNameByNationalId.fulltNafn,
          },
        })
      }
    },
  )

  const { data: addressData, loading: addressLoading } = useQuery(
    GET_ADDRESS_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
      onCompleted: (data) => {
        dispatch({
          type: 'SET_ADDRESS',
          payload: {
            id: applicant.id,
            address: data.formSystemHomeByNationalId.heimilisfang,
            postalCode: data.formSystemHomeByNationalId.postnumer,
          },
        })
      }
    },
  )

  const address = addressData?.formSystemHomeByNationalId?.heimilisfang
  const phoneNumberCatcher = user?.mobilePhoneNumber ?? ''
  const emails =
    user?.emails?.find((email) => email.primary)?.email ??
    user?.emails?.[0]?.email
  const isLoading = shouldQuery && (nameLoading || addressLoading)
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    setEmail(emails ?? '')
    setPhoneNumber(phoneNumberCatcher)
    console.log(`email: ${emails} phone:${phoneNumberCatcher}`)
  }, [emails, phoneNumberCatcher])

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
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label={formatMessage(m.phoneNumber)}
              name="phone"
              placeholder={formatMessage(m.phoneNumber)}
              backgroundColor="blue"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </>
        )}
      </Stack>
    </Box>
  )
}
