import { FormSystemApplicant } from '@island.is/api/schema'
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

interface Props {
  applicantType: FormSystemApplicant
  user?: User
  lang: 'is' | 'en'
}

export const IndividualApplicant = ({ applicantType, lang, user }: Props) => {
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
              disabled={true}
              nationalId={nationalId}
              name={nameData?.formSystemNameByNationalId?.fulltNafn}
            />

            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                <Input
                  label={formatMessage(m.address)}
                  name="address"
                  placeholder={formatMessage(m.address)}
                  disabled={true}
                  defaultValue={address?.husHeiti}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                <Box marginTop={[2, 2, 0, 0]}>
                  <Input
                    label={formatMessage(webMessages.postalCode)}
                    name="postalCode"
                    placeholder={formatMessage(webMessages.postalCode)}
                    disabled={true}
                    defaultValue={address?.postnumer}
                  />
                </Box>
              </GridColumn>
            </GridRow>

            <Input
              label={formatMessage(m.email)}
              name="email"
              placeholder="Email"
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
