import { FormSystemApplicant } from '@island.is/api/schema'
import { Input, Stack, Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { NationalIdField } from './components/nationalIdField'
import {
  GET_NAME_BY_NATIONALID,
  GET_ADDRESS_BY_NATIONALID,
} from '@island.is/form-system/graphql'
import { m, webMessages } from '../../lib/messages'
import { useQuery } from '@apollo/client'
import { User } from './types'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'

interface Props {
  applicantType: FormSystemApplicant
  lang: 'is' | 'en'
  user?: User
}

// TODO: Implementation is still a WIP, still missing an endpoint
export const Agent = ({ applicantType, lang, user }: Props) => {
  const { formatMessage } = useIntl()
  const nationalId = user?.nationalId ?? ''
  const email =
    user?.emails.find((email: { primary: boolean }) => email.primary)?.email ??
    user?.emails[0]?.email
  const shouldQuery = !!nationalId
  const { data: nameData, loading: nameLoading } = useQuery(
    GET_NAME_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
    },
  )
  const { data: addressData, loading: addressLoading } = useQuery(
    GET_ADDRESS_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
    },
  )
  const address = addressData?.formSystemHomeByNationalId?.heimilisfang
  const isLoading = shouldQuery && (nameLoading || addressLoading)
  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicantType?.name?.[lang]}
      </Text>
      <Stack space={2}>
        {isLoading ? (
          <ApplicationLoading />
        ) : (
          <>
            <NationalIdField
              disabled={false}
              nationalId={nationalId}
              name={nameData?.formSystemNameByNationalId?.fulltNafn}
            />
            <Input
              label={formatMessage(m.address)}
              name="address"
              placeholder={formatMessage(m.address)}
              backgroundColor="blue"
              required={true}
              defaultValue={address?.husHeiti}
            />
            {/* TODO: This should be a dropdown menu */}
            <Input
              label={formatMessage(webMessages.postalCode)}
              name="postalCode"
              placeholder={formatMessage(webMessages.postalCode)}
              backgroundColor="blue"
              required={true}
              defaultValue={address?.postnumer}
            />
            <Input
              label={formatMessage(m.email)}
              name="email"
              placeholder={formatMessage(m.email)}
              backgroundColor="blue"
              required={true}
              defaultValue={email}
            />
            <Input
              label={formatMessage(m.phoneNumber)}
              name="phone"
              placeholder={formatMessage(m.phoneNumber)}
              backgroundColor="blue"
              required={true}
              defaultValue={user?.mobilePhoneNumber}
            />
          </>
        )}
      </Stack>
    </Box>
  )
}
