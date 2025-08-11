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

interface Props {
  applicantType: FormSystemApplicant
  user: any
  lang: 'is' | 'en'
}

export const IndividualApplicant = ({
  applicantType,
  lang,
  user,
}: Props) => {
const { formatMessage } = useIntl()
const nationalId = user?.nationalId ?? '';
const shouldQuery: boolean = !!nationalId;
  const { data: nameData } = useQuery(GET_NAME_BY_NATIONALID, {
    variables: { input: nationalId },
    fetchPolicy: 'cache-first',
    skip: !shouldQuery,
  })
  const { data: addressData } = useQuery(GET_ADDRESS_BY_NATIONALID, {
    variables: { input: nationalId },
    fetchPolicy: 'cache-first',
    skip: !shouldQuery,
  })
  const address = addressData?.formSystemHomeByNationalId?.heimilisfang;
  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicantType?.name?.[lang]}
      </Text>
      <Stack space={2}>
        <NationalIdField disabled={true} nationalId={nationalId} name={nameData?.formSystemNameByNationalId?.fulltNafn} />
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
            <Input
              label={formatMessage(m.address)}
              name="address"
              placeholder={formatMessage(m.address)}
              disabled={true}
              value={address?.husHeiti}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
            <Box marginTop={[2, 2, 0, 0]}>
              <Input
                label={formatMessage(webMessages.postalCode)}
                name="postalCode"
                placeholder={formatMessage(webMessages.postalCode)}
                disabled={true}
                value={address?.postnumer}
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
        />
        <Input
          label={formatMessage(m.phoneNumber)}
          name="phone"
          placeholder={formatMessage(m.phoneNumber)}
          backgroundColor="blue"
          required={true}
          value={user?.mobilePhoneNumber}
        />
      </Stack>
    </Box>
  )
}
